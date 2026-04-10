"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, ExternalLink, Users, Calendar, Trash2, ChevronDown, ChevronUp,
  Pencil, LogIn, StickyNote, CreditCard, ToggleLeft, UserCog, Search,
} from "lucide-react";
import type { Organization, ActivityLog } from "@prisma/client";

type Owner = { id: string; name: string | null; email: string };

type OrgWithData = Organization & {
  _count: { appointments: number; staff: number; users: number };
  users: Owner[];
  activityLogs: ActivityLog[];
};

const EMPTY_FORM = { name: "", slug: "", ownerEmail: "", ownerPassword: "", ownerName: "" };

const ACTION_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  ORG_CREATED:    { label: "Creada",      icon: Plus,       color: "text-green-600" },
  ORG_DELETED:    { label: "Eliminada",   icon: Trash2,     color: "text-red-600" },
  PLAN_CHANGED:   { label: "Plan",        icon: CreditCard, color: "text-blue-600" },
  STATUS_CHANGED: { label: "Estado",      icon: ToggleLeft, color: "text-amber-600" },
  OWNER_EDITED:   { label: "Dueño",       icon: UserCog,    color: "text-purple-600" },
};

function timeAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min}m`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export function OrganizationsClient({ organizations: initial }: { organizations: OrgWithData[] }) {
  const [orgs, setOrgs] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Owner edit state
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [ownerForm, setOwnerForm] = useState({ name: "", email: "", password: "" });
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState("");

  // Notes state
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);

  const filtered = useMemo(() => {
    return orgs.filter((org) => {
      const matchSearch =
        !search ||
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.slug.toLowerCase().includes(search.toLowerCase());
      const matchPlan = filterPlan === "ALL" || org.plan === filterPlan;
      const matchStatus =
        filterStatus === "ALL" ||
        (filterStatus === "active" && org.active) ||
        (filterStatus === "inactive" && !org.active);
      return matchSearch && matchPlan && matchStatus;
    });
  }, [orgs, search, filterPlan, filterStatus]);

  function slugify(name: string) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleNameChange(name: string) {
    setForm({ ...form, name, slug: slugify(name) });
  }

  async function handleCreate() {
    setLoading(true); setError("");
    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Error al crear"); setLoading(false); return; }
    setOrgs((prev) => [{ ...data, _count: { appointments: 0, staff: 0, users: 1 }, users: [{ id: data.ownerId ?? "", name: form.ownerName, email: form.ownerEmail }], activityLogs: [] }, ...prev]);
    setForm(EMPTY_FORM);
    setOpen(false);
    setLoading(false);
  }

  async function handleToggleActive(org: OrgWithData) {
    const res = await fetch(`/api/organizations/${org.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !org.active }),
    });
    const data = await res.json();
    setOrgs((prev) => prev.map((o) => (o.id === org.id ? { ...o, ...data } : o)));
  }

  async function handleChangePlan(org: OrgWithData, plan: string) {
    const res = await fetch(`/api/organizations/${org.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setOrgs((prev) => prev.map((o) => (o.id === org.id ? { ...o, ...data } : o)));
  }

  async function handleDelete(org: OrgWithData) {
    if (!confirm(`¿Eliminar "${org.name}" y todos sus datos? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/organizations/${org.id}`, { method: "DELETE" });
    setOrgs((prev) => prev.filter((o) => o.id !== org.id));
  }

  function openOwnerEdit(owner: Owner) {
    setEditingOwner(owner);
    setOwnerForm({ name: owner.name ?? "", email: owner.email, password: "" });
    setOwnerError("");
  }

  async function handleSaveOwner() {
    if (!editingOwner) return;
    setOwnerLoading(true); setOwnerError("");
    const payload: Record<string, string> = {};
    if (ownerForm.name) payload.name = ownerForm.name;
    if (ownerForm.email) payload.email = ownerForm.email;
    if (ownerForm.password) payload.password = ownerForm.password;

    const res = await fetch(`/api/users/${editingOwner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setOwnerError(data.error ?? "Error al guardar"); setOwnerLoading(false); return; }

    setOrgs((prev) => prev.map((o) => ({
      ...o,
      users: o.users.map((u) => u.id === editingOwner.id ? { ...u, name: data.name, email: data.email } : u),
    })));
    setEditingOwner(null);
    setOwnerLoading(false);
  }

  function openNotesEdit(org: OrgWithData) {
    setEditingNotes(org.id);
    setNotesValue(org.adminNotes ?? "");
  }

  async function handleSaveNotes(orgId: string) {
    setNotesSaving(true);
    const res = await fetch(`/api/organizations/${orgId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes: notesValue }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrgs((prev) => prev.map((o) => (o.id === orgId ? { ...o, adminNotes: data.adminNotes } : o)));
    }
    setEditingNotes(null);
    setNotesSaving(false);
  }

  async function handleImpersonate(owner: Owner) {
    const res = await fetch(`/api/superadmin/impersonate/${owner.id}`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Error"); return; }
    window.location.href = `/superadmin/impersonate?token=${data.token}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Barberías</h1>
          <p className="text-zinc-500 text-sm mt-1">{filtered.length} de {orgs.length} barberías</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Nueva barbería</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Crear nueva barbería</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Nombre de la barbería</Label>
                <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ej: Barbería El Clásico" />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">/b/</span>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="barberia-el-clasico" className="flex-1" />
                </div>
              </div>
              <hr className="border-zinc-100" />
              <p className="text-sm font-medium text-zinc-700">Cuenta del dueño</p>
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} placeholder="Juan García" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} placeholder="juan@barberia.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Contraseña temporal</Label>
                <Input type="password" value={form.ownerPassword} onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })} placeholder="Mínimo 8 caracteres" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleCreate} disabled={loading || !form.name || !form.slug || !form.ownerEmail || !form.ownerPassword} className="flex-1">
                  {loading ? "Creando..." : "Crear barbería"}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nombre o URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los planes</SelectItem>
            <SelectItem value="FREE">Starter</SelectItem>
            <SelectItem value="PRO">Pro</SelectItem>
            <SelectItem value="PREMIUM">Premium</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="inactive">Inactivas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Owner edit dialog */}
      <Dialog open={!!editingOwner} onOpenChange={(v) => { if (!v) setEditingOwner(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar dueño</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={ownerForm.name} onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={ownerForm.email} onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Nueva contraseña <span className="text-zinc-400 font-normal">(dejá vacío para no cambiar)</span></Label>
              <Input type="password" value={ownerForm.password} onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })} placeholder="Mínimo 8 caracteres" />
            </div>
            {ownerError && <p className="text-sm text-red-600">{ownerError}</p>}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSaveOwner} disabled={ownerLoading} className="flex-1">
                {ownerLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
              <Button variant="outline" onClick={() => setEditingOwner(null)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-zinc-400 text-sm py-12">No hay barberías que coincidan con los filtros.</p>
        )}
        {filtered.map((org) => (
          <Card key={org.id}>
            <CardContent className="p-5">
              {/* Row principal */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: org.primaryColor }}>
                    {org.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-zinc-900">{org.name}</p>
                      <Badge variant={org.active ? "success" : "secondary"}>{org.active ? "Activa" : "Inactiva"}</Badge>
                      <Badge variant="outline">{org.plan}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm text-zinc-400">/b/{org.slug}</p>
                      <span className="text-zinc-200">·</span>
                      <p className="text-xs text-zinc-400">
                        Alta: {new Date(org.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {org._count.staff} barberos</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {org._count.appointments} turnos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={org.plan} onValueChange={(v) => handleChangePlan(org, v)}>
                      <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREE">Starter</SelectItem>
                        <SelectItem value="PRO">Pro</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch checked={org.active} onCheckedChange={() => handleToggleActive(org)} />
                    <Button variant="ghost" size="icon" onClick={() => window.open(`/b/${org.slug}`, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(org)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setExpanded(expanded === org.id ? null : org.id)}>
                      {expanded === org.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Panel expandible */}
              {expanded === org.id && (
                <div className="mt-4 pt-4 border-t border-zinc-100 space-y-5">

                  {/* Cuentas del dueño */}
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Cuentas del dueño</p>
                    {org.users.length === 0 ? (
                      <p className="text-sm text-zinc-400 italic">Sin cuentas registradas</p>
                    ) : (
                      <div className="space-y-2">
                        {org.users.map((owner) => (
                          <div key={owner.id} className="flex items-center justify-between gap-4 rounded-lg bg-zinc-50 border border-zinc-100 px-4 py-3">
                            <div>
                              <p className="font-medium text-zinc-900 text-sm">{owner.name ?? "Sin nombre"}</p>
                              <p className="text-zinc-500 text-xs mt-0.5">{owner.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => openOwnerEdit(owner)}>
                                <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleImpersonate(owner)}
                                title="Ver dashboard como este dueño (cerrará tu sesión de superadmin)"
                              >
                                <LogIn className="h-3.5 w-3.5 mr-1.5" /> Entrar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notas internas */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <StickyNote className="h-3.5 w-3.5" /> Notas internas
                      </p>
                      {editingNotes !== org.id && (
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => openNotesEdit(org)}>
                          <Pencil className="h-3 w-3 mr-1" /> Editar
                        </Button>
                      )}
                    </div>
                    {editingNotes === org.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          placeholder="Notas privadas sobre este cliente (plan, pagos, acuerdos, etc.)"
                          className="text-sm min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveNotes(org.id)} disabled={notesSaving}>
                            {notesSaving ? "Guardando..." : "Guardar"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)}>Cancelar</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">
                        {org.adminNotes || "Sin notas."}
                      </p>
                    )}
                  </div>

                  {/* Actividad reciente */}
                  {org.activityLogs.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Actividad reciente</p>
                      <div className="space-y-1">
                        {org.activityLogs.map((log) => {
                          const meta = ACTION_META[log.action];
                          const Icon = meta?.icon ?? Plus;
                          return (
                            <div key={log.id} className="flex items-start gap-2 text-xs text-zinc-500 py-1">
                              <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${meta?.color ?? "text-zinc-400"}`} />
                              <span className="flex-1">{log.detail ?? log.action}</span>
                              <span className="text-zinc-300 shrink-0">{timeAgo(log.createdAt)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
