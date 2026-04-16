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

  // Sanitiza strings para prevenir CSV injection
  const s = (v: string) => `"${String(v ?? "").replace(/^[=+\-@\t\r]/, "'$&").replace(/"/g, '""')}"`;

  // Fecha ISO → DD/MM/YYYY
  const fmtDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  // Precio → $12.500
  const fmtPrice = (n: number) =>
    "$" + Math.round(n).toLocaleString("es-AR");

  const STATUS_LABEL: Record<string, string> = {
    CONFIRMED: "Confirmado",
    COMPLETED: "Completado",
    PENDING: "Pendiente",
    CANCELLED: "Cancelado",
  };

  const totalCobrado = appointments.filter((a) => a.paid).reduce((sum, a) => sum + a.service.price, 0);
  const totalPorCobrar = appointments.filter((a) => !a.paid).reduce((sum, a) => sum + a.service.price, 0);
  const exportDate = fmtDate(new Date().toISOString().split("T")[0]);

  // Separador ; para Excel en español
  const SEP = ";";
  const row = (...cols: string[]) => cols.join(SEP);

  const lines = [
    // Encabezado del documento
    row(s(`Reporte de Ingresos — ${org.name}`), "", "", "", "", "", "", "", ""),
    row(s(`Exportado el ${exportDate}`), "", "", "", "", "", "", "", ""),
    row("", "", "", "", "", "", "", "", ""),
    // Columnas
    row("Fecha", "Hora inicio", "Hora fin", "Cliente", "Teléfono", "Servicio", "Barbero", "Precio", "Estado", "Cobrado"),
    // Datos
    ...appointments.map((a) =>
      row(
        fmtDate(a.date),
        a.startTime,
        a.endTime,
        s(a.clientName),
        s(a.clientPhone ?? ""),
        s(a.service.name),
        s(a.staff.name),
        fmtPrice(a.service.price),
        STATUS_LABEL[a.status] ?? a.status,
        a.paid ? "Sí" : "No",
      )
    ),
    // Totales
    row("", "", "", "", "", "", "", "", "", ""),
    row("", "", "", "", "", "", "", s("Total cobrado"), s(fmtPrice(totalCobrado)), ""),
    row("", "", "", "", "", "", "", s("Por cobrar"), s(fmtPrice(totalPorCobrar)), ""),
    row("", "", "", "", "", "", "", s("TOTAL"), s(fmtPrice(totalCobrado + totalPorCobrar)), ""),
  ];

  // BOM UTF-8 para que Excel abra correctamente los acentos
  const BOM = "\uFEFF";
  const csv = BOM + lines.join("\r\n");
  const filename = `ingresos-${org.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
});
