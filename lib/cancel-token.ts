import { createHmac, timingSafeEqual } from "crypto";

function secret(): string {
  const s = process.env.CANCEL_SECRET ?? process.env.AUTH_SECRET;
  if (!s) throw new Error("Missing CANCEL_SECRET or AUTH_SECRET env variable");
  return s;
}

export function generateCancelToken(appointmentId: string): string {
  return createHmac("sha256", secret()).update(appointmentId).digest("hex").slice(0, 32);
}

export function verifyCancelToken(appointmentId: string, token: string): boolean {
  try {
    const expected = generateCancelToken(appointmentId);
    // timingSafeEqual previene timing attacks
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}
