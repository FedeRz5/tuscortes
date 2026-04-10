"use client";

import {
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  Scissors,
  TrendingUp,
  Smartphone,
  Shield,
  Zap,
  Star,
  Phone,
  Mail,
  Printer,
  XCircle,
} from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "$12.500",
    period: "/mes",
    desc: "Para arrancar sin riesgo.",
    features: [
      "1 barbero",
      "Hasta 40 turnos por mes",
      "Página de reservas pública",
      "Gestión de servicios",
      "Panel de control",
    ],
    missing: [
      "Personalización de marca",
      "Vacaciones y bloqueos",
      "Panel de ingresos",
    ],
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Pro",
    price: "$20.999",
    period: "/mes",
    desc: "El más elegido por barberías en crecimiento.",
    features: [
      "Hasta 4 barberos",
      "Turnos ilimitados",
      "Página de reservas pública",
      "Personalización completa (logo, colores, portada)",
      "Vacaciones y bloqueos de agenda",
      "Panel de ingresos y caja",
    ],
    missing: ["Exportación CSV"],
    popular: true,
    color: "border-indigo-600",
  },
  {
    name: "Premium",
    price: "$32.900",
    period: "/mes",
    desc: "Para barberías que ya juegan en otra liga.",
    features: [
      "Barberos ilimitados",
      "Turnos ilimitados",
      "Página de reservas pública",
      "Personalización completa",
      "Vacaciones y bloqueos",
      "Panel de ingresos + exportación CSV",
    ],
    missing: [],
    popular: false,
    color: "border-gray-200",
  },
];

const FEATURES = [
  {
    icon: Calendar,
    title: "Reservas 24/7 sin intervención",
    desc: "Tus clientes reservan desde el celular a cualquier hora, cualquier día. Sin llamadas, sin mensajes de WhatsApp, sin vos en el medio.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Users,
    title: "Multi-barbero y multi-servicio",
    desc: "Cada barbero tiene su propia agenda, horarios y servicios. Los clientes eligen con quién y a qué hora quieren ser atendidos.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Smartphone,
    title: "Página de reservas propia",
    desc: "Cada barbería tiene su link único (ej: tuscortes.com/b/tu-barberia) con tu logo, colores y fotos. Sin apps a descargar.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Clock,
    title: "Horarios inteligentes",
    desc: "Configurás días, horarios y tiempos de descanso por barbero. El sistema calcula automáticamente qué turnos están disponibles.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: TrendingUp,
    title: "Panel de ingresos",
    desc: "Visualizá en tiempo real cuánto facturaste hoy, esta semana y este mes. Marcá turnos como cobrados y exportá a Excel.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Shield,
    title: "Vacaciones y bloqueos",
    desc: "¿Feriado, reforma o vacaciones? Bloqueá fechas para toda la barbería o para un barbero específico con dos clicks.",
    color: "bg-red-50 text-red-600",
  },
];

export default function PropuestaPage() {
  const handlePrint = () => window.print();

  return (
    <>
      {/* Print button — hidden when printing */}
      <div className="print:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
        >
          <Printer className="h-4 w-4" />
          Guardar como PDF
        </button>
      </div>

      <div className="min-h-screen bg-white text-gray-900 font-sans">
        {/* ── PORTADA ─────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white px-8 py-20 print:py-16 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">
                TusCortes
              </span>
            </div>

            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-4">
              Propuesta Comercial
            </p>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
              El sistema de turnos online
              <br />
              <span className="text-orange-400">diseñado para barberías</span>
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl leading-relaxed mb-10">
              Automatizá tus reservas, eliminá las consultas por WhatsApp y
              enfocate en lo que realmente importa: atender a tus clientes y
              hacer crecer tu barbería.
            </p>

            <div className="grid grid-cols-3 gap-6 max-w-lg">
              {[
                { value: "5 min", label: "para configurar" },
                { value: "24/7", label: "reservas activas" },
                { value: "0", label: "comisión por turno" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-indigo-200 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-8 py-16 print:py-10 space-y-20 print:space-y-12">
          {/* ── EL PROBLEMA ─────────────────────────────────────────── */}
          <section className="print:break-inside-avoid">
            <Label>El problema</Label>
            <h2 className="text-3xl font-black mb-4">
              ¿Cuánto tiempo perdés gestionando turnos por WhatsApp?
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              La mayoría de las barberías en Argentina gestionan sus turnos de
              manera manual: mensajes de WhatsApp a toda hora, confusiones con
              los horarios, turnos que no se confirman, clientes que preguntan
              &ldquo;¿tienen lugar el jueves?&rdquo;. Esto no solo consume tiempo — consume
              energía y genera errores.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Mensajes fuera de horario",
                  desc: "Clientes que te escriben a las 11pm preguntando por un turno para mañana.",
                },
                {
                  title: "Doble reserva",
                  desc: "Dos clientes para el mismo horario porque lo gestionabas a mano o de memoria.",
                },
                {
                  title: "No shows y cancelaciones tardías",
                  desc: "Sin sistema, no hay historial ni forma de saber quién cancela seguido.",
                },
                {
                  title: "Tiempo improductivo",
                  desc: "Minutos que se van en responder mensajes en vez de cortar o hacer crecer el negocio.",
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="flex gap-4 p-5 rounded-xl bg-red-50 border border-red-100"
                >
                  <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{p.title}</p>
                    <p className="text-gray-500 text-sm mt-1">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── LA SOLUCIÓN ─────────────────────────────────────────── */}
          <section className="print:break-inside-avoid">
            <Label>La solución</Label>
            <h2 className="text-3xl font-black mb-4">
              TusCortes: reservas automáticas, sin fricción
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              TusCortes es un sistema de gestión de turnos online desarrollado
              específicamente para barberías argentinas. En menos de 5 minutos
              tenés tu página de reservas activa, tu equipo cargado y tus
              horarios configurados. Desde ese momento, los turnos se llenan
              solos.
            </p>

            <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-600 shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-xl text-gray-900 mb-2">
                    Así funciona en la práctica
                  </p>
                  <ol className="space-y-3">
                    {[
                      "Creás tu cuenta y configurás tus barberos, servicios y horarios.",
                      "Compartís tu link único con tus clientes (por WhatsApp, Instagram, o en tu bio).",
                      "Ellos eligen servicio, barbero, día y horario desde su celular — sin llamar, sin esperar respuesta.",
                      "Vos recibís el turno confirmado directamente en tu panel. Listo.",
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3 text-gray-700">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* ── FUNCIONALIDADES ─────────────────────────────────────── */}
          <section>
            <Label>Funcionalidades</Label>
            <h2 className="text-3xl font-black mb-10">
              Todo lo que necesitás, nada que no
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors print:break-inside-avoid"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${f.color}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">
                      {f.title}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ROI ─────────────────────────────────────────────────── */}
          <section className="print:break-inside-avoid">
            <Label>Retorno de inversión</Label>
            <h2 className="text-3xl font-black mb-4">
              ¿Cuánto vale tu tiempo?
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Si respondés 10 consultas de turno por día y cada una te toma 3
              minutos, estás gastando{" "}
              <strong className="text-gray-900">30 minutos diarios</strong> en
              mensajes. En un mes, son más de{" "}
              <strong className="text-gray-900">12 horas perdidas</strong> que
              podrías estar usando para atender más clientes o simplemente
              descansar.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  value: "~12 hs",
                  label: "ahorradas por mes en gestión de turnos",
                  highlight: false,
                },
                {
                  value: "+$0",
                  label:
                    "de comisión por turno. Pagás solo la suscripción mensual fija.",
                  highlight: false,
                },
                {
                  value: "100%",
                  label: "tuyo. Sin contratos ni permanencia mínima.",
                  highlight: true,
                },
              ].map((r) => (
                <div
                  key={r.label}
                  className={`rounded-xl p-5 text-center ${r.highlight ? "bg-indigo-600 text-white" : "bg-gray-50 border border-gray-100"}`}
                >
                  <p
                    className={`text-3xl font-black mb-2 ${r.highlight ? "text-white" : "text-indigo-600"}`}
                  >
                    {r.value}
                  </p>
                  <p
                    className={`text-xs leading-relaxed ${r.highlight ? "text-indigo-100" : "text-gray-500"}`}
                  >
                    {r.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── PLANES ──────────────────────────────────────────────── */}
          <section className="print:break-before-page">
            <Label>Planes y precios</Label>
            <h2 className="text-3xl font-black mb-3">
              Precios en pesos argentinos, sin sorpresas
            </h2>
            <p className="text-gray-500 mb-10">
              Sin contratos de permanencia. Cancelás cuando quieras.
            </p>

            <div className="grid sm:grid-cols-3 gap-5">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border-2 p-6 flex flex-col ${plan.popular ? "border-indigo-600 shadow-lg shadow-indigo-500/10" : plan.color}`}
                >
                  {plan.popular && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                      <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                        Más elegido
                      </span>
                    </div>
                  )}
                  <p
                    className={`text-sm font-bold uppercase tracking-widest mb-1 ${plan.popular ? "text-indigo-600" : "text-gray-400"}`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-black text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-sm mb-1">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-5">{plan.desc}</p>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{f}</span>
                      </li>
                    ))}
                    {plan.missing.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-gray-200 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── POR QUÉ ELEGIRNOS ───────────────────────────────────── */}
          <section className="print:break-inside-avoid">
            <Label>¿Por qué TusCortes?</Label>
            <h2 className="text-3xl font-black mb-8">
              Pensado para el mercado argentino
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Precios en pesos, sin ataduras al dólar",
                  desc: "Sabés exactamente cuánto pagás cada mes. Sin conversiones, sin sorpresas.",
                },
                {
                  title: "Sin app para tus clientes",
                  desc: "Reservan desde cualquier navegador. No tienen que bajarse nada ni crear cuentas.",
                },
                {
                  title: "Soporte directo y en español",
                  desc: "Hablás con la persona que desarrolló el sistema, no con un bot ni un call center.",
                },
                {
                  title: "Actualizaciones continuas",
                  desc: "El sistema evoluciona en base al feedback de los usuarios. Si necesitás algo, lo escuchamos.",
                },
                {
                  title: "Tus datos son tuyos",
                  desc: "Exportás toda la información cuando quieras. Sin dependencia ni lock-in.",
                },
                {
                  title: "Configuración en 5 minutos",
                  desc: "Creás la cuenta, cargás tu equipo y servicios, y ya estás listo para recibir reservas.",
                },
              ].map((r) => (
                <div
                  key={r.title}
                  className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{r.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── PRÓXIMOS PASOS ──────────────────────────────────────── */}
          <section className="print:break-inside-avoid">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-10 text-center">
              <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-3">
                Próximos pasos
              </p>
              <h2 className="text-3xl font-black mb-4">¿Listo para empezar?</h2>
              <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
                Podés crear tu cuenta y explorar el sistema sin compromiso. Si
                tenés alguna pregunta o querés que te hagamos una demo
                personalizada, contactanos directamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-5 py-3 text-sm">
                  <Phone className="h-4 w-4 text-indigo-200" />
                  <span>+54 11 5131-2610</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-5 py-3 text-sm">
                  <Mail className="h-4 w-4 text-indigo-200" />
                  <span>hola@tuscortes.com.ar</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── FOOTER ──────────────────────────────────────────────── */}
          <footer className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 print:break-inside-avoid">
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-indigo-500" />
              <span className="font-bold text-gray-600">TusCortes</span>
              <span>— Sistema de turnos para barberías</span>
            </div>
            <span>
              © {new Date().getFullYear()} TusCortes. Todos los derechos
              reservados.
            </span>
          </footer>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-0.5 w-6 bg-indigo-600 rounded-full" />
      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
        {children}
      </span>
    </div>
  );
}
