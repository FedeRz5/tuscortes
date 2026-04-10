"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const DAY_START = 7 * 60;   // 07:00 in minutes
const DAY_END   = 21 * 60;  // 21:00 in minutes
const PX_PER_MIN = 1.5;
const TOTAL_HEIGHT = (DAY_END - DAY_START) * PX_PER_MIN;
const HOURS = Array.from({ length: DAY_END / 60 - DAY_START / 60 + 1 }, (_, i) => DAY_START / 60 + i);

// ─── Types ────────────────────────────────────────────────────────────────────
interface StaffMember { id: string; name: string; avatarUrl?: string | null }
interface Appointment {
  id: string; staffId: string; clientName: string; clientPhone: string;
  startTime: string; endTime: string; status: string;
  service: { name: string; price: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = addDays(today, 1);
  if (dateStr === today) return "Hoy";
  if (dateStr === tomorrow) return "Mañana";
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED:  "bg-blue-500",
  PENDING:    "bg-amber-400",
  COMPLETED:  "bg-green-500",
  CANCELLED:  "bg-zinc-300",
};

// ─── Component ────────────────────────────────────────────────────────────────
export function CalendarClient() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/calendar?date=${d}`);
      const data = await res.json();
      setStaff(data.staff ?? []);
      setAppointments(data.appointments ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(date); }, [date, fetchData]);

  const aptsByStaff = appointments.reduce<Record<string, Appointment[]>>((acc, apt) => {
    if (!acc[apt.staffId]) acc[apt.staffId] = [];
    acc[apt.staffId].push(apt);
    return acc;
  }, {});

  const nowMinutes = (() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  })();
  const isToday = date === new Date().toISOString().split("T")[0];
  const nowTop = isToday && nowMinutes >= DAY_START && nowMinutes <= DAY_END
    ? (nowMinutes - DAY_START) * PX_PER_MIN
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Agenda</h1>
          <p className="text-zinc-500 text-sm mt-0.5 capitalize">{formatDateLabel(date)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setDate((d) => addDays(d, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDate(new Date().toISOString().split("T")[0])}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={() => setDate((d) => addDays(d, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-24 text-zinc-400 text-sm">No hay barberos activos.</div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          {/* Staff headers */}
          <div className="grid border-b border-zinc-200" style={{ gridTemplateColumns: `56px repeat(${staff.length}, minmax(140px, 1fr))` }}>
            <div className="border-r border-zinc-100" />
            {staff.map((s) => (
              <div key={s.id} className="px-3 py-3 text-center border-r border-zinc-100 last:border-r-0">
                <p className="font-semibold text-zinc-900 text-sm">{s.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{aptsByStaff[s.id]?.length ?? 0} turno{(aptsByStaff[s.id]?.length ?? 0) !== 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>

          {/* Calendar body — scrollable */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
            <div className="grid" style={{ gridTemplateColumns: `56px repeat(${staff.length}, minmax(140px, 1fr))`, minWidth: `${56 + staff.length * 140}px` }}>
              {/* Time column */}
              <div className="border-r border-zinc-100">
                <div className="relative" style={{ height: `${TOTAL_HEIGHT}px` }}>
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="absolute w-full flex items-start justify-end pr-2"
                      style={{ top: `${(h * 60 - DAY_START) * PX_PER_MIN - 8}px` }}
                    >
                      <span className="text-[10px] text-zinc-400 font-mono leading-none">{String(h).padStart(2, "0")}:00</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff columns */}
              {staff.map((s) => (
                <div key={s.id} className="border-r border-zinc-100 last:border-r-0">
                  <div className="relative" style={{ height: `${TOTAL_HEIGHT}px` }}>
                    {/* Hour lines */}
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        className="absolute w-full border-t border-zinc-100"
                        style={{ top: `${(h * 60 - DAY_START) * PX_PER_MIN}px` }}
                      />
                    ))}

                    {/* Current time indicator */}
                    {nowTop !== null && (
                      <div className="absolute w-full z-10 flex items-center" style={{ top: `${nowTop}px` }}>
                        <div className="h-2 w-2 rounded-full bg-red-500 -ml-1 shrink-0" />
                        <div className="flex-1 border-t-2 border-red-500" />
                      </div>
                    )}

                    {/* Appointments */}
                    {(aptsByStaff[s.id] ?? []).map((apt) => {
                      const startMin = toMinutes(apt.startTime);
                      const endMin   = toMinutes(apt.endTime);
                      const top    = (startMin - DAY_START) * PX_PER_MIN;
                      const height = (endMin - startMin) * PX_PER_MIN;
                      const color  = STATUS_COLORS[apt.status] ?? "bg-zinc-400";
                      const isCancelled = apt.status === "CANCELLED";

                      return (
                        <div
                          key={apt.id}
                          className={`absolute left-1 right-1 rounded-md px-2 py-1 overflow-hidden ${color} ${isCancelled ? "opacity-40" : ""}`}
                          style={{ top: `${top}px`, height: `${Math.max(height, 22)}px` }}
                          title={`${apt.clientName} · ${apt.service.name} · ${apt.startTime}–${apt.endTime}`}
                        >
                          <p className="text-white text-[11px] font-semibold leading-tight truncate">{apt.clientName}</p>
                          {height >= 36 && (
                            <p className="text-white/80 text-[10px] leading-tight truncate">{apt.service.name}</p>
                          )}
                          {height >= 50 && (
                            <p className="text-white/70 text-[10px] leading-tight">{apt.startTime}–{apt.endTime}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-zinc-100 px-4 py-2 flex flex-wrap gap-3">
            {[
              { label: "Confirmado", color: "bg-blue-500" },
              { label: "Pendiente",  color: "bg-amber-400" },
              { label: "Completado", color: "bg-green-500" },
              { label: "Cancelado",  color: "bg-zinc-300" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <div className={`h-2.5 w-2.5 rounded-sm ${color}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
