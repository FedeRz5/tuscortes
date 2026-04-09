"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DAY_NAMES } from "@/lib/utils";
import type { Staff, WorkSchedule } from "@prisma/client";

type StaffWithSchedules = Staff & { schedules: WorkSchedule[] };

const DEFAULT_START = "09:00";
const DEFAULT_END = "18:00";
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const BUFFER_OPTIONS = [0, 5, 10, 15, 20, 30];

function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
    >
      {TIME_OPTIONS.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}

export function ScheduleClient({ staff }: { staff: StaffWithSchedules[] }) {
  const [selectedStaff, setSelectedStaff] = useState<StaffWithSchedules | null>(
    staff.length > 0 ? staff[0] : null
  );
  const [schedules, setSchedules] = useState<Record<string, WorkSchedule[]>>(
    Object.fromEntries(staff.map((s) => [s.id, s.schedules]))
  );
  const [saving, setSaving] = useState<number | null>(null);

  function getSchedule(staffId: string, day: number) {
    return schedules[staffId]?.find((s) => s.dayOfWeek === day);
  }

  async function upsertSchedule(staffId: string, day: number, patch: Partial<WorkSchedule>) {
    const existing = getSchedule(staffId, day);
    const payload = {
      staffId,
      dayOfWeek: day,
      startTime: existing?.startTime ?? DEFAULT_START,
      endTime: existing?.endTime ?? DEFAULT_END,
      bufferMin: existing?.bufferMin ?? 0,
      enabled: existing?.enabled ?? false,
      ...patch,
    };
    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSchedules((prev) => {
      const current = prev[staffId] ?? [];
      const exists = current.find((s) => s.dayOfWeek === day);
      if (exists) return { ...prev, [staffId]: current.map((s) => (s.dayOfWeek === day ? data : s)) };
      return { ...prev, [staffId]: [...current, data] };
    });
  }

  async function handleToggleDay(staffId: string, day: number) {
    const existing = getSchedule(staffId, day);
    setSaving(day);
    await upsertSchedule(staffId, day, { enabled: !existing?.enabled });
    setSaving(null);
  }

  if (staff.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Horarios</h1>
        <Card>
          <CardContent className="py-12 text-center text-zinc-400">
            Primero agregá barberos para configurar sus horarios
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Horarios</h1>
        <p className="text-zinc-500 text-sm mt-1">Configurá días, horarios y tiempo de limpieza entre turnos</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {staff.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStaff(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedStaff?.id === s.id ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {selectedStaff && (
        <Card>
          <CardHeader>
            <CardTitle>Horario de {selectedStaff.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ALL_DAYS.map((day) => {
                const schedule = getSchedule(selectedStaff.id, day);
                const enabled = schedule?.enabled ?? false;

                return (
                  <div
                    key={day}
                    className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                      enabled ? "border-zinc-200 bg-white" : "border-zinc-100 bg-zinc-50"
                    }`}
                  >
                    <Switch
                      checked={enabled}
                      onCheckedChange={() => handleToggleDay(selectedStaff.id, day)}
                      disabled={saving === day}
                    />
                    <span className={`w-24 text-sm font-medium shrink-0 ${enabled ? "text-zinc-900" : "text-zinc-400"}`}>
                      {DAY_NAMES[day]}
                    </span>

                    {enabled && schedule ? (
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Desde</span>
                          <TimeSelect
                            value={schedule.startTime}
                            onChange={(v) => upsertSchedule(selectedStaff.id, day, { startTime: v })}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Hasta</span>
                          <TimeSelect
                            value={schedule.endTime}
                            onChange={(v) => upsertSchedule(selectedStaff.id, day, { endTime: v })}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Buffer</span>
                          <select
                            value={schedule.bufferMin}
                            onChange={(e) => upsertSchedule(selectedStaff.id, day, { bufferMin: parseInt(e.target.value) })}
                            className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                          >
                            {BUFFER_OPTIONS.map((m) => (
                              <option key={m} value={m}>{m === 0 ? "Sin buffer" : `+${m} min`}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      !enabled && <span className="text-xs text-zinc-400 italic">No trabaja</span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-zinc-400 mt-4">
              El <strong>buffer</strong> es el tiempo que se bloquea después de cada turno para limpieza o descanso.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
