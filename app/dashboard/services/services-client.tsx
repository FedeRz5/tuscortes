"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Clock, ChevronUp, ChevronDown, Star } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Service } from "@prisma/client";

const EMPTY_FORM = {
  name: "",
  description: "",
  durationMin: 30,
  price: 0,
  imageUrl: "",
  featured: false,
};

export function ServicesClient({ services: initial, orgId }: { services: Service[]; orgId: string }) {
  const [services, setServices] = useState(
    [...initial].sort((a, b) => a.order - b.order)
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description ?? "",
      durationMin: s.durationMin,
      price: s.price,
      imageUrl: s.imageUrl ?? "",
      featured: s.featured,
    });
    setOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    const url = editing ? `/api/services/${editing.id}` : "/api/services";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, organizationId: orgId }),
    });
    const data = await res.json();
    if (editing) {
      setServices((prev) => prev.map((s) => (s.id === editing.id ? data : s)));
    } else {
      setServices((prev) => [...prev, data]);
    }
    setOpen(false);
    setLoading(false);
  }

  async function handleToggle(s: Service) {
    const res = await fetch(`/api/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    const data = await res.json();
    setServices((prev) => prev.map((x) => (x.id === s.id ? data : x)));
  }

  async function handleToggleFeatured(s: Service) {
    const res = await fetch(`/api/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !s.featured }),
    });
    const data = await res.json();
    setServices((prev) => prev.map((x) => (x.id === s.id ? data : x)));
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    const newServices = [...services];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newServices.length) return;
    [newServices[index], newServices[swapIndex]] = [newServices[swapIndex], newServices[index]];
    const updated = newServices.map((s, i) => ({ ...s, order: i }));
    setServices(updated);
    await Promise.all([
      fetch(`/api/services/${updated[index].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: updated[index].order }),
      }),
      fetch(`/api/services/${updated[swapIndex].id}`, {
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
          <h1 className="text-2xl font-bold text-zinc-900">Servicios</h1>
          <p className="text-zinc-500 text-sm mt-1">Gestioná los servicios · Las ⭐ aparecen destacadas en la página de reservas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Nuevo servicio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Corte clásico" />
              </div>
              <div className="space-y-1.5">
                <Label>Descripción (opcional)</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <ImageUpload
                label="Imagen del servicio (opcional)"
                value={form.imageUrl || null}
                onChange={(url) => setForm({ ...form, imageUrl: url ?? "" })}
                aspect="wide"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Duración (min)</Label>
                  <Input type="number" min={5} step={5} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Precio ($)</Label>
                  <Input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                <div>
                  <p className="text-sm font-medium text-zinc-900">Destacar servicio</p>
                  <p className="text-xs text-zinc-400">Aparece con ⭐ en la página de reservas</p>
                </div>
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

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-zinc-400 mb-4">No tenés servicios cargados todavía</p>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Agregar primer servicio</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((s, index) => (
            <Card key={s.id} className={s.active ? "" : "opacity-60"}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Reorder */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => handleReorder(index, "up")} disabled={index === 0} className="p-0.5 text-zinc-300 hover:text-zinc-600 disabled:opacity-20">
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleReorder(index, "down")} disabled={index === services.length - 1} className="p-0.5 text-zinc-300 hover:text-zinc-600 disabled:opacity-20">
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Image */}
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.name} className="h-14 w-14 rounded-lg object-cover shrink-0 border border-zinc-100" />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-zinc-100 shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{s.name}</CardTitle>
                      {s.featured && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                    </div>
                    {s.description && <p className="text-sm text-zinc-500 truncate">{s.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.durationMin} min</span>
                      <span>${s.price.toLocaleString("es-AR")}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleFeatured(s)}
                      className={`p-1.5 rounded-md transition-colors ${s.featured ? "text-amber-400 bg-amber-50" : "text-zinc-300 hover:text-amber-400"}`}
                      title={s.featured ? "Quitar destacado" : "Destacar"}
                    >
                      <Star className="h-4 w-4" fill={s.featured ? "currentColor" : "none"} />
                    </button>
                    <Switch checked={s.active} onCheckedChange={() => handleToggle(s)} />
                    <Button variant="outline" size="sm" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
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
