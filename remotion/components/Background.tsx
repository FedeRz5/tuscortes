import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../constants";

interface Props {
  accent?: "indigo" | "orange" | "green" | "neutral";
  intensity?: number;
}

export const Background: React.FC<Props> = ({ accent = "indigo", intensity = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame * 0.004;

  const orb1x = 25 + Math.sin(t * 1.1) * 18;
  const orb1y = 30 + Math.cos(t * 0.85) * 14;
  const orb2x = 75 + Math.cos(t * 0.75) * 14;
  const orb2y = 65 + Math.sin(t * 1.2) * 18;
  const orb3x = 52 + Math.sin(t * 0.65) * 22;
  const orb3y = 18 + Math.cos(t * 1.05) * 9;

  const palettes: Record<string, [string, string, string]> = {
    indigo: [
      "rgba(37,99,235,0.22)",
      "rgba(79,70,229,0.14)",
      "rgba(129,140,248,0.09)",
    ],
    orange: [
      "rgba(129,140,248,0.2)",
      "rgba(37,99,235,0.13)",
      "rgba(79,70,229,0.09)",
    ],
    green: [
      "rgba(16,185,129,0.18)",
      "rgba(37,99,235,0.11)",
      "rgba(129,140,248,0.07)",
    ],
    neutral: [
      "rgba(37,99,235,0.13)",
      "rgba(79,70,229,0.09)",
      "rgba(129,140,248,0.06)",
    ],
  };

  const [c1, c2, c3] = palettes[accent];

  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, overflow: "hidden" }}>
      {/* Animated gradient orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 800px 650px at ${orb1x}% ${orb1y}%, ${c1} 0%, transparent 65%),
            radial-gradient(ellipse 600px 500px at ${orb2x}% ${orb2y}%, ${c2} 0%, transparent 60%),
            radial-gradient(ellipse 450px 380px at ${orb3x}% ${orb3y}%, ${c3} 0%, transparent 55%)
          `,
          opacity: intensity,
        }}
      />

      {/* Subtle dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />

      {/* Film grain via SVG */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.035,
          pointerEvents: "none",
        }}
      >
        <filter id={`grain-${accent}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${accent})`} />
      </svg>
    </div>
  );
};
