"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

const MESSAGES = [
  { text: "Hola puedo hoy a las 3?", right: false },
  { text: "me anotás el viernes?", right: true },
  { text: "cuándo tenés lugar?", right: false },
  { text: "me olvidé a qué hora era 😅", right: true },
  { text: "para corte y barba cuánto sale?", right: false },
  { text: "estás mañana a la tarde?", right: true },
  { text: "me anotás con Carlos?", right: false },
  { text: "a qué hora abrís hoy?", right: true },
  { text: "puedo ir sin turno?", right: false },
  { text: "el martes a la tarde tenés?", right: true },
  { text: "me cancelaron el turno 😤", right: false },
  { text: "hay lugar para las 5?", right: true },
  { text: "y para el sábado?", right: false },
  { text: "cuánto el degradé?", right: true },
];

// Posiciones fijas (no random en render) para evitar hydration issues
const CONFIGS = [
  { x: 4,  delay: 0.0, duration: 3.8, targetY: -55 },
  { x: 62, delay: 0.4, duration: 4.2, targetY: -70 },
  { x: 22, delay: 0.7, duration: 3.6, targetY: -45 },
  { x: 78, delay: 0.2, duration: 4.0, targetY: -65 },
  { x: 12, delay: 1.1, duration: 3.9, targetY: -80 },
  { x: 48, delay: 0.5, duration: 4.1, targetY: -50 },
  { x: 83, delay: 0.9, duration: 3.7, targetY: -60 },
  { x: 33, delay: 0.3, duration: 4.3, targetY: -75 },
  { x: 91, delay: 0.6, duration: 3.5, targetY: -40 },
  { x: 6,  delay: 1.3, duration: 4.0, targetY: -68 },
  { x: 70, delay: 0.8, duration: 3.8, targetY: -55 },
  { x: 40, delay: 1.0, duration: 4.2, targetY: -72 },
  { x: 56, delay: 0.1, duration: 3.6, targetY: -48 },
  { x: 18, delay: 0.6, duration: 4.1, targetY: -62 },
];

type Phase = "chaos" | "collapsing" | "flash" | "phone";

interface BubbleProps {
  message: string;
  config: typeof CONFIGS[0];
  phase: Phase;
  index: number;
}

function Bubble({ message, config, phase, index }: BubbleProps) {
  const isRight = index % 2 === 1;
  const collapseDelay = index * 0.04; // escalonar colapso

  const chaosVariants = {
    hidden: { y: "8vh", opacity: 0, scale: 0.8 },
    floating: {
      y: `${config.targetY}vh`,
      opacity: [0, 0.75, 0.75, 0.6],
      scale: 1,
      transition: {
        y: { duration: config.duration, ease: [0.0, 0.0, 0.2, 1] as [number,number,number,number] },
        opacity: { duration: 1.2, delay: config.delay },
        scale: { duration: 0.4, delay: config.delay },
      },
    },
    collapsing: {
      x: isRight ? "-38vw" : "38vw",
      y: "12vh",
      scale: 0,
      opacity: 0,
      rotate: isRight ? -120 : 120,
      transition: {
        duration: 0.55,
        delay: collapseDelay,
        ease: [0.4, 0, 1, 1] as [number,number,number,number],
      },
    },
  };

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${config.x}%`, bottom: 0, willChange: "transform, opacity" }}
      initial="hidden"
      animate={phase === "collapsing" ? "collapsing" : phase === "chaos" ? "floating" : "collapsing"}
      variants={chaosVariants}
    >
      <div
        className={`
          max-w-[180px] rounded-2xl px-3.5 py-2.5 text-xs font-medium shadow-lg
          border
          ${isRight
            ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-200 rounded-br-sm"
            : "bg-zinc-700/50 border-zinc-600/40 text-zinc-200 rounded-bl-sm"
          }
        `}
      >
        {message}
      </div>
    </motion.div>
  );
}

function FlashRing() {
  return (
    <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-indigo-400/60"
          style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 200 + i * 80, height: 200 + i * 80, opacity: 0 }}
          transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="absolute rounded-full bg-indigo-500/30"
        style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 60, height: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

interface ChaosHeroProps {
  onPhoneReady?: () => void;
}

export function ChaosBubbles({ onPhoneReady }: ChaosHeroProps) {
  const [phase, setPhase] = useState<Phase>("chaos");
  const [cycle, setCycle] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    // Cycle: chaos (3.8s) → collapsing (0.8s) → flash → phone (3s) → reset
    const t1 = setTimeout(() => setPhase("collapsing"), 3800);
    const t2 = setTimeout(() => { setShowFlash(true); setPhase("flash"); }, 4600);
    const t3 = setTimeout(() => { setShowFlash(false); setPhase("phone"); onPhoneReady?.(); }, 5100);
    const t4 = setTimeout(() => {
      setPhase("chaos");
      setCycle((c) => c + 1);
    }, 9000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [cycle]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-transparent to-zinc-950/80 z-10" />

      {/* Burbujas */}
      {CONFIGS.map((cfg, i) => (
        <Bubble
          key={`${cycle}-${i}`}
          message={MESSAGES[i % MESSAGES.length].text}
          config={cfg}
          phase={phase === "phone" || phase === "flash" ? "collapsing" : phase}
          index={i}
        />
      ))}

      {/* Flash de vórtice */}
      <AnimatePresence>{showFlash && <FlashRing key={`flash-${cycle}`} />}</AnimatePresence>
    </div>
  );
}
