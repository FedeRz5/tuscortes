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

  const [todayApts, weekApts, monthApts, recentApts, allMonthApts] = await Promise.all([
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
    // Todos los turnos del mes para stats por barbero
    prisma.appointment.findMany({
      where: { organizationId: orgId, date: { gte: monthStartStr, lte: todayStr }, status: { notIn: ["CANCELLED"] } },
      include: { service: { select: { price: true } }, staff: { select: { id: true, name: true } } },
    }),
  ]);

  const sum = (apts: typeof todayApts) => apts.reduce((acc, a) => acc + a.service.price, 0);
  const paidSum = (apts: typeof todayApts) => apts.filter((a) => a.paid).reduce((acc, a) => acc + a.service.price, 0);

  // Stats por barbero (mes actual)
  const staffMap: Record<string, { name: string; count: number; total: number; collected: number }> = {};
  for (const apt of allMonthApts) {
    const { id, name } = apt.staff;
    if (!staffMap[id]) staffMap[id] = { name, count: 0, total: 0, collected: 0 };
    staffMap[id].count++;
    staffMap[id].total += apt.service.price;
    if (apt.paid) staffMap[id].collected += apt.service.price;
  }
  const staffStats = Object.entries(staffMap)
    .map(([id, s]) => ({ id, ...s }))
    .sort((a, b) => b.total - a.total);

  return ok({
    stats: {
      today: { total: sum(todayApts), collected: paidSum(todayApts), count: todayApts.length },
      week: { total: sum(weekApts), collected: paidSum(weekApts), count: weekApts.length },
      month: { total: sum(monthApts), collected: paidSum(monthApts), count: monthApts.length },
    },
    staffStats,
    appointments: recentApts,
  });
});
