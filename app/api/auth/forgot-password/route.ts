import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Siempre responder igual para no revelar si el email existe
    if (!user) return NextResponse.json({ success: true });

    // Invalidar tokens anteriores no usados
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, used: false },
    });

    // Crear nuevo token (expira en 1 hora)
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const origin = new URL(req.url).origin;
    const resetUrl = `${origin}/reset-password?token=${token}`;

    await sendPasswordResetEmail({ to: email, resetUrl });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[forgot-password]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
