"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, ExternalLink, ImageIcon, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
    showInstagram: org.showInstagram,
    tiktokUrl: org.tiktokUrl ?? "",
    showTiktok: org.showTiktok,
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
              {/* Logo upload + spec */}
              <div className="flex flex-col gap-2">
                <ImageUpload
                  label="Logo"
                  value={form.logoUrl || null}
                  onChange={(url) => setForm({ ...form, logoUrl: url ?? "" })}
                  aspect="square"
                />
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs space-y-2.5">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
                    <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
                    Especificaciones del logo
                  </div>
                  <div className="flex items-center gap-3">
                    {/* aspect ratio illustration */}
                    <div className="shrink-0 flex items-center justify-center rounded-md border border-blue-200 bg-blue-50" style={{ width: 36, height: 36 }}>
                      <div className="rounded-sm bg-blue-200" style={{ width: 22, height: 22 }} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-mono font-bold text-zinc-800 text-[13px]">400 × 400 px</p>
                      <p className="text-zinc-400">Ratio 1:1 · cuadrado</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-500">✓</span>
                      PNG con fondo transparente (ideal)
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-500">✓</span>
                      JPG o WebP aceptados
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-500">↑</span>
                      Máx. 2 MB
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner upload + spec */}
              <div className="flex-1 flex flex-col gap-2">
                <ImageUpload
                  label="Imagen de portada (banner)"
                  value={form.coverImageUrl || null}
                  onChange={(url) => setForm({ ...form, coverImageUrl: url ?? "" })}
                  aspect="wide"
                />
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs space-y-2.5">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
                    <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
                    Especificaciones del banner
                  </div>
                  <div className="flex items-center gap-3">
                    {/* aspect ratio illustration */}
                    <div className="shrink-0 flex items-center justify-center rounded-md border border-violet-200 bg-violet-50" style={{ width: 54, height: 20 }}>
                      <div className="rounded-sm bg-violet-200" style={{ width: 46, height: 12 }} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-mono font-bold text-zinc-800 text-[13px]">1200 × 400 px</p>
                      <p className="text-zinc-400">Ratio 3:1 · apaisado</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-500">✓</span>
                      JPG o PNG recomendado
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-500">✓</span>
                      Evitá texto en los bordes
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-500">↑</span>
                      Máx. 5 MB
                    </div>
                  </div>
                </div>
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
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Instagram
                </Label>
                <Switch checked={form.showInstagram} onCheckedChange={(v) => setForm({ ...form, showInstagram: v })} />
              </div>
              <Input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="https://instagram.com/tubarberia" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.84 1.56V6.8a4.85 4.85 0 01-1.07-.11z"/>
                  </svg>
                  TikTok
                </Label>
                <Switch checked={form.showTiktok} onCheckedChange={(v) => setForm({ ...form, showTiktok: v })} />
              </div>
              <Input value={form.tiktokUrl} onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })} placeholder="https://tiktok.com/@tubarberia" />
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
