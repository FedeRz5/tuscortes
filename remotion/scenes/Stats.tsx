import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../constants";
import { Background } from "../components/Background";
import { CountUp, LineReveal } from "../components/TextReveal";

interface StatCardProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel: string;
  icon: string;
  delay: number;
  accentColor: string;
  accentBg: string;
}

const BigStat: React.FC<StatCardProps> = ({
  value, prefix = "", suffix = "", label, sublabel, icon, delay, accentColor, accentBg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 160 },
  });

  const opacity = interpolate(progress, [0, 0.4], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.88, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 20,
        padding: "28px 32px",
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div style={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentBg} 0%, transparent 65%)`,
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: accentBg,
          border: `1px solid ${accentColor}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}>
          {icon}
        </div>
      </div>

      <CountUp
        to={value}
        delay={delay + 5}
        duration={70}
        prefix={prefix}
        suffix={suffix}
        fontSize={64}
        fontWeight={900}
        color={C.white}
      />

      <div style={{ fontSize: 16, fontWeight: 700, color: accentColor, marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: C.dim, marginTop: 3 }}>{sublabel}</div>
    </div>
  );
};

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 18, 132, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: sceneOpacity }}>
      <Background accent="neutral" intensity={0.9} />

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
        gap: 40,
      }}>
        {/* Headline */}
        <div style={{ textAlign: "center" }}>
          <LineReveal delay={5}>
            <div style={{ fontSize: 15, color: C.orange, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
              Resultados reales
            </div>
          </LineReveal>
          <LineReveal delay={12}>
            <div style={{
              fontSize: 62,
              fontWeight: 900,
              color: C.white,
              letterSpacing: "-2.5px",
              lineHeight: 1.05,
            }}>
              Tu barbería, en números.
            </div>
          </LineReveal>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, width: "100%" }}>
          <BigStat value={148} suffix="+" label="Turnos este mes" sublabel="Solo en Ramos Cutz" icon="📅" delay={25} accentColor={C.blue} accentBg="rgba(96,165,250,0.15)" />
          <BigStat value={50500} prefix="$" label="Proyectado mes" sublabel="Ingresos bajo control" icon="💰" delay={38} accentColor={C.success} accentBg="rgba(16,185,129,0.15)" />
          <BigStat value={3} label="Barberos coordinados" sublabel="Horarios independientes" icon="✂️" delay={51} accentColor={C.orange} accentBg="rgba(249,115,22,0.15)" />
          <BigStat value={0} suffix=" llamadas" label="Para reservar" sublabel="Todo es automático" icon="📵" delay={64} accentColor={C.purple} accentBg="rgba(167,139,250,0.15)" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
