import { ok, err, withErrorHandler } from "@/lib/api";
import prisma from "@/lib/prisma";
import { z } from "zod";

const Schema = z.object({ appointmentId: z.string() });

export const POST = withErrorHandler(async (req) => {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const appointment = await prisma.appointment.findUnique({
    where: { id: parsed.data.appointmentId },
    include: { organization: true, service: true },
  });

  if (!appointment) return err("Turno no encontrado", 404);
  if (!appointment.organization.mpAccessToken) return err("Barbería sin MercadoPago conectado", 400);
  if (appointment.depositStatus !== "PENDING_PAYMENT") return err("Este turno no requiere seña", 400);

  const origin = new URL(req.url).origin;

  const prefRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${appointment.organization.mpAccessToken}`,
    },
    body: JSON.stringify({
      items: [{
        title: `Seña — ${appointment.service.name} en ${appointment.organization.name}`,
        quantity: 1,
        unit_price: appointment.depositAmount,
        currency_id: "ARS",
      }],
      payer: {
        name: appointment.clientName,
        email: appointment.clientEmail ?? undefined,
      },
      back_urls: {
        success: `${origin}/b/deposit/success?id=${appointment.id}`,
        failure: `${origin}/b/deposit/failure?id=${appointment.id}`,
        pending: `${origin}/b/deposit/pending?id=${appointment.id}`,
      },
      auto_return: "approved",
      external_reference: appointment.id,
      notification_url: `${origin}/api/webhooks/mp`,
    }),
  });

  if (!prefRes.ok) return err("Error al crear preferencia de pago", 500);
  const pref = await prefRes.json();

  await prisma.appointment.update({
    where: { id: appointment.id },
    data: { mpPreferenceId: pref.id },
  });

  return ok({ preferenceId: pref.id, initPoint: pref.init_point });
});
