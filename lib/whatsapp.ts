function getInstance() {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;
  if (!instanceId || !token) return null;
  return { instanceId, token };
}

async function sendWhatsApp(to: string, body: string) {
  const creds = getInstance();
  if (!creds) return; // Variables no configuradas → skip silencioso

  // UltraMsg espera el número sin el "+" al inicio
  const phone = to.replace(/^\+/, "");

  const res = await fetch(`https://api.ultramsg.com/${creds.instanceId}/messages/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token: creds.token, to: phone, body }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UltraMsg error: ${text}`);
  }
}

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

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
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
  ].filter(Boolean).join("\n");

  await sendWhatsApp(params.clientPhone, message);
}

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
  ].filter(Boolean).join("\n");

  await sendWhatsApp(params.clientPhone, message);
}

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
