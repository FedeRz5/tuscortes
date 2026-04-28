import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Eliminar turnos PENDING_PAYMENT con más de 2 horas
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const { count } = await prisma.appointment.deleteMany({
    where: {
      depositStatus: "PENDING_PAYMENT",
      createdAt: { lt: cutoff },
    },
  });

  return NextResponse.json({ deleted: count });
}
