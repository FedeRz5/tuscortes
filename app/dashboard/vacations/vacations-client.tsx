"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CalendarOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { VacationBlock } from "@prisma/client";

interface Props {
  vacations: VacationBlock[];
  staff: { id: string; name: string }[];
  orgId: string;
}

const EMPTY_FORM = { staffId: "ALL", startDate: "", endDate: "", reason: "" };

export function VacationsClient({ vacations: initial, staff, orgId }: Props) {
  const [vacations, setVacations] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const res = await fetch("/api/vacations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: orgId,
        staffId: form.staffId === "ALL" ? null : form.staffId,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason || null,
      }),
    });
    const data = await res.json();
    setVacations((prev) => [...prev, data].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    setForm(EMPTY_FORM);
    setOpen(false);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este bloqueo?")) return;
    await fetch(`/api/vacations/${id}`, { method: "DELETE" });
    setVacations((prev) => prev.filter((v) => v.id !== id));
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Vacaciones y cierres</h1>
          <p className="text-zinc-500 text-sm mt-1">Bloqueá rangos de fechas para toda la barbería o por barbero</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Agregar bloqueo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bloquear fechas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>¿A quién afecta?</Label>
                <Select value={form.staffId} onValueChange={(v) => setForm({ ...form, staffId: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Toda la barbería</SelectItem>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Desde</Label>
                  <Input type="date" min={today} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Hasta</Label>
                  <Input type="date" min={form.startDate || today} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Motivo (opcional)</Label>
                <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Ej: Vacaciones, Feriado, Reforma..." />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={loading || !form.startDate || !form.endDate}
                  className="flex-1"
                >
                  {loading ? "Guardando..." : "Guardar bloqueo"}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {vacations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarOff className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-400">No hay bloqueos configurados</p>
            <p className="text-zinc-300 text-sm mt-1">Usá esto para vacaciones, feriados o cierres temporales</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {vacations.map((v) => {
            const staffName = v.staffId ? staff.find((s) => s.id === v.staffId)?.name : null;
            const isPast = v.endDate < today;
            return (
              <Card key={v.id} className={isPast ? "opacity-50" : ""}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CalendarOff className="h-5 w-5 text-zinc-400 shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900">
                        {formatDate(v.startDate)}
                        {v.startDate !== v.endDate && ` → ${formatDate(v.endDate)}`}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-zinc-500">
                          {staffName ? `Solo ${staffName}` : "Toda la barbería"}
                        </span>
                        {v.reason && <span className="text-xs text-zinc-400">· {v.reason}</span>}
                        {isPast && <span className="text-xs text-zinc-300 italic">· Pasado</span>}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(v.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
