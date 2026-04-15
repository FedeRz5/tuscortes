import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../constants";

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash from black
  const flashOpacity = interpolate(frame, [0, 4, 12, 20], [0, 1, 0.3, 0], {
    extrapolateRight: "clamp",
  });

  // Logo spring in
  const logoProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 10, stiffness: 260, mass: 0.7 },
  });
  const logoScale = interpolate(logoProgress, [0, 1], [0, 1]);
  const logoOpacity = interpolate(logoProgress, [0, 0.3], [0, 1]);

  // Glow ring expanding
  const ringProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 20, stiffness: 150 },
  });
  const ringScale = interpolate(ringProgress, [0, 1], [0.2, 2.2]);
  const ringOpacity = interpolate(ringProgress, [0, 0.2, 0.7, 1], [0, 0.6, 0.3, 0]);

  // Tagline
  const tagProgress = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const tagOpacity = interpolate(tagProgress, [0, 0.4], [0, 1]);
  const tagY = interpolate(tagProgress, [0, 1], [16, 0]);

  // Exit
  const exitOpacity = interpolate(frame, [50, 65], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Flash */}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flashOpacity }} />

      {/* Glow ring */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: `1px solid ${C.orange}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
          boxShadow: `0 0 60px ${C.orangeGlow}, inset 0 0 40px ${C.orangeGlow}`,
        }}
      />

      {/* Second ring */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: `1px solid ${C.primary}`,
          transform: `scale(${interpolate(ringScale, [0.2, 2.2], [0.5, 3])})`,
          opacity: ringOpacity * 0.4,
        }}
      />

      {/* Logo */}
      <div style={{ opacity: exitOpacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: C.white,
            letterSpacing: "-5px",
            lineHeight: 1,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            textShadow: `0 0 80px rgba(249,115,22,0.4), 0 0 160px rgba(249,115,22,0.15)`,
          }}
        >
          Tus<span style={{ color: "#EF4444" }}>Cortes</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 20,
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ height: 1, width: 40, background: `linear-gradient(90deg, transparent, ${C.dim})` }} />
          <span style={{ fontSize: 14, color: C.dim, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>
            Gestión de turnos para barberías
          </span>
          <div style={{ height: 1, width: 40, background: `linear-gradient(90deg, ${C.dim}, transparent)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
