"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Link2 } from "lucide-react";

// ─── useTyping hook ───────────────────────────────────────────────────────────

function useTyping(text: string, delayStart = 400, speed = 50, cycle = 0) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delayStart);
    return () => { clearTimeout(start); clearInterval(interval); };
  }, [text, delayStart, speed, cycle]);
  return displayed;
}

// ─── Card 01: Setup ───────────────────────────────────────────────────────────

function CardSetup({ active }: { active: boolean }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (active) setKey(k => k + 1);
  }, [active]);

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-xl space-y-2.5">
      <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
        Configurando tu barbería
      </p>
      {[
        { label: "Nombre", value: "Mi Barbería" },
        { label: "Barbero", value: "Carlos → Lun-Vie 9-18hs" },
        { label: "Servicio", value: "Corte $2,500 · 30 min" },
      ].map(({ label, value }, i) => (
        <motion.div
          key={`${key}-${label}`}
          className="flex items-start gap-2.5 rounded-xl bg-zinc-800 px-3 py-2.5"
          initial={{ opacity: 0, x: 16 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
          transition={{ delay: i * 0.18, duration: 0.4 }}
        >
          <div className="mt-0.5 h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 leading-none mb-0.5">{label}</p>
            <p className="text-xs text-zinc-200 font-medium">{value}</p>
          </div>
        </motion.div>
      ))}
      <motion.div
        key={`${key}-btn`}
        className="w-full bg-orange-500 text-white text-[11px] font-bold rounded-xl py-2.5 mt-1 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 0.56, duration: 0.4 }}
      >
        Ir a mi página →
      </motion.div>
    </div>
  );
}

// ─── Card 02: Share ───────────────────────────────────────────────────────────

const URL_TEXT = "tuscortes.com/mi-barberia";
// tipeo: 400 + 25*45 = 1525ms · copiado: +600ms · pausa: +2000ms
const SHARE_LOOP = 400 + URL_TEXT.length * 45 + 600 + 2000;

function CardShare({ active }: { active: boolean }) {
  const [cycle, setCycle] = useState(0);
  const url = useTyping(URL_TEXT, 400, 45, cycle);
  const [copied, setCopied] = useState(false);

  // reiniciar cuando entra en view
  useEffect(() => {
    if (active) setCycle(c => c + 1);
  }, [active]);

  // loop mientras está activo
  useEffect(() => {
    if (!active) return;
    setCopied(false);
    const tCopy = setTimeout(() => setCopied(true), 400 + URL_TEXT.length * 45 + 600);
    const tLoop = setTimeout(() => setCycle(c => c + 1), SHARE_LOOP);
    return () => { clearTimeout(tCopy); clearTimeout(tLoop); };
  }, [cycle, active]);

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-xl space-y-3">
      <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
        Tu link está listo ✦
      </p>

      {/* Browser bar */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-3">
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex gap-1">
            {["bg-red-500/60", "bg-yellow-500/60", "bg-green-500/60"].map(c => (
              <div key={c} className={`h-1.5 w-1.5 rounded-full ${c}`} />
            ))}
          </div>
          <div className="flex-1 h-5 rounded-md bg-zinc-800 flex items-center px-2 overflow-hidden">
            <span className="text-[9px] font-mono text-zinc-300 truncate leading-none">
              {url}
              <motion.span
                className="inline-block w-[1px] h-[9px] bg-indigo-400 ml-[1px] align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.75, repeat: Infinity }}
              />
            </span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {!copied ? (
            <motion.div
              key="copy"
              className="flex items-center justify-center gap-1.5 w-full text-[10px] font-bold rounded-lg py-1.5 bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Link2 className="h-2.5 w-2.5" /> Copiar link
            </motion.div>
          ) : (
            <motion.div
              key="copied"
              className="flex items-center justify-center gap-1.5 w-full text-[10px] font-bold rounded-lg py-1.5 bg-green-500/15 text-green-400 border border-green-500/25"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} /> ¡Copiado!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share buttons */}
      <motion.p
        className="text-zinc-600 text-[10px] text-center"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.4 }}
      >
        Compartí directamente en
      </motion.p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "WhatsApp", icon: "W", color: "bg-green-500/15 border-green-500/30 text-green-400", delay: 1.55 },
          { label: "Instagram", icon: "IG", color: "bg-pink-500/15 border-pink-500/30 text-pink-400", delay: 1.7 },
        ].map(({ label, icon, color, delay }) => (
          <motion.div
            key={`${cycle}-${label}`}
            className={`rounded-xl border px-2 py-2 flex items-center justify-center gap-1.5 text-[10px] font-bold ${color}`}
            initial={{ opacity: 0, y: 8 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay, duration: 0.3, type: "spring" }}
          >
            <span className="font-black text-[11px]">{icon}</span> {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Card 03: Book ────────────────────────────────────────────────────────────

// nombre: 600 + 13*55 = 1315ms · telefono: 1315+300 + 12*50 = 2215ms · confirm: +900ms · pausa: +2000ms
const BOOK_LOOP = 600 + 13 * 55 + 300 + 12 * 50 + 900 + 2000;

function CardBook({ active }: { active: boolean }) {
  const [cycle, setCycle] = useState(0);
  const nombre = useTyping("Martín García", 600, 55, cycle);
  const telefono = useTyping("11 4523-9801", 600 + 13 * 55 + 300, 50, cycle);
  const allTyped = telefono === "11 4523-9801";
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (active) setCycle(c => c + 1);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    setConfirmed(false);
    const tLoop = setTimeout(() => setCycle(c => c + 1), BOOK_LOOP);
    return () => clearTimeout(tLoop);
  }, [cycle, active]);

  useEffect(() => {
    if (!allTyped || !active) return;
    const t = setTimeout(() => setConfirmed(true), 900);
    return () => clearTimeout(t);
  }, [allTyped, active]);

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-xl">
      <AnimatePresence mode="wait">
        {!confirmed ? (
          <motion.div key={`form-${cycle}`} className="space-y-2.5" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
            <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">Tus datos</p>
            <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-2">
              <p className="text-[9px] text-indigo-400 font-medium">Carlos · Corte · Lun 10:00hs</p>
            </div>
            {/* Nombre */}
            <div className="rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2">
              <p className="text-[9px] text-zinc-500 mb-0.5">Nombre</p>
              <div className="flex items-center h-4">
                <span className="text-xs text-zinc-200 font-medium">{nombre}</span>
                {nombre !== "Martín García" && nombre.length > 0 && (
                  <motion.span
                    className="inline-block w-[1px] h-[11px] bg-indigo-400 ml-[1px]"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.65, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
            {/* Teléfono */}
            <div className="rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2">
              <p className="text-[9px] text-zinc-500 mb-0.5">Teléfono</p>
              <div className="flex items-center h-4">
                <span className="text-xs text-zinc-200 font-medium">{telefono}</span>
                {telefono.length > 0 && telefono !== "11 4523-9801" && (
                  <motion.span
                    className="inline-block w-[1px] h-[11px] bg-indigo-400 ml-[1px]"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.65, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
            <motion.div
              className={`w-full text-[11px] font-bold rounded-xl py-2.5 text-center transition-colors ${
                allTyped ? "bg-orange-500 text-white" : "bg-zinc-700 text-zinc-500"
              }`}
              animate={allTyped ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.35 }}
            >
              Confirmar turno →
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={`success-${cycle}`}
            className="flex flex-col items-center justify-center py-8 gap-3"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="h-14 w-14 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 22px rgba(34,197,94,0.4)", "0 0 0px rgba(34,197,94,0)"] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              >
                <Check className="h-6 w-6 text-green-400" strokeWidth={3} />
              </motion.div>
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-black text-white">¡Turno confirmado!</p>
              <p className="text-[10px] text-zinc-400 mt-1">Carlos · Lunes 10:00hs</p>
            </div>
            <motion.div
              className="text-[9px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Aparece en tu panel ahora mismo
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Configurás tu barbería",
    desc: "Registrate, cargá tus barberos, servicios y horarios. Listo en minutos.",
    Card: CardSetup,
  },
  {
    number: "02",
    title: "Compartís tu link",
    desc: "Pegalo en tu bio de Instagram o envialo por WhatsApp. tuscortes.com/tu-barberia",
    Card: CardShare,
  },
  {
    number: "03",
    title: "Tus clientes reservan solos",
    desc: "Sin llamadas, sin mensajes. El turno aparece directo en tu panel.",
    Card: CardBook,
  },
];

function Step({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px", once: false });

  return (
    <div
      ref={ref}
      className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-16 lg:py-20 border-b border-white/5 last:border-0"
    >
      {/* Text */}
      <motion.div
        className="flex-1 space-y-4"
        animate={{ opacity: inView ? 1 : 0.35, x: inView ? 0 : -10 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-lg font-black text-indigo-400">{step.number}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black">{step.title}</h3>
        <p className="text-zinc-400 leading-relaxed max-w-sm">{step.desc}</p>
        {/* Progress dots */}
        <div className="flex gap-2 pt-1">
          {STEPS.map((_, j) => (
            <div
              key={j}
              className={`h-1 rounded-full transition-all duration-300 ${
                j === index
                  ? "w-6 bg-indigo-400"
                  : j < index
                  ? "w-2 bg-indigo-600/50"
                  : "w-2 bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Animated card */}
      <motion.div
        className="w-full lg:w-[300px] shrink-0"
        animate={{ opacity: inView ? 1 : 0.2, y: inView ? 0 : 12 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <step.Card active={inView} />
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function StickySteps() {
  return (
    <section id="como-funciona" className="border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="py-20 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ¿Cómo funciona?
          </motion.h2>
          <motion.p
            className="text-zinc-500 mt-3 text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Del registro al primer turno en menos de 10 minutos.
          </motion.p>
        </div>

        {/* Steps */}
        {STEPS.map((step, i) => (
          <Step key={step.number} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}
