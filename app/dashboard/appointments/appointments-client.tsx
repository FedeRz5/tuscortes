"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, STATUS_LABELS } from "@/lib/utils";
import { Phone, Clock, Scissors, User } from "lucide-react";
import type { Appointment, Service, Staff } from "@prisma/client";

type AppointmentFull = Appointment & { service: Service; staff: Staff };

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

const STATUS_BADGE: Record<string, "warning" | "info" | "success" | "danger" | "default"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export function AppointmentsClient({ appointments: initial }: { appointments: AppointmentFull[] }) {
  const [appointments, setAppointments] = useState(initial);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered =
    filterStatus === "ALL" ? appointments : appointments.filter((a) => a.status === filterStatus);

  // Group by date
  const byDate = filtered.reduce<Record<string, AppointmentFull[]>>((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
    return acc;
  }, {});

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Turnos</h1>
          <p className="text-zinc-500 text-sm mt-1">Próximos turnos agendados</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {Object.keys(byDate).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-400">
            No hay turnos para mostrar
          </CardContent>
        </Card>
      ) : (
        Object.entries(byDate).map(([date, apts]) => (
          <div key={date}>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              {formatDate(date)}
            </h2>
            <div className="space-y-3">
              {apts.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-center w-14 shrink-0 pt-0.5">
                          <p className="text-lg font-bold text-zinc-900 leading-tight">{apt.startTime}</p>
                          <p className="text-xs text-zinc-400">{apt.endTime}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900">{apt.clientName}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-zinc-500">
                            {apt.clientPhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" /> {apt.clientPhone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Scissors className="h-3.5 w-3.5" /> {apt.service.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" /> {apt.staff.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> {apt.service.durationMin} min
                            </span>
                          </div>
                          {apt.notes && (
                            <p className="text-sm text-zinc-400 mt-1 italic">{apt.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-17 sm:ml-0">
                        <Badge variant={STATUS_BADGE[apt.status] ?? "default"}>
                          {STATUS_LABELS[apt.status]}
                        </Badge>
                        <Select
                          value={apt.status}
                          onValueChange={(v) => updateStatus(apt.id, v)}
                        >
                          <SelectTrigger className="h-8 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
