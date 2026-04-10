import { ok, err, withErrorHandler } from "@/lib/api";
import { BookingSchema } from "@/lib/schemas";
import { getLimits } from "@/lib/plans";
import prisma from "@/lib/prisma";
import { generateSlots } from "@/lib/slots";
import { sendAppointmentConfirmation } from "@/lib/email";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req) => {
  const body = await req.json();
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { orgSlug, staffId, serviceId, date, startTime, clientName, clientPhone, clientEmail, notes } = parsed.data;

  const org = await prisma.organization.findUnique({ where: { slug: orgSlug, active: true } });
  if (!org) return err("Organization not found", 404);

  // Verificar límite mensual de turnos según plan
  const limits = getLimits(org.plan);
  if (limits.maxAppointmentsPerMonth !== null) {
    const [year, month] = date.split("-");
    const startOfMonth = `${year}-${month}-01`;
    const endOfMonth = `${year}-${month}-31`;
    const monthlyCount = await prisma.appointment.count({
      where: {
        organizationId: org.id,
        date: { gte: startOfMonth, lte: endOfMonth },
        status: { notIn: ["CANCELLED"] },
      },
    });
    if (monthlyCount >= limits.maxAppointmentsPerMonth) {
      return err("La barbería alcanzó el límite de turnos de este mes.", 403);
    }
  }

  const [service, staffMember] = await Promise.all([
    prisma.service.findUnique({ where: { id: serviceId, active: true } }),
    prisma.staff.findUnique({ where: { id: staffId } }),
  ]);
  if (!service) return err("Service not found", 404);
  if (!staffMember) return err("Staff not found", 404);

  const dayOfWeek = new Date(date + "T00:00:00").getDay();
  const schedule = await prisma.workSchedule.findUnique({
    where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
  });

  if (!schedule || !schedule.enabled) {
    return err("Staff not available on this day", 409);
  }

  // Re-validar disponibilidad del slot (evitar race conditions)
  const [existingAppointments, blockedSlots] = await Promise.all([
    prisma.appointment.findMany({
      where: { staffId, date, status: { notIn: ["CANCELLED"] } },
      select: { startTime: true, endTime: true },
    }),
    prisma.blockedSlot.findMany({
      where: { organizationId: org.id, date, OR: [{ staffId: null }, { staffId }] },
      select: { startTime: true, endTime: true },
    }),
  ]);

  const slots = generateSlots({
    workStart: schedule.startTime,
    workEnd: schedule.endTime,
    durationMin: service.durationMin,
    bufferMin: schedule.bufferMin,
    existingAppointments,
    blockedSlots,
    date,
    minAdvanceHours: org.minAdvanceHours,
  });

  const slot = slots.find((s) => s.startTime === startTime);
  if (!slot || !slot.available) {
    return err("Slot no disponible. Por favor elegí otro horario.", 409);
  }

  const appointment = await prisma.appointment.create({
    data: {
      organizationId: org.id,
      serviceId,
      staffId,
      date,
      startTime,
      endTime: slot.endTime,
      clientName,
      clientPhone,
      clientEmail,
      notes,
      status: "CONFIRMED",
    },
  });

  // Enviar email de confirmación si el cliente dejó email
  if (clientEmail) {
    console.log("[email] Intentando enviar a:", clientEmail);
    sendAppointmentConfirmation({
      to: clientEmail,
      clientName,
      orgName: org.name,
      orgPhone: org.phone,
      orgAddress: org.address,
      confirmationMessage: org.bookingConfirmationMessage,
      service: service.name,
      staff: staffMember.name,
      date,
      startTime,
      endTime: slot.endTime,
      price: service.price,
    }).then(() => console.log("[email] Enviado OK a:", clientEmail))
      .catch((e) => console.error("[email] Error:", e));
  } else {
    console.log("[email] Sin email de cliente, no se envía.");
  }

  return ok(appointment, 201);
});
