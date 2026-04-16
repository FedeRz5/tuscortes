"use client";

import { useState } from "react";
import { CheckCircle, ChevronLeft, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Organization, Service, Staff, WorkSchedule } from "@prisma/client";

type OrgWithData = Organization & {
  services: Service[];
  staff: (Staff & { schedules: WorkSchedule[] })[];
};

type TimeSlot = { startTime: string; endTime: string; available: boolean };

const STEP_LABELS = ["Servicio", "Barbero", "Fecha", "Horario", "Tus datos", "Confirmar"];

/** Returns black or white depending on which has better contrast against the given hex color */
function contrastColor(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  // Relative luminance (WCAG formula)
  const toLinear = (x: number) => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.179 ? "#18181b" : "#ffffff";
}

function getNextDays(org: OrgWithData) {
  const days = [];
  const maxDays = org.maxDaysAhead ?? 30;
  for (let i = 0; i < maxDays + 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    // Usar fecha local (no UTC) para evitar que a partir de las 21hs AR el día cambie
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({
      date,
      label: d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" }),
      dayOfWeek: d.getDay(),
    });
  }
  return days.slice(0, maxDays);
}

// Caché de slots con TTL de 60s para no refetchear al navegar atrás pero siempre mostrar disponibilidad actual
const slotsCache = new Map<string, { slots: TimeSlot[]; ts: number }>();
const SLOTS_CACHE_TTL = 60_000; // 60 segundos

export function BookingWizard({ org }: { org: OrgWithData }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [staff, setStaff] = useState<(Staff & { schedules: WorkSchedule[] }) | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");

  const primaryColor = org.primaryColor;
  const accentColor = org.accentColor;
  const primaryText = contrastColor(primaryColor);

  async function loadSlots(staffId: string, serviceId: string, dateStr: string) {
    const cacheKey = `${staffId}:${serviceId}:${dateStr}`;
    const cached = slotsCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < SLOTS_CACHE_TTL) { setSlots(cached.slots); return; }

    setLoadingSlots(true);
    setSlots([]);
    try {
      const res = await fetch(
        `/api/public/slots?orgSlug=${org.slug}&staffId=${staffId}&serviceId=${serviceId}&date=${dateStr}`
      );
      const data = await res.json();
      const result = Array.isArray(data) ? data : [];
      slotsCache.set(cacheKey, { slots: result, ts: Date.now() });
      setSlots(result);
    } finally {
      setLoadingSlots(false);
    }
  }

  function selectService(s: Service) {
    setService(s); setStaff(null); setDate(null); setSlot(null); setStep(1);
  }
  function selectStaff(s: Staff & { schedules: WorkSchedule[] }) {
    setStaff(s); setDate(null); setSlot(null); setStep(2);
  }
  function selectDate(d: string) {
    setDate(d); setSlot(null);
    if (staff && service) loadSlots(staff.id, service.id, d);
    setStep(3);
  }
  function selectSlot(s: TimeSlot) { setSlot(s); setStep(4); }

  function handleNextToSummary() {
    let valid = true;
    if (!form.phone || !isValidPhoneNumber(form.phone)) {
      setPhoneError("Ingresá un número de teléfono válido");
      valid = false;
    } else {
      setPhoneError("");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      setEmailError("Ingresá un email válido");
      valid = false;
    } else {
      setEmailError("");
    }
    if (valid) setStep(5);
  }

  async function handleBook(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/public/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgSlug: org.slug, staffId: staff!.id, serviceId: service!.id,
        date, startTime: slot!.startTime,
        clientName: form.name, clientPhone: form.phone,
        clientEmail: form.email || undefined, notes: form.notes || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Error al reservar. Intentá nuevamente."); return; }
    slotsCache.clear(); // Invalidar caché para que el slot aparezca bloqueado en la próxima reserva
    setBooked(true);
  }

  const sortedStaff = [...org.staff].sort((a, b) => a.order - b.order);
  const sortedServices = [...org.services].sort((a, b) => a.order - b.order);
  const staffWorkDays = staff?.schedules.map((s) => s.dayOfWeek) ?? [];
  const days = getNextDays(org).filter((d) => staff ? staffWorkDays.includes(d.dayOfWeek) : true);

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: primaryColor + "10" }}>
        <div className="w-full max-w-md text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-zinc-900">¡Turno confirmado!</h1>
          <div className="rounded-xl border bg-white p-6 text-left space-y-3 shadow-sm">
            <Row label="Servicio" value={service!.name} />
            <Row label="Barbero" value={staff!.name} />
            <Row label="Fecha" value={new Date(date! + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} />
            <Row label="Horario" value={`${slot!.startTime} - ${slot!.endTime}`} />
          </div>
          {org.bookingConfirmationMessage && (
            <p className="text-zinc-600 text-sm bg-white rounded-xl border p-4">{org.bookingConfirmationMessage}</p>
          )}
          <Button className="w-full" style={{ backgroundColor: primaryColor, color: primaryText }}
            onClick={() => window.location.reload()}
          >
            Reservar otro turno
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: primaryColor + "08" }}>
      {/* Header with cover image */}
      <header className="bg-white border-b shadow-sm">
        {org.coverImageUrl && (
          <div className="h-36 w-full overflow-hidden">
            <img src={org.coverImageUrl} alt={org.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="px-4 py-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name} className="h-10 w-10 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0" style={{ backgroundColor: primaryColor, color: primaryText }}>
                  {org.name[0]}
                </div>
              )}
              <div>
                <h1 className="font-bold text-zinc-900">{org.name}</h1>
                {org.address && <p className="text-xs text-zinc-400">{org.address}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {org.instagramUrl && org.showInstagram && (
                <a href={org.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              )}
              {org.tiktokUrl && org.showTiktok && (
                <a href={org.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors" aria-label="TikTok">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.84 1.56V6.8a4.85 4.85 0 01-1.07-.11z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
          {org.welcomeMessage && (
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{org.welcomeMessage}</p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Progress */}
        <div className="flex items-center gap-1">
          {STEP_LABELS.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-colors"
              style={{ backgroundColor: i <= step ? primaryColor : "#e4e4e7" }} />
          ))}
        </div>
        <p className="text-sm text-zinc-500">
          Paso {step + 1} de 5: <span className="font-medium text-zinc-900">{STEP_LABELS[step]}</span>
        </p>

        {/* Step 0: Service */}
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900">¿Qué servicio querés?</h2>
            {sortedServices.map((s) => (
              <button key={s.id} onClick={() => selectService(s)}
                className="w-full text-left rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  {s.imageUrl && (
                    <img src={s.imageUrl} alt={s.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-900">{s.name}</p>
                      {s.featured && <Star className="h-3.5 w-3.5 shrink-0" style={{ color: accentColor, fill: accentColor }} />}
                    </div>
                    {s.description && <p className="text-sm text-zinc-400 mt-0.5 truncate">{s.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-sm text-zinc-500 justify-end">
                      <Clock className="h-3.5 w-3.5" /> {s.durationMin} min
                    </div>
                    <p className="text-sm font-bold mt-0.5" style={{ color: primaryColor }}>
                      ${s.price.toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Staff */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(0)} className="text-zinc-400 hover:text-zinc-900"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-bold text-zinc-900">Elegí tu barbero</h2>
            </div>
            {sortedStaff.map((s) => (
              <button key={s.id} onClick={() => selectStaff(s)}
                className="w-full text-left rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 hover:shadow-sm transition-all flex items-center gap-4"
              >
                {s.avatarUrl ? (
                  <img src={s.avatarUrl} alt={s.name} className="h-12 w-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold shrink-0 text-lg" style={{ backgroundColor: primaryColor, color: primaryText }}>
                    {s.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-zinc-900">{s.name}</p>
                  {s.bio && <p className="text-sm text-zinc-400">{s.bio}</p>}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-zinc-900"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-bold text-zinc-900">Elegí una fecha</h2>
            </div>
            {days.length === 0 ? (
              <div className="rounded-xl border bg-white p-6 text-center text-zinc-400">No hay días disponibles próximamente</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {days.slice(0, 14).map(({ date: d, label }) => (
                  <button key={d} onClick={() => selectDate(d)}
                    className="rounded-xl border border-zinc-200 bg-white p-3 text-center hover:border-zinc-400 hover:shadow-sm transition-all"
                  >
                    <p className="font-medium text-zinc-900 capitalize">{label}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Slot */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(2)} className="text-zinc-400 hover:text-zinc-900"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-bold text-zinc-900">Elegí el horario</h2>
            </div>
            {loadingSlots ? (
              <div className="text-center py-8 text-zinc-400">Cargando horarios...</div>
            ) : slots.filter((s) => s.available).length === 0 ? (
              <div className="rounded-xl border bg-white p-6 text-center space-y-3">
                <p className="text-zinc-400">No hay horarios disponibles para este día</p>
                <Button variant="outline" onClick={() => setStep(2)}>Elegir otro día</Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.filter((s) => s.available).map((s) => (
                  <button key={s.startTime} onClick={() => selectSlot(s)}
                    className="rounded-lg border py-3 text-sm font-medium transition-all"
                    style={slot?.startTime === s.startTime
                      ? { borderColor: primaryColor, backgroundColor: primaryColor + "15", color: primaryColor }
                      : { borderColor: "#e4e4e7", backgroundColor: "white", color: "#18181b" }
                    }
                  >
                    {s.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Client data */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(3)} className="text-zinc-400 hover:text-zinc-900"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-bold text-zinc-900">Tus datos</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nombre y apellido *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Juan García" />
              </div>
              <div className="space-y-1.5">
                <Label>Teléfono / WhatsApp *</Label>
                <PhoneInput
                  international
                  defaultCountry="AR"
                  value={form.phone}
                  onChange={(v) => { setForm({ ...form, phone: v ?? "" }); setPhoneError(""); }}
                  className={`phone-input-wrapper ${phoneError ? "phone-input-error" : ""}`}
                />
                {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setEmailError(""); }}
                  placeholder="juan@email.com"
                  className={emailError ? "border-red-400 focus-visible:ring-red-400" : ""}
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Notas (opcional)</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Alguna indicación especial..." />
              </div>
              <Button
                onClick={handleNextToSummary}
                disabled={!form.name || !form.phone || !form.email}
                className="w-full h-12 text-base font-semibold"
                style={{ backgroundColor: primaryColor, color: primaryText }}
              >
                Revisar reserva →
              </Button>
              <p className="text-xs text-zinc-400 text-center">No necesitás crear una cuenta para reservar</p>
            </div>
          </div>
        )}

        {/* Step 5: Summary + confirm */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(4)} className="text-zinc-400 hover:text-zinc-900"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-bold text-zinc-900">Confirmá tu turno</h2>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 text-sm">
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mb-1">Tu reserva</p>
              <Row label="Servicio" value={service!.name} />
              <Row label="Barbero" value={staff!.name} />
              <Row label="Fecha" value={new Date(date! + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} />
              <Row label="Horario" value={`${slot!.startTime} — ${slot!.endTime}`} />
              <Row label="Precio" value={`$${service!.price.toLocaleString("es-AR")}`} />
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 text-sm">
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mb-1">Tus datos</p>
              <Row label="Nombre" value={form.name} />
              <Row label="Teléfono" value={form.phone} />
              <Row label="Email" value={form.email} />
              {form.notes && <Row label="Notas" value={form.notes} />}
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button
              onClick={() => handleBook()}
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
              style={{ backgroundColor: primaryColor, color: primaryText }}
            >
              {loading ? "Reservando..." : "Confirmar turno"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-900 capitalize">{value}</span>
    </div>
  );
}
