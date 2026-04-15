import twilio from "twilio";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return twilio(sid, token);
}

function getFrom() {
  return process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886"; // sandbox default
}

/** Normalize any phone number to the whatsapp:+XXXXXXXXX format Twilio expects */
function waPhone(phone: string) {
  const normalized = phone.startsWith("+") ? phone : `+${phone}`;
  return `whatsapp:${normalized}`;
}

async function sendWhatsApp(to: string, body: string) {
  const client = getClient();
  if (!client) return;

  await client.messages.create({
    from: getFrom(),
    to: waPhone(to),
    body,
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ─── Confirmación al cliente ────────────────────────────────────────────────

interface AppointmentWAParams {
  clientPhone: string;
  clientName: string;
  orgName: string;
  orgPhone?: string | null;
  service: string;
  staff: string;
  date: string;      // "2026-04-15"
  startTime: string; // "10:30"
  endTime: string;
}

export async function sendAppointmentConfirmationWA(params: AppointmentWAParams) {
  const dateFormatted = formatDate(params.date);
  const message = [
    `✅ *Turno confirmado en ${params.orgName}*`,
    ``,
    `Hola ${params.clientName}! Tu turno quedó reservado:`,
    ``,
    `📋 *Servicio:* ${params.service}`,
    `✂️ *Barbero:* ${params.staff}`,
    `📅 *Fecha:* ${dateFormatted}`,
    `🕐 *Horario:* ${params.startTime} — ${params.endTime}`,
    params.orgPhone ? `📞 *Contacto:* ${params.orgPhone}` : null,
    ``,
    `_Powered by TusCortes_`,
  ].filter(Boolean).join("\n");

  await sendWhatsApp(params.clientPhone, message);
}

// ─── Recordatorio al cliente ────────────────────────────────────────────────

interface AppointmentReminderWAParams {
  clientPhone: string;
  clientName: string;
  orgName: string;
  orgPhone?: string | null;
  service: string;
  staff: string;
  date: string;
  startTime: string;
  endTime: string;
}

export async function sendAppointmentReminderWA(params: AppointmentReminderWAParams) {
  const dateFormatted = formatDate(params.date);
  const message = [
    `⏰ *Recordatorio de turno*`,
    ``,
    `Hola ${params.clientName}! Mañana tenés turno en *${params.orgName}*:`,
    ``,
    `📋 *Servicio:* ${params.service}`,
    `✂️ *Barbero:* ${params.staff}`,
    `📅 *Fecha:* ${dateFormatted}`,
    `🕐 *Horario:* ${params.startTime} — ${params.endTime}`,
    params.orgPhone ? `📞 *Contacto:* ${params.orgPhone}` : null,
    ``,
    `_Powered by TusCortes_`,
  ].filter(Boolean).join("\n");

  await sendWhatsApp(params.clientPhone, message);
}

// ─── Notificación al dueño ──────────────────────────────────────────────────

interface NewAppointmentWAParams {
  ownerPhone: string;
  clientName: string;
  clientPhone: string;
  service: string;
  staff: string;
  date: string;
  startTime: string;
  endTime: string;
}

export async function sendNewAppointmentNotificationWA(params: NewAppointmentWAParams) {
  const dateFormatted = formatDate(params.date);
  const message = [
    `📅 *Nuevo turno reservado*`,
    ``,
    `*${params.clientName}* reservó un turno:`,
    ``,
    `✂️ *Servicio:* ${params.service}`,
    `👤 *Barbero:* ${params.staff}`,
    `📅 *Fecha:* ${dateFormatted}`,
    `🕐 *Horario:* ${params.startTime} — ${params.endTime}`,
    `📞 *Tel cliente:* ${params.clientPhone}`,
  ].join("\n");

  await sendWhatsApp(params.ownerPhone, message);
}
