import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSlots } from "@/lib/slots";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(ip, "slots", { limit: 60, windowMs: 60 * 1000 });
  if (!allowed) return NextResponse.json({ error: "Demasiadas solicitudes." }, { status: 429 });

  try {
    const { searchParams } = new URL(req.url);
    const orgSlug = searchParams.get("orgSlug");
    const staffId = searchParams.get("staffId");
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");

    if (!orgSlug || !staffId || !serviceId || !date) {
      return NextResponse.json({ error: "Parámetros requeridos" }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({ where: { slug: orgSlug, active: true } });
    if (!org) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const dayOfWeek = new Date(date + "T00:00:00").getDay();

    const [service, schedule, existingAppointments, blockedSlots, vacations, staffRecord] =
      await Promise.all([
        prisma.service.findUnique({ where: { id: serviceId, active: true } }),
        prisma.workSchedule.findUnique({
          where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
        }),
        prisma.appointment.findMany({
          where: { staffId, date, status: { notIn: ["CANCELLED"] } },
          select: { startTime: true, endTime: true },
        }),
        prisma.blockedSlot.findMany({
          where: { organizationId: org.id, date, OR: [{ staffId: null }, { staffId }] },
          select: { startTime: true, endTime: true },
        }),
        prisma.vacationBlock.findMany({
          where: {
            organizationId: org.id,
            startDate: { lte: date },
            endDate: { gte: date },
            OR: [{ staffId: null }, { staffId }],
          },
        }),
        prisma.staff.findUnique({ where: { id: staffId } }),
      ]);

    if (!service || service.organizationId !== org.id) return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    if (!staffRecord || staffRecord.organizationId !== org.id) return NextResponse.json([]);
    if (vacations.length > 0) return NextResponse.json([]);
    if (!schedule || !schedule.enabled) return NextResponse.json([]);

    const slots = generateSlots({
      workStart: schedule.startTime,
      workEnd: schedule.endTime,
      durationMin: service.durationMin,
      bufferMin: schedule.bufferMin,
      existingAppointments,
      blockedSlots,
      date,
      minAdvanceHours: org.minAdvanceHours,
      appointmentsToday: existingAppointments.length,
      maxAppointmentsPerDay: staffRecord?.maxAppointmentsPerDay ?? null,
    });

    return NextResponse.json(slots);
  } catch (err) {
    console.error("[slots]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
