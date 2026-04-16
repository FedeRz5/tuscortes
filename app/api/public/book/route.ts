import { ok, err, withErrorHandler } from "@/lib/api";
import { BookingSchema } from "@/lib/schemas";
import { getLimits } from "@/lib/plans";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { generateSlots } from "@/lib/slots";
import { sendAppointmentConfirmation, sendNewAppointmentNotification } from "@/lib/email";
import { sendAppointmentConfirmationWA, sendNewAppointmentNotificationWA } from "@/lib/whatsapp";
import { generateCancelToken } from "@/lib/cancel-token";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const POST = withErrorHandler(async (req) => {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(ip, "book", { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!allowed) return err("Demasiados intentos. Intentá de nuevo en unos minutos.", 429);

  const body = await req.json();
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { orgSlug, staffId, serviceId, date, startTime, clientName, clientPhone, clientEmail, notes } = parsed.data;

  const org = await prisma.organization.findUnique({ where: { slug: orgSlug, active: true } });
  if (!org) return err("Barbería no encontrada", 404);

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
  if (!service || service.organizationId !== org.id) return err("Servicio no encontrado", 404);
  if (!staffMember || staffMember.organizationId !== org.id) return err("Barbero no encontrado", 404);

  const dayOfWeek = new Date(date + "T00:00:00").getDay();
  const schedule = await prisma.workSchedule.findUnique({
    where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
  });

  if (!schedule || !schedule.enabled) {
    return err("El barbero no trabaja ese día", 409);
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
    return err("Ese horario ya no está disponible. Por favor elegí otro.", 409);
  }

  let appointment;
  try {
    appointment = await prisma.appointment.create({
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return err("Ese horario ya fue tomado por otra persona. Por favor elegí otro.", 409);
    }
    throw e;
  }

  // Buscar dueño y preparar notificaciones en paralelo
  const cancelToken = generateCancelToken(appointment.id);
  const origin = new URL(req.url).origin;
  const cancelUrl = `${origin}/b/cancel?id=${appointment.id}&token=${cancelToken}`;

  const owner = await prisma.user.findFirst({
    where: { organizationId: org.id, role: "OWNER" },
    select: { email: true },
  });

  const notifications: Promise<unknown>[] = [
    // WhatsApp cliente (siempre)
    sendAppointmentConfirmationWA({
      clientPhone,
      clientName,
      orgName: org.name,
      orgPhone: org.phone,
      service: service.name,
      staff: staffMember.name,
      date,
      startTime,
      endTime: slot.endTime,
    }),
  ];

  if (clientEmail) {
    notifications.push(sendAppointmentConfirmation({
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
      cancelUrl,
    }));
  }

  if (owner?.email) {
    notifications.push(sendNewAppointmentNotification({
      to: owner.email,
      orgName: org.name,
      clientName,
      clientPhone,
      clientEmail,
      service: service.name,
      staff: staffMember.name,
      date,
      startTime,
      endTime: slot.endTime,
      price: service.price,
      notes,
    }));
  }

  if (org.phone) {
    notifications.push(sendNewAppointmentNotificationWA({
      ownerPhone: org.phone,
      clientName,
      clientPhone,
      service: service.name,
      staff: staffMember.name,
      date,
      startTime,
      endTime: slot.endTime,
    }));
  }

  // Esperar todas las notificaciones en paralelo — evita que Vercel corte la función antes de enviar
  const results = await Promise.allSettled(notifications);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[notifications] Error #${i}:`, r.reason);
  });

  return ok(appointment, 201);
});
