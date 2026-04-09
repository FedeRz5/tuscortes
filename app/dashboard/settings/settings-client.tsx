"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, ExternalLink } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Organization } from "@prisma/client";

export function SettingsClient({ org }: { org: Organization }) {
  const [form, setForm] = useState({
    name: org.name,
    description: org.description ?? "",
    phone: org.phone ?? "",
    address: org.address ?? "",
    primaryColor: org.primaryColor,
    accentColor: org.accentColor,
    logoUrl: org.logoUrl ?? "",
    coverImageUrl: org.coverImageUrl ?? "",
    welcomeMessage: org.welcomeMessage ?? "",
    bookingConfirmationMessage: org.bookingConfirmationMessage ?? "",
    instagramUrl: org.instagramUrl ?? "",
    tiktokUrl: org.tiktokUrl ?? "",
    minAdvanceHours: org.minAdvanceHours,
    maxDaysAhead: org.maxDaysAhead,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/organizations/${org.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const bookingUrl = `/b/${org.slug}`;

  return (
    <div className="space-y-6 max-w-2xl w-full">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Configuración</h1>
        <p className="text-zinc-500 text-sm mt-1">Personalizá tu barbería</p>
      </div>

      {/* Public URL */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <code className="flex-1 rounded bg-white border border-blue-200 px-3 py-2 text-sm font-mono text-blue-900">
              /b/{org.slug}
            </code>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-700 hover:bg-blue-100 shrink-0"
              onClick={() => window.open(bookingUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" /> Ver página
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Info general */}
        <Card>
          <CardHeader><CardTitle>Información general</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre de la barbería</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Contale a tus clientes quiénes son..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Teléfono / WhatsApp</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+54 11 1234-5678" />
              </div>
              <div className="space-y-1.5">
                <Label>Dirección</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Av. Corrientes 1234" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Página pública */}
        <Card>
          <CardHeader>
            <CardTitle>Página de reservas</CardTitle>
            <CardDescription>Lo que ven tus clientes al entrar a tu link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <ImageUpload
                label="Logo"
                value={form.logoUrl || null}
                onChange={(url) => setForm({ ...form, logoUrl: url ?? "" })}
                aspect="square"
              />
              <div className="flex-1">
                <ImageUpload
                  label="Imagen de portada (banner)"
                  value={form.coverImageUrl || null}
                  onChange={(url) => setForm({ ...form, coverImageUrl: url ?? "" })}
                  aspect="wide"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Mensaje de bienvenida</Label>
              <Textarea
                value={form.welcomeMessage}
                onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                rows={2}
                placeholder="Ej: Somos la barb más antigua del barrio. Trabajamos con turno desde 2018."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mensaje al confirmar turno</Label>
              <Textarea
                value={form.bookingConfirmationMessage}
                onChange={(e) => setForm({ ...form, bookingConfirmationMessage: e.target.value })}
                rows={2}
                placeholder="Ej: ¡Te esperamos! Si necesitás cancelar avisanos con 2hs de anticipación."
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes sociales */}
        <Card>
          <CardHeader>
            <CardTitle>Redes sociales</CardTitle>
            <CardDescription>Se muestran en tu página de reservas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Instagram</Label>
              <Input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="https://instagram.com/tubarberia" />
            </div>
            <div className="space-y-1.5">
              <Label>TikTok</Label>
              <div className="flex gap-2 items-center">
                <span className="text-zinc-400 text-sm shrink-0">TT</span>
                <Input value={form.tiktokUrl} onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })} placeholder="https://tiktok.com/@tubarberia" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reglas de reserva */}
        <Card>
          <CardHeader>
            <CardTitle>Reglas de reserva</CardTitle>
            <CardDescription>Controlá cuándo pueden reservar tus clientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Anticipación mínima (horas)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.minAdvanceHours}
                  onChange={(e) => setForm({ ...form, minAdvanceHours: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-zinc-400">0 = pueden reservar hasta el momento</p>
              </div>
              <div className="space-y-1.5">
                <Label>Máximo días adelante</Label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={form.maxDaysAhead}
                  onChange={(e) => setForm({ ...form, maxDaysAhead: parseInt(e.target.value) || 30 })}
                />
                <p className="text-xs text-zinc-400">Ej: 30 = hasta un mes adelante</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colores */}
        <Card>
          <CardHeader>
            <CardTitle>Colores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Color principal</Label>
                <div className="flex gap-2">
                  <Input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-10 w-14 cursor-pointer p-1" />
                  <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="flex-1 font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Color de acento</Label>
                <div className="flex gap-2">
                  <Input type="color" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="h-10 w-14 cursor-pointer p-1" />
                  <Input value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="flex-1 font-mono text-sm" />
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 text-white text-sm font-medium" style={{ backgroundColor: form.primaryColor }}>
              Preview del color principal
              <span className="ml-2 inline-block rounded px-2 py-0.5 text-xs" style={{ backgroundColor: form.accentColor, color: form.primaryColor }}>
                Acento
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" /> Guardado
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
