"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, Check, CreditCard } from "lucide-react";
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
    name: "Free",
    price: "Gratis",
    period: null,
    desc: "Probalo sin poner la tarjeta.",
    popular: false,
    href: "/login",
    features: [
      { text: "1 barbero", ok: true },
      { text: "80 turnos por mes", ok: true },
      { text: "Página de reservas pública", ok: true },
      { text: "Personalización completa", ok: false },
      { text: "Vacaciones y bloqueos", ok: false },
      { text: "Panel de ingresos", ok: false },
    ],
    cta: "Probar gratis",
  },
  {
    name: "Pro",
    price: "USD 15",
    period: "/mes",
    desc: "El que usan la mayoría de las barberías.",
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
    price: "USD 35",
    period: "/mes",
    desc: "Varios barberos, todo en un solo panel.",
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
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <HeroBg />

      {/* ── Navbar ── */}
      <motion.header
        className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/85 backdrop-blur-xl"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
      >
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-white font-black text-sm">TA</span>
            </motion.div>
            <span className="font-bold text-lg tracking-tight">Tu Agenda</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
            <motion.a href="#como-funciona" className="hover:text-white transition-colors" whileHover={{ y: -1 }}>Cómo funciona</motion.a>
            <motion.a href="#planes" className="hover:text-white transition-colors" whileHover={{ y: -1 }}>Planes</motion.a>
          </div>
          <MagneticButton>
            <Link href="/login" className="text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 transition-colors px-5 py-2.5 rounded-xl">
              Ingresar
            </Link>
          </MagneticButton>
        </nav>
      </motion.header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-6 pt-16 pb-8 overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Badge */}
          {/* Headline */}
          <motion.h1
            className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-2 text-glow-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
          >
            Dejá de gestionar
          </motion.h1>
          <motion.h1
            className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
          >
            <span className="gradient-text-orange text-glow-orange">turnos por WhatsApp</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Tu barbería tiene su propia página de reservas. Los clientes
            eligen horario solos — sin llamadas, sin olvidos, sin vos en el medio.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <MagneticButton>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-base font-bold text-white hover:bg-orange-400 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.55)]"
              >
                Empezar gratis
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}>
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/b/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 text-base font-semibold text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all"
              >
                Ver demo →
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {["Sin tarjeta de crédito", "Cancela cuando quieras", "Listo en 5 minutos"].map((t, i) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Sticky steps con phone ── */}
      <StickySteps />

      {/* ── Pricing ── */}
      <section id="planes" className="px-6 py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Simple y sin letra chica</h2>
            <p className="text-zinc-400 text-sm flex items-center justify-center gap-2">
              <CreditCard className="h-4 w-4 text-zinc-500" />
              Pagos vía MercadoPago · Cancela cuando quieras
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <StaggerItem key={plan.name}>
                <motion.div
                  className={`relative rounded-2xl p-7 flex flex-col ${
                    plan.popular ? "bg-zinc-900 glow-border animate-pulse-glow" : "border border-zinc-800 bg-zinc-900/50"
                  }`}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={plan.popular ? { scale: 1.03 } : {}}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold text-white whitespace-nowrap"
                      animate={{ boxShadow: ["0 0 10px rgba(99,102,241,0.5)","0 0 22px rgba(99,102,241,0.9)","0 0 10px rgba(99,102,241,0.5)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      El más elegido
                    </motion.div>
                  )}

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">{plan.name}</p>
                    <div className="flex items-end gap-1 mb-2">
                      <span className={`text-4xl font-black ${plan.popular ? "gradient-text" : ""}`}>{plan.price}</span>
                      {plan.period && <span className="text-zinc-400 text-sm mb-1.5">{plan.period}</span>}
                    </div>
                    <p className="text-zinc-400 text-sm">{plan.desc}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map(({ text, ok }) => (
                      <li key={text} className="flex items-start gap-2.5 text-sm">
                        {ok
                          ? <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                          : <XCircle className="h-4 w-4 text-zinc-700 shrink-0 mt-0.5" />
                        }
                        <span className={ok ? "text-zinc-200" : "text-zinc-600"}>{text}</span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton className="w-full">
                    <Link
                      href={plan.href}
                      className={`block w-full text-center rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                        plan.popular
                          ? "bg-orange-500 text-white hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_35px_rgba(249,115,22,0.5)]"
                          : "border border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </MagneticButton>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <motion.div
              className="relative rounded-3xl overflow-hidden px-8 py-16 text-center"
              style={{ background: "linear-gradient(135deg, #18181b 0%, #1e1b4b 50%, #18181b 100%)" }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="absolute inset-0 rounded-3xl border border-indigo-500/20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
              <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
                Mañana ya estás<br />
                <span className="gradient-text">tomando turnos.</span>
              </h2>
              <p className="text-zinc-400 mb-8 text-sm">Configurás en 5 minutos. Sin tarjeta.</p>
              <MagneticButton>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-10 py-4 text-base font-bold text-white hover:bg-orange-400 transition-all shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)]"
                >
                  Empezar gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">TA</span>
            </div>
            <span className="font-bold text-sm">Tu Agenda</span>
          </div>
          <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} Tu Agenda. Todos los derechos reservados.</p>
          <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">
            Acceder al panel →
          </Link>
        </div>
      </footer>
    </div>
  );
}
