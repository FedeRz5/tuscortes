import { ok, err, withErrorHandler } from "@/lib/api";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const ContactSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  barberia: z.string().min(2, "Nombre de barbería muy corto"),
  idea: z.string().min(5, "Contanos un poco más").max(1000),
});

export const POST = withErrorHandler(async (req) => {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(ip, "contact", { limit: 3, windowMs: 60 * 60 * 1000 });
  if (!allowed) return err("Demasiados intentos. Intentá más tarde.", 429);

  const body = await req.json();
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { name, email, barberia, idea } = parsed.data;

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "TusCortes <noreply@tuscortes.com>",
    to: "federeiz8@gmail.com",
    replyTo: email,
    subject: `Nueva consulta de ${name} — ${barberia}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
        <h2 style="margin:0 0 24px;font-size:20px;color:#111111;">Nueva consulta desde TusCortes</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;width:140px;">Nombre</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111;">${email}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;">Barbería</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111;">${barberia}</td></tr>
          <tr><td style="padding:10px 0;color:#666;font-size:13px;vertical-align:top;">Mensaje</td><td style="padding:10px 0;font-size:13px;color:#111;white-space:pre-wrap;">${idea}</td></tr>
        </table>
      </div>
    `,
  });

  return ok({ sent: true });
});
