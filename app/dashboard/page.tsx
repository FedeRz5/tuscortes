import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user.organizationId) redirect("/login");

  const orgId = session.user.organizationId;
  const today = new Date().toISOString().split("T")[0];

  const [todayAppointments, totalThisMonth, pendingCount, staffCount] = await Promise.all([
    prisma.appointment.findMany({
      where: { organizationId: orgId, date: today },
      include: { service: true, staff: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.count({
      where: {
        organizationId: orgId,
        date: { gte: today.substring(0, 7) + "-01" },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.appointment.count({ where: { organizationId: orgId, status: "PENDING" } }),
    prisma.staff.count({ where: { organizationId: orgId, active: true } }),
  ]);

  const stats = [
    { label: "Turnos hoy", value: todayAppointments.length, icon: Calendar, color: "text-blue-600" },
    { label: "Este mes", value: totalThisMonth, icon: Clock, color: "text-purple-600" },
    { label: "Pendientes", value: pendingCount, icon: CheckCircle, color: "text-yellow-600" },
    { label: "Barberos activos", value: staffCount, icon: CheckCircle, color: "text-green-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Panel principal</h1>
        <p className="text-zinc-500">{formatDate(today)}</p>
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
        <CardHeader>
          <CardTitle>Turnos de hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-zinc-500 text-sm py-4 text-center">No hay turnos para hoy</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-4 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center w-16">
                      <p className="text-lg font-bold text-zinc-900">{apt.startTime}</p>
                      <p className="text-xs text-zinc-400">{apt.endTime}</p>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{apt.clientName}</p>
                      <p className="text-sm text-zinc-500">
                        {apt.service.name} · {apt.staff.name}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      apt.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800"
                        : apt.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : apt.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {apt.status === "PENDING"
                      ? "Pendiente"
                      : apt.status === "CONFIRMED"
                      ? "Confirmado"
                      : apt.status === "CANCELLED"
                      ? "Cancelado"
                      : "Completado"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
