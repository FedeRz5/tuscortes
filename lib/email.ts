import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  return new Resend(key);
}

interface AppointmentConfirmationParams {
  to: string;
  clientName: string;
  orgName: string;
  orgPhone?: string | null;
  orgAddress?: string | null;
  confirmationMessage?: string | null;
  service: string;
  staff: string;
  date: string;       // "2026-04-15"
  startTime: string;  // "10:30"
  endTime: string;    // "11:00"
  price: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

export async function sendAppointmentConfirmation(params: AppointmentConfirmationParams) {
  const resend = getResend();
  const from = process.env.RESEND_FROM ?? "TusCortes <noreply@tuscortes.com.ar>";

  const dateFormatted = formatDate(params.date);
  const priceFormatted = formatPrice(params.price);

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Turno confirmado</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td style="background:#111827;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">TusCortes</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:800;">✅ Turno confirmado</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;">
              <p style="margin:0 0 24px;color:#374151;font-size:15px;">
                Hola <strong>${params.clientName}</strong>, tu turno en <strong>${params.orgName}</strong> quedó confirmado.
              </p>

              <!-- Appointment details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${row("📋 Servicio", params.service)}
                      ${row("✂️ Barbero", params.staff)}
                      ${row("📅 Fecha", dateFormatted)}
                      ${row("🕐 Horario", `${params.startTime} — ${params.endTime}`)}
                      ${row("💰 Precio", priceFormatted)}
                    </table>
                  </td>
                </tr>
              </table>

              ${params.confirmationMessage ? `
              <!-- Custom message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:3px solid #3b82f6;border-radius:0 8px 8px 0;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;color:#1d4ed8;font-size:14px;">${params.confirmationMessage}</p>
                  </td>
                </tr>
              </table>
              ` : ""}

              ${params.orgAddress || params.orgPhone ? `
              <!-- Contact info -->
              <p style="margin:0 0 6px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Datos de la barbería</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${params.orgAddress ? `<tr><td style="padding:3px 0;color:#374151;font-size:14px;">📍 ${params.orgAddress}</td></tr>` : ""}
                ${params.orgPhone ? `<tr><td style="padding:3px 0;color:#374151;font-size:14px;">📞 ${params.orgPhone}</td></tr>` : ""}
              </table>
              ` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                Este mail fue generado automáticamente por <strong>TusCortes</strong>.<br/>
                tuscortes.com.ar
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from,
    to: params.to,
    subject: `Turno confirmado en ${params.orgName} — ${params.startTime} del ${dateFormatted}`,
    html,
  });
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:6px 0;color:#6b7280;font-size:13px;width:40%;">${label}</td>
      <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${value}</td>
    </tr>
  `;
}
