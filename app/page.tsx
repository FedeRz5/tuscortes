"use client";

import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/landing/reveal";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { StickySteps } from "@/components/landing/sticky-steps";
import { HeroBg } from "@/components/landing/hero-bg";

// ─── MercadoPago ─────────────────────────────────────────────────────────────
const MP_LINKS = {
  PRO: "https://mpago.la/pro-tuagenda",
  PREMIUM: "https://mpago.la/premium-tuagenda",
};

// ─── Planes ───────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Starter",
    price: "$12.500",
    period: "/mes",
    desc: "Para arrancar y ver si te sirve.",
    popular: false,
    href: "/login",
    features: [
      { text: "1 barbero", ok: true },
      { text: "40 turnos por mes", ok: true },
      { text: "Página de reservas pública", ok: true },
      { text: "Personalización completa", ok: false },
      { text: "Vacaciones y bloqueos", ok: false },
      { text: "Panel de ingresos", ok: false },
    ],
    cta: "Empezar",
  },
  {
    name: "Pro",
    price: "$20.999",
    period: "/mes",
    desc: "Todo lo que necesitás para no perder ni un turno.",
    popular: true,
    href: MP_LINKS.PRO,
    features: [
      { text: "Hasta 4 barberos", ok: true },
      { text: "Turnos ilimitados", ok: true },
      { text: "Página de reservas pública", ok: true },
      { text: "Personalización completa", ok: true },
      { text: "Vacaciones y bloqueos", ok: true },
      { text: "Panel de ingresos", ok: true },
    ],
    cta: "Elegir Pro",
  },
  {
    name: "Premium",
    price: "$32.900",
    period: "/mes",
    desc: "Para barberías que ya juegan en otra liga.",
    popular: false,
    href: MP_LINKS.PREMIUM,
    features: [
      { text: "Barberos ilimitados", ok: true },
      { text: "Turnos ilimitados", ok: true },
      { text: "Página de reservas pública", ok: true },
      { text: "Personalización completa", ok: true },
      { text: "Vacaciones y bloqueos", ok: true },
      { text: "Panel de ingresos + exportar CSV", ok: true },
    ],
    cta: "Elegir Premium",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <HeroBg />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95">
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">TA</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Tu Agenda</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="#como-funciona" className="hover:text-gray-900 transition-colors">Cómo funciona</a>
            <a href="#planes" className="hover:text-gray-900 transition-colors">Planes</a>
          </div>
          <Link href="/login" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors px-5 py-2.5 rounded-xl">
            Ingresar
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 pt-16 pb-16 overflow-hidden">
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Texto */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="hero-1 text-5xl sm:text-6xl font-black tracking-tight leading-[1.05] mb-2 text-gray-900">
              Dejá de gestionar
            </h1>
            <h1 className="hero-2 text-5xl sm:text-6xl font-black tracking-tight leading-[1.05] mb-8">
              <span className="gradient-text-orange">turnos por WhatsApp</span>
            </h1>

            <p className="hero-3 text-lg text-gray-500 max-w-md mb-10 leading-relaxed mx-auto lg:mx-0">
              Tu barbería tiene su propia página de reservas. Los clientes
              eligen horario solos — sin llamadas, sin olvidos, sin vos en el medio.
            </p>

            <div className="hero-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-base font-bold text-white hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/25"
              >
                Empezar gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/b/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Ver demo →
              </Link>
            </div>

            <div className="hero-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 justify-center lg:justify-start">
              {["Sin tarjeta de crédito", "Cancela cuando quieras", "Listo en 5 minutos"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup browser */}
          <div className="hero-2 flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              {/* Glow detrás */}
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-2xl" />
              {/* Browser chrome */}
              <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80 overflow-hidden">
                {/* Barra del browser */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                    <div className="h-3 w-3 rounded-full bg-green-400/70" />
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 font-mono">
                    tuagenda.com/barberia-carlos
                  </div>
                </div>
                {/* Contenido simulado de la página de reservas */}
                <div className="bg-white p-5 space-y-4">
                  {/* Header de la barbería */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                      <span className="text-white font-black text-sm">BC</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Barbería Carlos</p>
                      <p className="text-xs text-gray-400">Palermo, Buenos Aires</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs bg-green-50 text-green-600 font-semibold px-2 py-1 rounded-full border border-green-100">Abierto</span>
                    </div>
                  </div>
                  {/* Selección de servicio */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Elegí un servicio</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "Corte clásico", price: "$3.500", time: "30 min", active: true },
                        { name: "Corte + barba", price: "$5.500", time: "50 min", active: false },
                      ].map((s) => (
                        <div key={s.name} className={`rounded-xl border p-3 cursor-pointer transition-all ${s.active ? "border-indigo-500 bg-indigo-50" : "border-gray-100 hover:border-gray-200"}`}>
                          <p className={`text-xs font-bold ${s.active ? "text-indigo-700" : "text-gray-700"}`}>{s.name}</p>
                          <p className={`text-xs mt-0.5 ${s.active ? "text-indigo-500" : "text-gray-400"}`}>{s.price} · {s.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Selección de horario */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Elegí un horario</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30"].map((h, i) => (
                        <div key={h} className={`text-xs text-center py-1.5 rounded-lg font-medium transition-all ${i === 2 ? "bg-indigo-600 text-white" : i === 5 ? "bg-gray-100 text-gray-300 line-through" : "bg-gray-50 text-gray-600 hover:bg-indigo-50"}`}>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Botón confirmar */}
                  <div className="pt-1">
                    <div className="w-full bg-orange-500 text-white text-sm font-bold rounded-xl py-3 text-center">
                      Confirmar turno →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Steps ── */}
      <StickySteps />

      {/* ── Pricing ── */}
      <section id="planes" className="px-6 py-24 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-gray-900">Un plan para cada etapa de tu barbería</h2>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              Pagos vía MercadoPago · Cancela cuando quieras
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <StaggerItem key={plan.name}>
                <div
                  className={`relative rounded-2xl p-7 flex flex-col transition-transform hover:-translate-y-1 ${
                    plan.popular
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                  style={plan.popular ? { scale: 1.04 } : {}}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white whitespace-nowrap shadow-lg shadow-orange-500/30">
                      El más elegido
                    </div>
                  )}

                  <div className="mb-6">
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${plan.popular ? "text-indigo-200" : "text-gray-400"}`}>{plan.name}</p>
                    <div className="flex items-end gap-1 mb-2">
                      <span className={`text-4xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.price}</span>
                      {plan.period && <span className={`text-sm mb-1.5 ${plan.popular ? "text-indigo-200" : "text-gray-400"}`}>{plan.period}</span>}
                    </div>
                    <p className={`text-sm ${plan.popular ? "text-indigo-100" : "text-gray-400"}`}>{plan.desc}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map(({ text, ok }) => (
                      <li key={text} className="flex items-start gap-2.5 text-sm">
                        {ok
                          ? <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? "text-indigo-200" : "text-indigo-500"}`} />
                          : <XCircle className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                        }
                        <span className={ok ? (plan.popular ? "text-white" : "text-gray-700") : "text-gray-300"}>{text}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled
                    className={`block w-full text-center rounded-xl px-6 py-3 text-sm font-bold cursor-not-allowed opacity-50 ${
                      plan.popular
                        ? "bg-white text-indigo-600"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    Próximamente
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="px-6 py-24 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <div className="rounded-3xl bg-indigo-600 px-8 py-16">
              <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight text-white">
                Mañana ya estás<br />tomando turnos.
              </h2>
              <p className="text-indigo-200 mb-8 text-sm">Configurás en 5 minutos. Sin tarjeta.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-10 py-4 text-base font-bold text-white hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/30"
              >
                Empezar gratis <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">TA</span>
            </div>
            <span className="font-bold text-sm text-gray-900">Tu Agenda</span>
          </div>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Tu Agenda. Todos los derechos reservados.</p>
          <Link href="/login" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
            Acceder al panel →
          </Link>
        </div>
      </footer>
    </div>
  );
}
