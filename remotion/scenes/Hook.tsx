import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../constants";

const AnimLine: React.FC<{
  text: string;
  delay: number;
  size?: number;
  color?: string;
  weight?: number;
  highlight?: boolean;
}> = ({ text, delay, size = 88, color = C.white, weight = 800, highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 200 },
    durationInFrames: 35,
  });

  const y = interpolate(progress, [0, 1], [50, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1]);

  return (
    <div
      style={{
        fontSize: size,
        fontWeight: weight,
        color: highlight ? C.orange : color,
        lineHeight: 1.05,
        transform: `translateY(${y}px)`,
        opacity,
        textShadow: highlight ? `0 0 40px ${C.orangeGlow}` : undefined,
      }}
    >
      {text}
    </div>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 15, 135, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 160,
        overflow: "hidden",
        opacity: sceneOpacity,
      }}
    >
      {/* Vertical accent line */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "15%",
          bottom: "15%",
          width: 3,
          background: `linear-gradient(180deg, transparent 0%, ${C.orange} 40%, ${C.primary} 70%, transparent 100%)`,
          opacity: lineOpacity,
          borderRadius: 2,
        }}
      />

      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          right: -80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.primaryGlow} 0%, transparent 60%)`,
          opacity: 0.4,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            color: C.orange,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 24,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Para barberías modernas
        </div>

        <AnimLine text="Sin llamadas." delay={5} />
        <AnimLine text="Sin anotadores." delay={18} />
        <AnimLine text="Sin perder clientes." delay={31} highlight />

        <div style={{ marginTop: 36 }}>
          <AnimLine
            text="Recibí turnos online, 24/7."
            delay={65}
            size={36}
            color={C.muted}
            weight={400}
          />
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            opacity: interpolate(frame, [90, 110], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [90, 110], [20, 0], { extrapolateRight: "clamp" })}px)`,
          }}
        >
          {["WhatsApp", "Email", "Calendario", "Panel de control"].map((f) => (
            <div
              key={f}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 13,
                color: C.muted,
                fontWeight: 500,
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
