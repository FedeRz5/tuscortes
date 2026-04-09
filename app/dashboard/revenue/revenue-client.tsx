"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { DollarSign, TrendingUp, Calendar, Download, CheckCircle2, Circle } from "lucide-react";
import type { Appointment, Service, Staff } from "@prisma/client";

type AppointmentFull = Appointment & { service: Service; staff: Staff };

interface PeriodStats {
  total: number;
  collected: number;
  count: number;
}

interface Props {
  stats: {
    today: PeriodStats;
    week: PeriodStats;
    month: PeriodStats;
  };
  appointments: AppointmentFull[];
  canExport: boolean;
}

const PERIODS = [
  { key: "today" as const, label: "Hoy" },
  { key: "week" as const, label: "Esta semana" },
  { key: "month" as const, label: "Este mes" },
];

export function RevenueClient({ stats, appointments: initial, canExport }: Props) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Ingresos</h1>
          <p className="text-zinc-500 text-sm mt-1">Control de caja y facturación</p>
        </div>
        {canExport && (
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-zinc-500">Cobrado</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{formatPrice(current.collected)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Circle className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-zinc-500">Pendiente</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{formatPrice(pending)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-zinc-500">Proyectado</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{formatPrice(current.total)}</p>
            <p className="text-xs text-zinc-400 mt-1">{current.count} turno{current.count !== 1 ? "s" : ""}</p>
          </CardContent>
        </Card>
      </div>

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
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-zinc-100">
                        {apts.map((apt) => (
                          <tr key={apt.id} className="flex items-center gap-4 px-4 py-3 flex-wrap">
                            <td className="w-14 shrink-0 font-mono text-zinc-700">{apt.startTime}</td>
                            <td className="flex-1 min-w-0">
                              <p className="font-medium text-zinc-900 truncate">{apt.clientName}</p>
                              <p className="text-zinc-400 text-xs">{apt.service.name} · {apt.staff.name}</p>
                            </td>
                            <td className="shrink-0 font-semibold text-zinc-900">
                              {formatPrice(apt.service.price)}
                            </td>
                            <td className="shrink-0">
                              <Badge variant={apt.status === "CANCELLED" ? "danger" : apt.status === "COMPLETED" ? "success" : "default"}>
                                {apt.status === "CANCELLED" ? "Cancelado" : apt.status === "COMPLETED" ? "Completado" : apt.status === "CONFIRMED" ? "Confirmado" : "Pendiente"}
                              </Badge>
                            </td>
                            <td className="shrink-0">
                              {apt.status !== "CANCELLED" && (
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
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
