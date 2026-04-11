import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken) {
      return NextResponse.json({ error: "Link inválido" }, { status: 400 });
    }
    if (resetToken.used) {
      return NextResponse.json({ error: "Este link ya fue utilizado" }, { status: 400 });
    }
    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({ error: "El link expiró. Solicitá uno nuevo." }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[reset-password]", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
