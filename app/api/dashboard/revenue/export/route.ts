import { requireAuth, err, withErrorHandler } from "@/lib/api";
import { hasFeature } from "@/lib/plans";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = session.user.organizationId;
  if (!orgId) return err("Sin organización", 403);

  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { plan: true, name: true } });
  if (!org) return err("Organización no encontrada", 404);

  if (!hasFeature(org.plan, "revenueExport")) {
    return err("La exportación CSV está disponible en el plan Premium.", 403);
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId: orgId,
      status: { notIn: ["CANCELLED"] },
      ...(from && { date: { gte: from } }),
      ...(to && { date: { lte: to } }),
    },
    include: { service: true, staff: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const header = "Fecha,Hora,Cliente,Teléfono,Servicio,Barbero,Precio,Estado,Cobrado";
  const rows = appointments.map((a) =>
    [
      a.date,
      a.startTime,
      `"${a.clientName}"`,
      a.clientPhone,
      `"${a.service.name}"`,
      `"${a.staff.name}"`,
      a.service.price.toFixed(2),
      a.status,
      a.paid ? "Sí" : "No",
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");
  const filename = `ingresos-${org.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
});
