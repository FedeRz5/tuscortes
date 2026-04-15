import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { hasFeature } from "@/lib/plans";
import { RevenueClient } from "./revenue-client";

export default async function RevenuePage() {
  const session = await getSession();
  if (!session?.user.organizationId) redirect("/login");

  const org = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
    select: { plan: true },
  });

  if (!org || !hasFeature(org.plan, "revenueModule")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="text-4xl">📊</div>
        <h1 className="text-2xl font-bold text-zinc-900">Módulo de Ingresos</h1>
        <p className="text-zinc-500 max-w-sm">
          El módulo de ingresos está disponible a partir del plan <strong>Pro</strong>.
          Actualizá tu plan para acceder a estadísticas y control de caja.
        </p>
        <div className="mt-2 inline-block rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-800">
          Plan actual: {org?.plan ?? "FREE"}
        </div>
      </div>
    );
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);
  const weekStartStr = monday.toISOString().split("T")[0];
  const monthStartStr = `${todayStr.slice(0, 7)}-01`;

  const orgId = session.user.organizationId;

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
    prisma.appointment.findMany({
      where: { organizationId: orgId, date: { lte: todayStr } },
      include: { service: true, staff: true },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
      take: 100,
    }),
  ]);

  const sum = (apts: typeof todayApts) => apts.reduce((acc, a) => acc + a.service.price, 0);
  const paidSum = (apts: typeof todayApts) => apts.filter((a) => a.paid).reduce((acc, a) => acc + a.service.price, 0);

  const staffMap: Record<string, { name: string; count: number; total: number; collected: number }> = {};
  for (const apt of monthApts) {
    const { id, name } = apt.staff;
    if (!staffMap[id]) staffMap[id] = { name, count: 0, total: 0, collected: 0 };
    staffMap[id].count++;
    staffMap[id].total += apt.service.price;
    if (apt.paid) staffMap[id].collected += apt.service.price;
  }
  const staffStats = Object.entries(staffMap)
    .map(([id, s]) => ({ id, ...s }))
    .sort((a, b) => b.total - a.total);

  return (
    <RevenueClient
      stats={{
        today: { total: sum(todayApts), collected: paidSum(todayApts), count: todayApts.length },
        week: { total: sum(weekApts), collected: paidSum(weekApts), count: weekApts.length },
        month: { total: sum(monthApts), collected: paidSum(monthApts), count: monthApts.length },
      }}
      staffStats={staffStats}
      appointments={recentApts}
      canExport={hasFeature(org.plan, "revenueExport")}
    />
  );
}
