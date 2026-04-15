import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../constants";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({ frame, fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 50 });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const logoScale = interpolate(logoProgress, [0, 1], [0.6, 1]);

  const lineW = interpolate(frame, [30, 65], [0, 120], { extrapolateRight: "clamp" });

  const tagOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [50, 70], [20, 0], { extrapolateRight: "clamp" });

  const glowScale = interpolate(frame, [0, 90], [0.5, 1.3]);
  const glowOpacity = interpolate(frame, [0, 40, 90], [0, 0.5, 0.2]);

  const exitOpacity = interpolate(frame, [75, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.primaryGlow} 0%, transparent 65%)`,
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          left: "50%",
          top: "50%",
          opacity: glowOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
          opacity: glowOpacity * 0.6,
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: C.white,
            letterSpacing: "-4px",
            lineHeight: 1,
            textShadow: `0 0 60px ${C.primaryGlow}`,
          }}
        >
          Tus<span style={{ color: "#EF4444" }}>Cortes</span>
        </div>

        {/* Animated underline */}
        <div
          style={{
            height: 4,
            width: lineW,
            background: `linear-gradient(90deg, ${C.primary}, ${C.orange})`,
            borderRadius: 2,
            marginTop: 14,
            boxShadow: `0 0 20px ${C.orangeGlow}`,
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: "58%",
          left: "50%",
          transform: `translateX(-50%) translateY(${tagY}px)`,
          opacity: tagOpacity,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <p
          style={{
            color: C.muted,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Gestión de turnos para barberías
        </p>
      </div>
    </AbsoluteFill>
  );
};
