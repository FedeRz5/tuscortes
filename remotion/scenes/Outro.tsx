import React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../constants";
import { Background } from "../components/Background";
import { WordReveal, LineReveal } from "../components/TextReveal";

const plans = [
  { name: "Starter", price: "12.500", color: C.blue, desc: "1 barbero · Turnos ilimitados" },
  { name: "Pro", price: "20.999", color: C.orange, desc: "3 barberos · Ingresos · WhatsApp", featured: true },
  { name: "Premium", price: "32.900", color: C.purple, desc: "Barberos ilimitados · Todo incluido" },
];

const features = [
  { icon: "📱", label: "Reservas 24/7" },
  { icon: "💬", label: "WhatsApp + Email" },
  { icon: "🗓️", label: "Calendario" },
  { icon: "💰", label: "Control de caja" },
  { icon: "👥", label: "Multi-barbero" },
  { icon: "🔗", label: "Link y QR" },
  { icon: "🚫", label: "Cero llamadas" },
  { icon: "⚡", label: "Configurás en 5 min" },
];

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Total 360 frames = 12s
  const sceneOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // CTA pulse
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 1.8) * 0.022;

  // Plans
  const plansOpacity = interpolate(frame, [80, 105], [0, 1], { extrapolateRight: "clamp" });
  const plansY = interpolate(frame, [80, 105], [24, 0], { extrapolateRight: "clamp" });

  // Features
  const featOpacity = interpolate(frame, [120, 145], [0, 1], { extrapolateRight: "clamp" });

  // Final logo watermark
  const logoOpacity = interpolate(frame, [280, 310], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: sceneOpacity }}>
      <Background accent="indigo" intensity={1} />

      {/* Top decorative line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "10%",
        right: "10%",
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.primary}60, ${C.orange}60, transparent)`,
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
      }} />

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 60px",
        gap: 0,
      }}>
        {/* Headline */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <LineReveal delay={5}>
            <div style={{ fontSize: 13, color: C.orange, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
              Empezá hoy
            </div>
          </LineReveal>

          <div style={{ marginBottom: 10 }}>
            <WordReveal
              text="Tu barbería, profesional"
              delay={10}
              fontSize={64}
              fontWeight={900}
              color={C.white}
              letterSpacing="-0.035em"
              stagger={4}
              centered
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WordReveal
              text="desde el primer día."
              delay={35}
              fontSize={64}
              fontWeight={900}
              gradient
              gradientColors={[C.primaryLight, C.orange]}
              letterSpacing="-0.035em"
              stagger={4}
              centered
            />
          </div>

          <LineReveal delay={60}>
            <div style={{ fontSize: 18, color: C.muted, marginTop: 16, fontWeight: 400 }}>
              Sin contrato. Sin instalaciones. Cancelás cuando querés.
            </div>
          </LineReveal>
        </div>

        {/* Plans */}
        <div style={{
          display: "flex",
          gap: 16,
          marginBottom: 32,
          opacity: plansOpacity,
          transform: `translateY(${plansY}px)`,
        }}>
          {plans.map((p) => (
            <div key={p.name} style={{
              background: p.featured ? `linear-gradient(135deg, ${C.primary}22, ${C.orange}18)` : C.surface,
              border: `1px solid ${p.featured ? C.orange : C.border}`,
              borderRadius: 20,
              padding: "28px 28px",
              textAlign: "center",
              flex: 1,
              position: "relative",
              boxShadow: p.featured ? `0 0 0 1px ${C.orange}30, 0 12px 40px rgba(37,99,235,0.2)` : "none",
            }}>
              {p.featured && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${C.orange}, ${C.primary})`,
                  color: "#FFF",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "4px 16px",
                  borderRadius: 20,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  Más popular
                </div>
              )}
              <div style={{ fontSize: 16, fontWeight: 700, color: p.color, marginBottom: 10 }}>{p.name}</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: C.white, letterSpacing: "-1px", marginBottom: 8 }}>
                ${p.price}<span style={{ fontSize: 15, fontWeight: 500, color: C.muted }}>/mes</span>
              </div>
              <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          width: "100%",
          marginBottom: 36,
          opacity: featOpacity,
        }}>
          {features.map((f) => (
            <div key={f.label} style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: "9px 18px",
              fontSize: 15,
              color: C.muted,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}>
              {f.icon} {f.label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          width: "100%",
          opacity: interpolate(frame, [145, 165], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [145, 165], [16, 0], { extrapolateRight: "clamp" })}px)`,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.primary} 0%, ${C.orange} 100%)`,
            borderRadius: 18,
            padding: "22px 0",
            width: "100%",
            textAlign: "center",
            fontSize: 26,
            fontWeight: 900,
            color: C.white,
            transform: `scale(${pulse})`,
            boxShadow: `0 12px 50px rgba(37,99,235,0.5), 0 2px 0 rgba(255,255,255,0.15) inset`,
            letterSpacing: "-0.3px",
          }}>
            Comenzar ahora →
          </div>
          <div style={{ fontSize: 15, color: C.dim }}>tuscortes.com</div>
        </div>
      </div>

      {/* Logo watermark */}
      <div style={{
        position: "absolute",
        bottom: 28,
        right: 48,
        opacity: logoOpacity * 0.35,
        textAlign: "right",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
      }}>
        <img
          src={staticFile("1.png")}
          alt="TusCortes"
          style={{
            height: 36,
            width: "auto",
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
          }}
        />
        <div style={{ fontSize: 10, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          tuscortes.com
        </div>
      </div>

      {/* Bottom line */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "10%",
        right: "10%",
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.orange}60, ${C.primary}60, transparent)`,
        opacity: logoOpacity,
      }} />
    </AbsoluteFill>
  );
};
