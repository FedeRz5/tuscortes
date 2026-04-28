import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendAppointmentConfirmation, sendNewAppointmentNotification, sendStaffNewAppointmentNotification } from "@/lib/email";
import { sendAppointmentConfirmationWA, sendNewAppointmentNotificationWA } from "@/lib/whatsapp";
import { generateCancelToken } from "@/lib/cancel-token";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // MP envía distintos tipos de notificaciones
  if (body.type !== "payment") return NextResponse.json({ ok: true });

  const paymentId = body.data?.id;
  if (!paymentId) return NextResponse.json({ ok: true });

  // Buscar el pago en MP para obtener el external_reference (appointmentId)
  const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });

  if (!paymentRes.ok) return NextResponse.json({ ok: true });
  const payment = await paymentRes.json();

  if (payment.status !== "approved") return NextResponse.json({ ok: true });

  const appointmentId = payment.external_reference;
  if (!appointmentId) return NextResponse.json({ ok: true });

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { organization: true, service: true, staff: true },
  });

  if (!appointment || appointment.depositStatus !== "PENDING_PAYMENT") {
    return NextResponse.json({ ok: true });
  }

  // Confirmar turno
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: "CONFIRMED",
      depositStatus: "PAID",
      mpPaymentId: String(paymentId),
    },
  });

  // Enviar notificaciones
  const cancelToken = generateCancelToken(appointmentId);
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://tuscortes.com";
  const cancelUrl = `${origin}/b/cancel?id=${appointmentId}&token=${cancelToken}`;
  const { organization: org, service, staff, clientName, clientPhone, clientEmail, date, startTime, endTime, notes } = appointment;

  const owner = await prisma.user.findFirst({
    where: { organizationId: org.id, role: "OWNER" },
    select: { email: true },
  });

  const notifications: Promise<unknown>[] = [
    sendAppointmentConfirmationWA({ clientPhone, clientName, orgName: org.name, orgPhone: org.phone, service: service.name, staff: staff.name, date, startTime, endTime }),
  ];

  if (clientEmail) {
    notifications.push(sendAppointmentConfirmation({ to: clientEmail, clientName, orgName: org.name, orgPhone: org.phone, orgAddress: org.address, confirmationMessage: org.bookingConfirmationMessage, service: service.name, staff: staff.name, date, startTime, endTime, price: service.price, cancelUrl }));
  }
  if (owner?.email) {
    notifications.push(sendNewAppointmentNotification({ to: owner.email, orgName: org.name, clientName, clientPhone, clientEmail, service: service.name, staff: staff.name, date, startTime, endTime, price: service.price, notes }));
  }
  if (staff.email) {
    notifications.push(sendStaffNewAppointmentNotification({ to: staff.email, staffName: staff.name, orgName: org.name, clientName, clientPhone, clientEmail, service: service.name, date, startTime, endTime, notes }));
  }
  if (org.phone) {
    notifications.push(sendNewAppointmentNotificationWA({ ownerPhone: org.phone, clientName, clientPhone, service: service.name, staff: staff.name, date, startTime, endTime }));
  }

  await Promise.allSettled(notifications);
  return NextResponse.json({ ok: true });
}
