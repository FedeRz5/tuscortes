"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, User, ChevronUp, ChevronDown } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Staff, WorkSchedule } from "@prisma/client";

type StaffWithSchedules = Staff & { schedules: WorkSchedule[] };

const EMPTY_FORM = { name: "", bio: "", avatarUrl: "", maxAppointmentsPerDay: "" };

export function StaffClient({ staff: initial, orgId }: { staff: StaffWithSchedules[]; orgId: string }) {
  const [staff, setStaff] = useState(
    [...initial].sort((a, b) => a.order - b.order)
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(s: Staff) {
    setEditing(s);
    setForm({
      name: s.name,
      bio: s.bio ?? "",
      avatarUrl: s.avatarUrl ?? "",
      maxAppointmentsPerDay: s.maxAppointmentsPerDay?.toString() ?? "",
    });
    setOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    const url = editing ? `/api/staff/${editing.id}` : "/api/staff";
    const method = editing ? "PATCH" : "POST";
    const payload = {
      name: form.name,
      bio: form.bio || null,
      avatarUrl: form.avatarUrl || null,
      maxAppointmentsPerDay: form.maxAppointmentsPerDay ? parseInt(form.maxAppointmentsPerDay) : null,
      organizationId: orgId,
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (editing) {
      setStaff((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...data } : s)));
    } else {
      setStaff((prev) => [...prev, { ...data, schedules: [] }]);
    }
    setOpen(false);
    setLoading(false);
  }

  async function handleToggle(s: Staff) {
    const res = await fetch(`/api/staff/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    const data = await res.json();
    setStaff((prev) => prev.map((x) => (x.id === s.id ? { ...x, ...data } : x)));
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este barbero?")) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    setStaff((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    const newStaff = [...staff];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newStaff.length) return;
    [newStaff[index], newStaff[swapIndex]] = [newStaff[swapIndex], newStaff[index]];

    // Update order field
    const updated = newStaff.map((s, i) => ({ ...s, order: i }));
    setStaff(updated);

    // Persist both
    await Promise.all([
      fetch(`/api/staff/${updated[index].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: updated[index].order }),
      }),
      fetch(`/api/staff/${updated[swapIndex].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: updated[swapIndex].order }),
      }),
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Barberos</h1>
          <p className="text-zinc-500 text-sm mt-1">Gestioná tu equipo · El orden define cómo aparecen en la página de reservas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo barbero</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar barbero" : "Nuevo barbero"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Carlos Rodríguez" />
              </div>
              <div className="space-y-1.5">
                <Label>Bio (opcional)</Label>
                <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Breve descripción..." rows={2} />
              </div>
              <ImageUpload
                label="Foto (opcional)"
                value={form.avatarUrl || null}
                onChange={(url) => setForm({ ...form, avatarUrl: url ?? "" })}
                aspect="square"
              />
              <div className="space-y-1.5">
                <Label>Máximo de turnos por día (opcional)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxAppointmentsPerDay}
                  onChange={(e) => setForm({ ...form, maxAppointmentsPerDay: e.target.value })}
                  placeholder="Ej: 8 (vacío = sin límite)"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={loading || !form.name} className="flex-1">
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {staff.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-zinc-400 mb-4">No tenés barberos cargados todavía</p>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Agregar primer barbero</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {staff.map((s, index) => (
            <Card key={s.id} className={s.active ? "" : "opacity-60"}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleReorder(index, "up")}
                      disabled={index === 0}
                      className="p-0.5 text-zinc-300 hover:text-zinc-600 disabled:opacity-20"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(index, "down")}
                      disabled={index === staff.length - 1}
                      className="p-0.5 text-zinc-300 hover:text-zinc-600 disabled:opacity-20"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Avatar */}
                  {s.avatarUrl ? (
                    <img src={s.avatarUrl} alt={s.name} className="h-12 w-12 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-zinc-400" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{s.name}</CardTitle>
                    {s.bio && <p className="text-sm text-zinc-500 truncate">{s.bio}</p>}
                    {s.maxAppointmentsPerDay && (
                      <p className="text-xs text-zinc-400 mt-0.5">Máx. {s.maxAppointmentsPerDay} turnos/día</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Switch checked={s.active} onCheckedChange={() => handleToggle(s)} />
                    <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
