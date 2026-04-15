import Image from "next/image";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { CopyButton } from "@/components/ui/copy-button";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user.organizationId) redirect("/login");

  const orgId = session.user.organizationId;
  const today = new Date().toISOString().split("T")[0];

  const [todayAppointments, totalThisMonth, pendingCount, staffCount, servicesCount, org] = await Promise.all([
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
    prisma.service.count({ where: { organizationId: orgId, active: true } }),
    prisma.organization.findUnique({ where: { id: orgId }, select: { slug: true } }),
  ]);

  const bookingUrl = org ? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://tuscortes.com"}/b/${org.slug}` : "";
  const qrUrl = bookingUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(bookingUrl)}&bgcolor=ffffff` : "";
  const showOnboarding = staffCount === 0 || servicesCount === 0;

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

      {/* Onboarding */}
      {showOnboarding && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="pt-5 pb-5">
            <p className="font-semibold text-indigo-900 mb-1">¡Bienvenido a TusCortes!</p>
            <p className="text-sm text-indigo-700 mb-4">Completá estos pasos para empezar a recibir turnos.</p>
            <div className="space-y-2">
              <OnboardingStep
                done={staffCount > 0}
                label="Agregá tu primer barbero"
                href="/dashboard/staff"
              />
              <OnboardingStep
                done={servicesCount > 0}
                label="Agregá un servicio"
                href="/dashboard/services"
              />
              <OnboardingStep
                done={staffCount > 0 && servicesCount > 0}
                label="Configurá los horarios"
                href="/dashboard/schedule"
              />
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Página pública + QR */}
      {bookingUrl && (
        <Card>
          <CardHeader><CardTitle>Tu página de reservas</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {qrUrl && (
                <Image src={qrUrl} alt="QR código de reservas" width={180} height={180} className="rounded-lg border border-zinc-200 shrink-0" unoptimized />
              )}
              <div className="space-y-3 flex-1 min-w-0">
                <p className="text-sm text-zinc-500">Compartí este link con tus clientes o mostrá el QR en tu local.</p>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                  <code className="flex-1 text-sm font-mono text-zinc-700 truncate">{bookingUrl}</code>
                  <CopyButton text={bookingUrl} />
                </div>
                <Link
                  href={bookingUrl.replace(process.env.NEXT_PUBLIC_APP_URL ?? "https://tuscortes.com", "")}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Ver página pública <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

function OnboardingStep({ done, label, href }: { done: boolean; label: string; href: string }) {
  return (
    <Link
      href={done ? "#" : href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        done
          ? "bg-white/60 text-indigo-400 cursor-default"
          : "bg-white hover:bg-indigo-100 text-indigo-800 font-medium"
      }`}
    >
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
        done ? "bg-green-500 text-white" : "bg-indigo-200 text-indigo-700"
      }`}>
        {done ? "✓" : "→"}
      </span>
      <span className={done ? "line-through" : ""}>{label}</span>
    </Link>
  );
}
