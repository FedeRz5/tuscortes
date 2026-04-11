import prisma from "@/lib/prisma";
import { sendAppointmentReminder } from "@/lib/email";
import { sendAppointmentReminderWA } from "@/lib/whatsapp";

export const GET = async (req: Request) => {
  // Verificar autenticación del cron (solo en producción)
  if (process.env.NODE_ENV === "production") {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  // Calcular fecha de mañana en zona horaria de Argentina
  const tomorrowStr = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(Date.now() + 24 * 60 * 60 * 1000));

  // Buscar turnos de mañana que no tengan recordatorio enviado (máx 200 para evitar timeout)
  const appointments = await prisma.appointment.findMany({
    where: {
      date: tomorrowStr,
      status: { notIn: ["CANCELLED"] },
      reminderSentAt: null,
    },
    take: 200,
    include: {
      service: true,
      staff: true,
      organization: true,
    },
  });

  let sent = 0;
  let errors = 0;

  for (const apt of appointments) {
    const org = apt.organization;

    // Email
    if (apt.clientEmail) {
      try {
        await sendAppointmentReminder({
          to: apt.clientEmail,
          clientName: apt.clientName,
          orgName: org.name,
          orgPhone: org.phone,
          orgAddress: org.address,
          service: apt.service.name,
          staff: apt.staff.name,
          date: apt.date,
          startTime: apt.startTime,
          endTime: apt.endTime,
          price: apt.service.price,
        });
      } catch (e) {
        console.error("[cron] Error email reminder:", apt.id, e);
        errors++;
      }
    }

    // WhatsApp
    try {
      await sendAppointmentReminderWA({
        clientPhone: apt.clientPhone,
        clientName: apt.clientName,
        orgName: org.name,
        orgPhone: org.phone,
        service: apt.service.name,
        staff: apt.staff.name,
        date: apt.date,
        startTime: apt.startTime,
        endTime: apt.endTime,
      });
    } catch (e) {
      console.error("[cron] Error WA reminder:", apt.id, e);
      errors++;
    }

    // Marcar como enviado
    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSentAt: new Date() },
    });
    sent++;
  }

  console.log(`[cron/reminders] ${tomorrowStr}: ${sent} enviados, ${errors} errores`);
  return Response.json({ date: tomorrowStr, sent, errors });
};
