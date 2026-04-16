"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { Download, CheckCircle2, Circle } from "lucide-react";
import type { Appointment, Service, Staff } from "@prisma/client";

type AppointmentFull = Appointment & { service: Service; staff: Staff };

interface PeriodStats {
  total: number;
  collected: number;
  count: number;
}

interface StaffStat {
  id: string;
  name: string;
  count: number;
  total: number;
  collected: number;
}

interface Props {
  stats: {
    today: PeriodStats;
    week: PeriodStats;
    month: PeriodStats;
  };
  staffStats: StaffStat[];
  appointments: AppointmentFull[];
  canExport: boolean;
}

const PERIODS = [
  { key: "today" as const, label: "Hoy" },
  { key: "week" as const, label: "Esta semana" },
  { key: "month" as const, label: "Este mes" },
];

export function RevenueClient({ stats, staffStats, appointments: initial, canExport }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [activePeriod, setActivePeriod] = useState<"today" | "week" | "month">("today");
  const [exporting, setExporting] = useState(false);

  async function togglePaid(id: string, paid: boolean) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid }),
    });
    if (res.ok) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, paid } : a)));
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/dashboard/revenue/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ingresos-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const current = stats[activePeriod];
  const pending = current.total - current.collected;

  // Group appointments by date for the table
  const byDate = appointments.reduce<Record<string, AppointmentFull[]>>((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Ingresos</h1>
          <p className="text-zinc-500 text-sm mt-1">Control de caja y facturación</p>
        </div>
        {canExport && (
          <Button variant="outline" onClick={handleExport} disabled={exporting} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Exportando..." : "Exportar CSV"}
          </Button>
        )}
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActivePeriod(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activePeriod === key
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-zinc-500">Cobrado</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{formatPrice(current.collected)}</p>
            <p className="text-xs text-zinc-400 mt-1">{current.count} turno{current.count !== 1 ? "s" : ""}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Circle className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-zinc-500">Por cobrar</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{formatPrice(pending)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats por barbero */}
      {staffStats.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Por barbero · este mes
          </h2>
          <div className="space-y-2">
            {staffStats.map((s) => {
              const rate = s.total > 0 ? Math.round((s.collected / s.total) * 100) : 0;
              return (
                <Card key={s.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {s.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{s.name}</p>
                          <p className="text-xs text-zinc-400">{s.count} turno{s.count !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-xs text-zinc-400">Facturado</p>
                          <p className="font-semibold text-zinc-900">{formatPrice(s.total)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-400">Cobrado</p>
                          <p className="font-semibold text-green-700">{formatPrice(s.collected)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-400">Cobrado</p>
                          <p className={`font-semibold ${rate >= 80 ? "text-green-700" : rate >= 50 ? "text-amber-600" : "text-red-600"}`}>{rate}%</p>
                        </div>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    <div className="mt-3 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${rate}%` }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointments table */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Historial de turnos
        </h2>

        {Object.keys(byDate).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-zinc-400">
              No hay turnos para mostrar
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(byDate).map(([date, apts]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {formatDate(date)}
                </p>
                <div className="space-y-2">
                  {apts.map((apt) => (
                    <Card key={apt.id}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="text-sm font-mono text-zinc-500 shrink-0 pt-0.5">{apt.startTime}</span>
                            <div className="min-w-0">
                              <p className="font-medium text-zinc-900 truncate">{apt.clientName}</p>
                              <p className="text-zinc-400 text-xs mt-0.5">{apt.service.name} · {apt.staff.name}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="font-semibold text-zinc-900 text-sm">{formatPrice(apt.service.price)}</span>
                            <Badge variant={apt.status === "CANCELLED" ? "danger" : apt.status === "COMPLETED" ? "success" : "default"}>
                              {apt.status === "CANCELLED" ? "Cancelado" : apt.status === "COMPLETED" ? "Completado" : apt.status === "CONFIRMED" ? "Confirmado" : "Pendiente"}
                            </Badge>
                          </div>
                        </div>
                        {apt.status !== "CANCELLED" && (
                          <div className="mt-2 pt-2 border-t border-zinc-50">
                            <button
                              onClick={() => togglePaid(apt.id, !apt.paid)}
                              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                                apt.paid
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                              }`}
                            >
                              {apt.paid ? (
                                <><CheckCircle2 className="h-3.5 w-3.5" /> Cobrado</>
                              ) : (
                                <><Circle className="h-3.5 w-3.5" /> Marcar cobrado</>
                              )}
                            </button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
