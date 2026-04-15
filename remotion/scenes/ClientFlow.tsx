import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { C } from "../constants";
import { BrowserWindow } from "../components/BrowserWindow";
import { Background } from "../components/Background";
import { WordReveal, LineReveal } from "../components/TextReveal";

// ─── Service selector ─────────────────────────────────────────────────────────

const services = [
  { name: "Corte clásico", dur: "30 min", price: "$3.500", icon: "✂️" },
  { name: "Corte + Barba", dur: "45 min", price: "$5.000", icon: "🪒" },
  { name: "Degradé", dur: "40 min", price: "$4.500", icon: "💈" },
  { name: "Barba", dur: "20 min", price: "$2.000", icon: "🧔" },
];

const BookingPage: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ background: "#F9FAFB", height: "100%", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#FFF", borderBottom: "1px solid #E5E7EB", padding: "14px 28px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💈</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Ramos Cutz</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>Av. Corrientes 3420 · Buenos Aires</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#F0FDF4", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "1px solid #BBF7D0" }}>● Abierto</div>
      </div>
      {/* Steps */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 28px", gap: 6, background: "#FFF", borderBottom: "1px solid #F3F4F6" }}>
        {["Servicio", "Barbero", "Fecha y hora", "Confirmar"].map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: i === 0 ? "#4F46E5" : "#E5E7EB", color: i === 0 ? "#FFF" : "#9CA3AF", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <span style={{ fontSize: 11, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#4F46E5" : "#9CA3AF" }}>{s}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 1, background: "#E5E7EB", maxWidth: 32 }} />}
          </React.Fragment>
        ))}
      </div>
      {/* Services */}
      <div style={{ padding: "20px 28px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Elegí tu servicio</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {services.map((s, i) => (
            <div key={s.name} style={{
              background: i === 0 ? "#EEF2FF" : "#FFF",
              border: `2px solid ${i === 0 ? "#4F46E5" : "#E5E7EB"}`,
              borderRadius: 11, padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: i === 0 ? "0 0 0 3px rgba(79,70,229,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
              opacity: interpolate(frame, [i * 7, i * 7 + 15], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [i * 7, i * 7 + 15], [12, 0], { extrapolateRight: "clamp" })}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.dur}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? "#4F46E5" : "#374151" }}>{s.price}</div>
            </div>
          ))}
        </div>
        <button style={{ marginTop: 20, width: "100%", background: "linear-gradient(135deg,#4F46E5,#6366F1)", color: "#FFF", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(79,70,229,0.35)", opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" }) }}>
          Continuar →
        </button>
      </div>
    </div>
  );
};

// ─── Date/Time picker ─────────────────────────────────────────────────────────

const timeSlots = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30"];

const DateTimePage: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ background: "#F9FAFB", height: "100%", fontFamily: "Inter, system-ui, sans-serif", padding: "18px 24px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" }) }}>
        <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#F97316,#FB923C)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 18, fontWeight: 800 }}>R</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Rodrigo M.</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>Corte clásico · 30 min · $3.500</div>
        </div>
      </div>
      {/* Calendar */}
      <div style={{ background: "#FFF", borderRadius: 12, padding: 14, border: "1px solid #E5E7EB", marginBottom: 14, opacity: interpolate(frame, [8, 24], [0, 1], { extrapolateRight: "clamp" }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Abril 2026</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 16, color: "#9CA3AF" }}>‹</span>
            <span style={{ fontSize: 16, color: "#111827" }}>›</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
          {["L","M","X","J","V","S","D"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "#9CA3AF", padding: "3px 0" }}>{d}</div>)}
          {[...Array(3)].map((_,i) => <div key={`e${i}`} />)}
          {[...Array(28)].map((_,i) => {
            const day = i + 1;
            const sel = day === 14;
            const past = day < 12;
            return (
              <div key={day} style={{ textAlign: "center", fontSize: 12, padding: "5px 2px", borderRadius: 5, background: sel ? "#4F46E5" : "transparent", color: sel ? "#FFF" : past ? "#D1D5DB" : "#374151", fontWeight: sel ? 700 : 400 }}>{day}</div>
            );
          })}
        </div>
      </div>
      {/* Slots */}
      <div style={{ opacity: interpolate(frame, [20, 38], [0, 1], { extrapolateRight: "clamp" }) }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Horarios · Lunes 14</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
          {timeSlots.map((t, i) => {
            const sel = t === "10:00";
            const taken = t === "09:30" || t === "11:30";
            return (
              <div key={t} style={{
                background: sel ? "#4F46E5" : taken ? "#F9FAFB" : "#FFF",
                border: `1px solid ${sel ? "#4F46E5" : taken ? "#F3F4F6" : "#E5E7EB"}`,
                borderRadius: 7, padding: "7px 2px", textAlign: "center",
                fontSize: 12, fontWeight: sel ? 700 : 500,
                color: sel ? "#FFF" : taken ? "#D1D5DB" : "#374151",
                boxShadow: sel ? "0 2px 8px rgba(79,70,229,0.3)" : "none",
                opacity: interpolate(frame, [26 + i * 3, 38 + i * 3], [0, 1], { extrapolateRight: "clamp" }),
              }}>{t}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Confirmation ─────────────────────────────────────────────────────────────

const ConfirmationPage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const checkP = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 9, stiffness: 320 } });
  return (
    <div style={{ background: "#F9FAFB", height: "100%", fontFamily: "Inter, system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 28px", gap: 18 }}>
      <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#10B981,#059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, transform: `scale(${interpolate(checkP, [0, 1], [0, 1])})`, opacity: interpolate(checkP, [0, 0.3], [0, 1]), boxShadow: "0 8px 24px rgba(16,185,129,0.45)" }}>✓</div>
      <div style={{ textAlign: "center", opacity: interpolate(frame, [18, 35], [0, 1], { extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [18, 35], [16, 0], { extrapolateRight: "clamp" })}px)` }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>¡Turno confirmado!</div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>Te enviamos los detalles por WhatsApp y email</div>
      </div>
      <div style={{ background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 24px", width: "100%", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", opacity: interpolate(frame, [30, 48], [0, 1], { extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [30, 48], [16, 0], { extrapolateRight: "clamp" })}px)` }}>
        {[["Servicio","Corte clásico"],["Barbero","Rodrigo M."],["Fecha","Lunes 14 de Abril, 2026"],["Hora","10:00 – 10:30"],["Precio","$3.500"]].map(([k,v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F4F6", fontSize: 12 }}>
            <span style={{ color: "#9CA3AF" }}>{k}</span>
            <span style={{ color: "#111827", fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, opacity: interpolate(frame, [55, 72], [0, 1], { extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [55, 72], [8, 0], { extrapolateRight: "clamp" })}px)` }}>
        {[{icon:"💬",l:"WhatsApp enviado",c:"#16A34A",bg:"#F0FDF4"},{icon:"📧",l:"Email enviado",c:"#1D4ED8",bg:"#EFF6FF"}].map(({icon,l,c,bg})=>(
          <div key={l} style={{ background: bg, borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: c }}>{icon} {l}</div>
        ))}
      </div>
    </div>
  );
};

// ─── Label chip ───────────────────────────────────────────────────────────────

const ChipLabel: React.FC<{ text: string; color: string; bg: string; border: string }> = ({ text, color, bg, border }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      display: "inline-block", background: bg, border: `1px solid ${border}`,
      borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700,
      color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14,
      opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" }),
      transform: `translateY(${interpolate(frame, [0, 16], [10, 0], { extrapolateRight: "clamp" })}px)`,
    }}>
      {text}
    </div>
  );
};

// ─── Main ClientFlow ──────────────────────────────────────────────────────────

export const ClientFlowScene: React.FC = () => {
  // 480 frames = 16s  (180 + 150 + 150)
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 18, 462, 480], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const phase = frame < 180 ? 0 : frame < 330 ? 1 : 2;

  // Floating browser
  const floatY = Math.sin((frame / fps) * Math.PI * 0.45) * 7;

  const browserProgress = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 20, stiffness: 120 } });
  const browserX = interpolate(browserProgress, [0, 1], [160, 0]);
  const browserOpacity = interpolate(browserProgress, [0, 0.5], [0, 1]);

  const textPhase = phase === 0 ? frame : phase === 1 ? frame - 180 : frame - 330;

  const copy = [
    { chip: "Vista del cliente", headline: "Reservar un turno,\nen segundos.", body: "Página personalizada para tu barbería. El cliente elige servicio, barbero y horario sin llamarte.", checks: ["Sin registrarse", "Sin app que descargar", "Funciona desde cualquier celular"] },
    { chip: "Fecha y hora", headline: "Solo horarios\ndisponibles.", body: "El sistema bloquea automáticamente lo ya reservado. Cero solapamientos, cero llamadas de aclaración.", checks: ["Bloqueo en tiempo real", "Buffers entre turnos", "Control de máximo turnos por día"] },
    { chip: "Confirmación", headline: "Confirmación\nautomática.", body: "El cliente recibe WhatsApp + email al instante. Incluye enlace para cancelar sin tener que llamar.", checks: ["WhatsApp y Email", "Link de cancelación", "Recordatorio automático"] },
  ][phase];

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: sceneOpacity }}>
      <Background accent="indigo" intensity={0.8} />

      {/* Left panel */}
      <div style={{ position: "absolute", left: 80, top: "50%", transform: "translateY(-50%)", width: 400, zIndex: 10 }}>
        <ChipLabel text={copy.chip} color={C.orange} bg={C.orangeGlow} border={`${C.orange}40`} />

        <div style={{ marginBottom: 16 }}>
          {copy.headline.split("\n").map((line, i) => (
            <WordReveal key={line} text={line} delay={i * 12} fontSize={54} fontWeight={900} color={C.white} letterSpacing="-0.03em" stagger={5} />
          ))}
        </div>

        <LineReveal delay={30}>
          <div style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>{copy.body}</div>
        </LineReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {copy.checks.map((c, i) => (
            <div key={c} style={{
              display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.muted,
              opacity: interpolate(textPhase, [40 + i * 10, 55 + i * 10], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateX(${interpolate(textPhase, [40 + i * 10, 55 + i * 10], [-16, 0], { extrapolateRight: "clamp" })}px)`,
            }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.successBg, border: `1px solid ${C.success}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: C.success, fontSize: 11 }}>✓</span>
              </div>
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* 3D Browser */}
      <div style={{
        position: "absolute",
        right: 60,
        top: "50%",
        transform: `translateY(-50%) translateX(${browserX}px) translateY(${floatY}px)`,
        opacity: browserOpacity,
        perspective: "1500px",
      }}>
        <div style={{
          transform: "perspective(1500px) rotateY(-10deg) rotateX(2deg)",
          transformOrigin: "center center",
        }}>
          <BrowserWindow
            url={phase === 0 ? "tuscortes.com/b/ramos-cutz" : phase === 1 ? "tuscortes.com/b/ramos-cutz/fecha" : "tuscortes.com/b/ramos-cutz/confirmacion"}
            width={780}
            height={560}
          >
            <Sequence from={0} durationInFrames={180}><BookingPage /></Sequence>
            <Sequence from={180} durationInFrames={150}><DateTimePage /></Sequence>
            <Sequence from={330} durationInFrames={150}><ConfirmationPage /></Sequence>
          </BrowserWindow>
        </div>

        {/* Shadow below */}
        <div style={{
          position: "absolute",
          bottom: -30,
          left: "5%",
          width: "90%",
          height: 40,
          background: "rgba(0,0,0,0.4)",
          borderRadius: "50%",
          filter: "blur(20px)",
          transform: "perspective(1500px) rotateX(80deg)",
        }} />
      </div>
    </AbsoluteFill>
  );
};
