import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Calendar, TrendingUp } from "lucide-react";

export default async function SuperadminPage() {
  const [orgCount, activeOrgs, totalAppointments, totalStaff] = await Promise.all([
    prisma.organization.count(),
    prisma.organization.count({ where: { active: true } }),
    prisma.appointment.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.staff.count({ where: { active: true } }),
  ]);

  const recentOrgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { _count: { select: { appointments: true, staff: true } } },
  });

  const stats = [
    { label: "Barberías totales", value: orgCount, icon: Building2, color: "text-blue-600" },
    { label: "Barberías activas", value: activeOrgs, icon: TrendingUp, color: "text-green-600" },
    { label: "Turnos totales", value: totalAppointments, icon: Calendar, color: "text-purple-600" },
    { label: "Barberos activos", value: totalStaff, icon: Users, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Panel de administración</h1>
        <p className="text-zinc-500 text-sm mt-1">Vista global de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{label}</p>
                  <p className="text-3xl font-bold text-zinc-900 mt-1">{value}</p>
                </div>
                <Icon className={`h-8 w-8 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Barberías recientes</h2>
          <div className="space-y-3">
            {recentOrgs.map((org) => (
              <div key={org.id} className="flex items-center justify-between rounded-lg border border-zinc-100 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: org.primaryColor }}
                  >
                    {org.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{org.name}</p>
                    <p className="text-xs text-zinc-400">/{org.slug}</p>
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
