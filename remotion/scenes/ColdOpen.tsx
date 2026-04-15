import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../constants";

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0-20: flash blanca
  const flashOpacity = interpolate(frame, [0, 4, 12, 20], [0, 1, 0.3, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // 20-55: logo entra suave
  const logoOpacity = interpolate(frame, [20, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoScale  = interpolate(frame, [20, 55], [0.75, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 60-85: tagline entra
  const tagOpacity = interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY       = interpolate(frame, [60, 85], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glow ring (decorativo, entra con el logo)
  const ringProgress = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 20, stiffness: 100 } });
  const ringScale = interpolate(ringProgress, [0, 1], [0.2, 2.5]);
  const ringOpacity = interpolate(ringProgress, [0, 0.15, 0.7, 1], [0, 0.5, 0.25, 0]);

  // 125-150: fade out
  const exitOpacity = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
        <img
          src={staticFile("1.png")}
          alt="TusCortes"
          style={{
            height: 130,
            width: "auto",
            objectFit: "contain",
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            filter: `brightness(0) invert(1) drop-shadow(0 0 50px rgba(37,99,235,0.5))`,
          }}
        />

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
