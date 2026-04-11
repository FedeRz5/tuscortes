import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyCancelToken } from "@/lib/cancel-token";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  if (!id || !token) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  if (!verifyCancelToken(id, token)) {
    return NextResponse.json({ error: "Link inválido" }, { status: 403 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { service: true, staff: true, organization: true },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    id: appointment.id,
    status: appointment.status,
    clientName: appointment.clientName,
    service: appointment.service.name,
    staff: appointment.staff.name,
    date: appointment.date,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    orgName: appointment.organization.name,
  });
}

export async function POST(req: Request) {
  const { id, token } = await req.json();

  if (!id || !token) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  if (!verifyCancelToken(id, token)) {
    return NextResponse.json({ error: "Link inválido" }, { status: 403 });
  }

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
  }
  if (appointment.status === "CANCELLED") {
    return NextResponse.json({ error: "El turno ya fue cancelado" }, { status: 400 });
  }

  await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ success: true });
}
