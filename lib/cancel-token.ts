import { createHmac } from "crypto";

function secret() {
  return process.env.CANCEL_SECRET ?? process.env.AUTH_SECRET ?? "tuscortes-cancel";
}

export function generateCancelToken(appointmentId: string): string {
  return createHmac("sha256", secret()).update(appointmentId).digest("hex").slice(0, 32);
}

export function verifyCancelToken(appointmentId: string, token: string): boolean {
  return generateCancelToken(appointmentId) === token;
}
