import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { hasFeature } from "@/lib/plans";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async (req) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = session.user.organizationId;
  if (!orgId) return err("Sin organización", 403);

  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { plan: true } });
  if (!org) return err("Organización no encontrada", 404);

  if (!hasFeature(org.plan, "revenueModule")) {
    return err("El módulo de ingresos está disponible a partir del plan Pro.", 403);
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Inicio de semana (lunes)
  const dayOfWeek = today.getDay(); // 0=dom
  const diffToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);
  const weekStartStr = monday.toISOString().split("T")[0];

  // Inicio de mes
  const monthStartStr = `${todayStr.slice(0, 7)}-01`;

  const [todayApts, weekApts, monthApts, recentApts] = await Promise.all([
    prisma.appointment.findMany({
      where: { organizationId: orgId, date: todayStr, status: { notIn: ["CANCELLED"] } },
      include: { service: true, staff: true },
    }),
    prisma.appointment.findMany({
      where: { organizationId: orgId, date: { gte: weekStartStr, lte: todayStr }, status: { notIn: ["CANCELLED"] } },
      include: { service: true, staff: true },
    }),
    prisma.appointment.findMany({
      where: { organizationId: orgId, date: { gte: monthStartStr, lte: todayStr }, status: { notIn: ["CANCELLED"] } },
      include: { service: true, staff: true },
    }),
    // Últimos 50 turnos para la tabla
    prisma.appointment.findMany({
      where: { organizationId: orgId, date: { lte: todayStr } },
      include: { service: true, staff: true },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
      take: 50,
    }),
  ]);

  const sum = (apts: typeof todayApts) => apts.reduce((acc, a) => acc + a.service.price, 0);
  const paidSum = (apts: typeof todayApts) => apts.filter((a) => a.paid).reduce((acc, a) => acc + a.service.price, 0);

  return ok({
    stats: {
      today: { total: sum(todayApts), collected: paidSum(todayApts), count: todayApts.length },
      week: { total: sum(weekApts), collected: paidSum(weekApts), count: weekApts.length },
      month: { total: sum(monthApts), collected: paidSum(monthApts), count: monthApts.length },
    },
    appointments: recentApts,
  });
});
