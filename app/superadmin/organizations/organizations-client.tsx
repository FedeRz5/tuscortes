"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Users, Calendar } from "lucide-react";
import type { Organization } from "@prisma/client";

type OrgWithCount = Organization & {
  _count: { appointments: number; staff: number; users: number };
};

const EMPTY_FORM = {
  name: "",
  slug: "",
  ownerEmail: "",
  ownerPassword: "",
  ownerName: "",
};

export function OrganizationsClient({ organizations: initial }: { organizations: OrgWithCount[] }) {
  const [orgs, setOrgs] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function slugify(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleNameChange(name: string) {
    setForm({ ...form, name, slug: slugify(name) });
  }

  async function handleCreate() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Error al crear la barbería");
      setLoading(false);
      return;
    }
    setOrgs((prev) => [{ ...data, _count: { appointments: 0, staff: 0, users: 1 } }, ...prev]);
    setForm(EMPTY_FORM);
    setOpen(false);
    setLoading(false);
  }

  async function handleToggleActive(org: OrgWithCount) {
    const res = await fetch(`/api/organizations/${org.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !org.active }),
    });
    const data = await res.json();
    setOrgs((prev) => prev.map((o) => (o.id === org.id ? { ...o, ...data } : o)));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Barberías</h1>
          <p className="text-zinc-500 text-sm mt-1">{orgs.length} barberías registradas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> Nueva barbería
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva barbería</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Nombre de la barbería</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Barbería El Clásico"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">/b/</span>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="barberia-el-clasico"
                    className="flex-1"
                  />
                </div>
              </div>
              <hr className="border-zinc-100" />
              <p className="text-sm font-medium text-zinc-700">Cuenta del dueño</p>
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  placeholder="Juan García"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.ownerEmail}
                  onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                  placeholder="juan@barberia.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Contraseña temporal</Label>
                <Input
                  type="password"
                  value={form.ownerPassword}
                  onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCreate}
                  disabled={loading || !form.name || !form.slug || !form.ownerEmail || !form.ownerPassword}
                  className="flex-1"
                >
                  {loading ? "Creando..." : "Crear barbería"}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {orgs.map((org) => (
          <Card key={org.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: org.primaryColor }}
                  >
                    {org.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-900">{org.name}</p>
                      <Badge variant={org.active ? "success" : "secondary"}>
                        {org.active ? "Activa" : "Inactiva"}
                      </Badge>
                      <Badge variant="outline">{org.plan}</Badge>
                    </div>
                    <p className="text-sm text-zinc-400 mt-0.5">/b/{org.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" /> {org._count.staff} barberos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> {org._count.appointments} turnos
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={org.active} onCheckedChange={() => handleToggleActive(org)} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(`/b/${org.slug}`, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
