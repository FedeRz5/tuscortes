"use client";

import { useState } from "react";
import { CheckCircle, ChevronLeft, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Organization, Service, Staff, WorkSchedule } from "@prisma/client";

type OrgWithData = Organization & {
  services: Service[];
  staff: (Staff & { schedules: WorkSchedule[] })[];
};

type TimeSlot = { startTime: string; endTime: string; available: boolean };

const STEP_LABELS = ["Servicio", "Barbero", "Fecha", "Horario", "Tus datos"];

function getNextDays(org: OrgWithData) {
  const days = [];
  const maxDays = org.maxDaysAhead ?? 30;
  for (let i = 0; i < maxDays + 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" }),
      dayOfWeek: d.getDay(),
    });
  }
  return days.slice(0, maxDays);
}

export function BookingWizard({ org }: { org: OrgWithData }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [staff, setStaff] = useState<(Staff & { schedules: WorkSchedule[] }) | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");

  const primaryColor = org.primaryColor;
  const accentColor = org.accentColor;

  async function loadSlots(staffId: string, serviceId: string, dateStr: string) {
    setLoadingSlots(true);
    setSlots([]);
    const res = await fetch(
      `/api/public/slots?orgSlug=${org.slug}&staffId=${staffId}&serviceId=${serviceId}&date=${dateStr}`
    );
    const data = await res.json();
    setSlots(Array.isArray(data) ? data : []);
    setLoadingSlots(false);
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

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (form.phone.trim().length < 6) {
      setError("El teléfono debe tener al menos 6 caracteres.");
      return;
    }
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
          <Button className="w-full" style={{ backgroundColor: primaryColor }}
            onClick={() => { setBooked(false); setStep(0); setService(null); setStaff(null); setDate(null); setSlot(null); setForm({ name: "", phone: "", email: "", notes: "" }); }}
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
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: primaryColor }}>
                  {org.name[0]}
                </div>
              )}
              <div>
                <h1 className="font-bold text-zinc-900">{org.name}</h1>
                {org.address && <p className="text-xs text-zinc-400">{org.address}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {org.instagramUrl && (
                <a href={org.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-pink-500 transition-colors text-xs font-bold">
                  IG
                </a>
              )}
              {org.tiktokUrl && (
                <a href={org.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors text-xs font-bold">
                  TT
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
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-lg" style={{ backgroundColor: primaryColor }}>
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
            <div className="rounded-xl border border-zinc-100 bg-white p-4 space-y-2 text-sm">
              <Row label="Servicio" value={service!.name} />
              <Row label="Barbero" value={staff!.name} />
              <Row label="Fecha" value={new Date(date! + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} />
              <Row label="Horario" value={`${slot!.startTime} - ${slot!.endTime}`} />
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nombre y apellido *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Juan García" required />
              </div>
              <div className="space-y-1.5">
                <Label>Teléfono / WhatsApp *</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+54 11 1234-5678" required />
              </div>
              <div className="space-y-1.5">
                <Label>Email (opcional)</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="juan@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Notas (opcional)</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Alguna indicación especial..." />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading || !form.name || !form.phone} className="w-full h-12 text-base font-semibold" style={{ backgroundColor: primaryColor }}>
                {loading ? "Reservando..." : "Confirmar turno"}
              </Button>
              <p className="text-xs text-zinc-400 text-center">No necesitás crear una cuenta para reservar</p>
            </form>
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
