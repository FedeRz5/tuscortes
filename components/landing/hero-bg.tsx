"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

// ─── Spotlight que sigue el mouse ────────────────────────────────────────────

function Spotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const bg = useTransform(
    [smoothX, smoothY],
    ([x, y]: number[]) =>
      `radial-gradient(750px circle at ${x}px ${y}px,
        rgba(120,119,198,0.13) 0%,
        rgba(99,102,241,0.07) 35%,
        transparent 65%)`
  );

  useEffect(() => {
    // Inicializar en el centro de la ventana una vez montado
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ background: bg }}
    />
  );
}

// ─── Aurora blobs ─────────────────────────────────────────────────────────────

const BLOBS = [
  {
    color: "rgba(99,102,241,0.45)",
    size: 900,
    top: "-25%", left: "5%",
    blur: 100,
    anim: { x: [0, 70, -30, 0], y: [0, -50, 30, 0], scale: [1, 1.15, 0.9, 1] },
    dur: 22,
  },
  {
    color: "rgba(139,92,246,0.35)",
    size: 700,
    top: "10%", left: "55%",
    blur: 110,
    anim: { x: [0, -40, 60, 0], y: [0, 50, -20, 0], scale: [1, 0.9, 1.1, 1] },
    dur: 18,
  },
  {
    color: "rgba(67,56,202,0.3)",
    size: 600,
    top: "50%", left: "-10%",
    blur: 120,
    anim: { x: [0, 50, -10, 0], y: [0, -30, 40, 0], scale: [1, 1.05, 0.95, 1] },
    dur: 26,
  },
  {
    color: "rgba(249,115,22,0.12)",
    size: 500,
    top: "30%", left: "75%",
    blur: 130,
    anim: { x: [0, -30, 20, 0], y: [0, 40, -30, 0], scale: [1, 0.95, 1.08, 1] },
    dur: 20,
  },
  {
    color: "rgba(79,70,229,0.2)",
    size: 400,
    top: "65%", left: "40%",
    blur: 90,
    anim: { x: [0, 30, -40, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.92, 1] },
    dur: 16,
  },
];

function AuroraBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Aurora blobs */}
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: `blur(${blob.blur}px)`,
          }}
          animate={blob.anim}
          transition={{
            duration: blob.dur,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
        />
      ))}

      {/* Vignette — oscurece los bordes para mantener legibilidad */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(9,9,11,0.7) 100%)",
        }}
      />
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function HeroBg() {
  return (
    <>
      <AuroraBlobs />
      <Spotlight />
    </>
  );
}
