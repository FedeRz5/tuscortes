import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../constants";
import { Background } from "../components/Background";
import { WordReveal } from "../components/TextReveal";

const MissedCall: React.FC<{ delay: number; x: number; y: number; angle: number }> = ({
  delay, x, y, angle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 200 } });
  const opacity = interpolate(progress, [0, 0.4], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.4, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        opacity: opacity * 0.7,
        transform: `scale(${scale}) rotate(${angle}deg)`,
        background: "rgba(239,68,68,0.12)",
        border: "1px solid rgba(239,68,68,0.3)",
        backdropFilter: "blur(8px)",
        borderRadius: 12,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 16 }}>📵</span>
      <div>
        <div style={{ fontSize: 11, color: "#FCA5A5", fontWeight: 700 }}>Llamada perdida</div>
        <div style={{ fontSize: 10, color: "rgba(252,165,165,0.6)" }}>Cliente potencial</div>
      </div>
    </div>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 15, 195, 210], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Counter: missed clients
  const counterProgress = Math.min(1, Math.max(0, (frame - 50) / 80));
  const eased = 1 - Math.pow(1 - counterProgress, 3);
  const lostClients = Math.round(eased * 7);

  // Solution line fade in
  const solutionOpacity = interpolate(frame, [130, 160], [0, 1], { extrapolateRight: "clamp" });
  const solutionY = interpolate(frame, [130, 160], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: sceneOpacity }}>
      <Background accent="orange" intensity={0.7} />

      {/* Floating missed calls */}
      <MissedCall delay={35} x={5} y={15} angle={-6} />
      <MissedCall delay={50} x={60} y={8} angle={4} />
      <MissedCall delay={65} x={78} y={25} angle={-3} />
      <MissedCall delay={45} x={3} y={65} angle={5} />
      <MissedCall delay={75} x={68} y={72} angle={-4} />
      <MissedCall delay={55} x={82} y={58} angle={3} />
      <MissedCall delay={80} x={20} y={78} angle={-5} />

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 200px",
        }}
      >
        <WordReveal
          text="Cada llamada perdida"
          delay={5}
          fontSize={72}
          fontWeight={900}
          color={C.white}
          letterSpacing="-0.03em"
          stagger={4}
        />
        <WordReveal
          text="es un cliente que va a la competencia."
          delay={30}
          fontSize={72}
          fontWeight={900}
          gradient
          gradientColors={[C.white, C.orange]}
          letterSpacing="-0.03em"
          stagger={4}
        />

        {/* Counter */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [45, 65], [20, 0], { extrapolateRight: "clamp" })}px)`,
          }}
        >
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 16,
              padding: "12px 28px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 13, color: "#FCA5A5", fontWeight: 500 }}>Solo hoy perdiste</span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#F87171",
                letterSpacing: "-2px",
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 0 40px rgba(239,68,68,0.5)",
              }}
            >
              {lostClients}
            </span>
            <span style={{ fontSize: 13, color: "#FCA5A5", fontWeight: 500 }}>clientes</span>
          </div>
        </div>

        {/* Solution */}
        <div
          style={{
            marginTop: 32,
            opacity: solutionOpacity,
            transform: `translateY(${solutionY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ height: 1, width: 60, background: `linear-gradient(90deg, transparent, ${C.orange})` }} />
          <span
            style={{
              fontSize: 22,
              color: C.orange,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            TusCortes los captura las 24 horas.
          </span>
          <div style={{ height: 1, width: 60, background: `linear-gradient(90deg, ${C.orange}, transparent)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
