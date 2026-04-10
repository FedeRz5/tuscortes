import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Calendar, TrendingUp, Sparkles, Star, Zap } from "lucide-react";

export default async function SuperadminPage() {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const monthStartDate = new Date(monthStart + "T00:00:00");

  const [
    orgCount,
    activeOrgs,
    totalAppointments,
    totalStaff,
    byPlan,
    newThisMonth,
    appointmentsThisMonth,
    recentOrgs,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.organization.count({ where: { active: true } }),
    prisma.appointment.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.staff.count({ where: { active: true } }),
    prisma.organization.groupBy({ by: ["plan"], _count: { _all: true } }),
    prisma.organization.count({ where: { createdAt: { gte: monthStartDate } } }),
    prisma.appointment.count({ where: { date: { gte: monthStart }, status: { not: "CANCELLED" } } }),
    prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { appointments: true, staff: true } } },
    }),
  ]);

  const planMap = Object.fromEntries(byPlan.map((p) => [p.plan, p._count._all]));

  const stats = [
    { label: "Barberías totales", value: orgCount, sub: `${newThisMonth} nuevas este mes`, icon: Building2, color: "text-blue-600" },
    { label: "Barberías activas", value: activeOrgs, sub: `${orgCount - activeOrgs} inactivas`, icon: TrendingUp, color: "text-green-600" },
    { label: "Turnos este mes", value: appointmentsThisMonth, sub: `${totalAppointments} totales históricos`, icon: Calendar, color: "text-purple-600" },
    { label: "Barberos activos", value: totalStaff, sub: "en toda la plataforma", icon: Users, color: "text-orange-600" },
  ];

  const plans = [
    { label: "Starter", key: "FREE", icon: Zap, color: "bg-zinc-100 text-zinc-700" },
    { label: "Pro", key: "PRO", icon: Star, color: "bg-blue-50 text-blue-700" },
    { label: "Premium", key: "PREMIUM", icon: Sparkles, color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Panel de administración</h1>
        <p className="text-zinc-500 text-sm mt-1">Vista global de la plataforma</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{label}</p>
                  <p className="text-3xl font-bold text-zinc-900 mt-1">{value}</p>
                  <p className="text-xs text-zinc-400 mt-1">{sub}</p>
                </div>
                <Icon className={`h-7 w-7 ${color} mt-0.5`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Distribución por plan */}
      <div className="grid grid-cols-3 gap-4">
        {plans.map(({ label, key, icon: Icon, color }) => (
          <Card key={key}>
            <CardContent className="pt-5 pb-5">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${color}`}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
              <p className="text-3xl font-bold text-zinc-900">{planMap[key] ?? 0}</p>
              <p className="text-xs text-zinc-400 mt-0.5">barberías</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Barberías recientes */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Barberías recientes</h2>
          <div className="space-y-3">
            {recentOrgs.map((org) => (
              <div key={org.id} className="flex items-center justify-between rounded-lg border border-zinc-100 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: org.primaryColor }}
                  >
                    {org.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{org.name}</p>
                    <p className="text-xs text-zinc-400">/b/{org.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span>{org._count.staff} barberos</span>
                  <span>{org._count.appointments} turnos</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      org.active ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {org.active ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
