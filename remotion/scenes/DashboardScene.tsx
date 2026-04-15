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
import { FadeSlide } from "../components/FadeSlide";
import { Background } from "../components/Background";
import { WordReveal, LineReveal } from "../components/TextReveal";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{ active: string }> = ({ active }) => {
  const items = [
    { icon: "🏠", label: "Panel", id: "panel" },
    { icon: "📅", label: "Turnos", id: "turnos" },
    { icon: "🗓️", label: "Calendario", id: "calendario" },
    { icon: "💰", label: "Ingresos", id: "ingresos" },
    { icon: "👥", label: "Barberos", id: "barberos" },
    { icon: "✂️", label: "Servicios", id: "servicios" },
    { icon: "⚙️", label: "Horarios", id: "horarios" },
    { icon: "🏪", label: "Mi local", id: "local" },
  ];

  return (
    <div
      style={{
        width: 200,
        height: "100%",
        background: "#111827",
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "0 16px 16px",
          borderBottom: "1px solid #1F2937",
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, color: "#FFF", letterSpacing: "-0.5px" }}>
          Tus<span style={{ color: "#EF4444" }}>Cortes</span>
        </div>
        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Ramos Cutz</div>
      </div>
      {items.map(({ icon, label, id }) => (
        <div
          key={id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 16px",
            background: active === id ? "rgba(79,70,229,0.15)" : "transparent",
            borderRight: active === id ? "3px solid #4F46E5" : "3px solid transparent",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: active === id ? 600 : 400,
              color: active === id ? "#E0E7FF" : "#9CA3AF",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Dashboard main ───────────────────────────────────────────────────────────

const stats = [
  { label: "Turnos hoy", value: 12, icon: "📅", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  { label: "Este mes", value: 148, icon: "📊", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  { label: "Pendientes", value: 3, icon: "⏳", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { label: "Barberos activos", value: 3, icon: "✂️", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
];

const todayAppts = [
  { time: "09:00", end: "09:30", client: "Juan García", service: "Corte clásico", barber: "Rodrigo M.", status: "CONFIRMED" },
  { time: "10:00", end: "10:45", client: "Pablo Rodríguez", service: "Corte + Barba", barber: "Lucas P.", status: "CONFIRMED" },
  { time: "11:30", end: "12:10", client: "Matías López", service: "Degradé", barber: "Rodrigo M.", status: "CONFIRMED" },
  { time: "14:00", end: "14:20", client: "Diego Fernández", service: "Barba", barber: "Lucas P.", status: "COMPLETED" },
  { time: "15:00", end: "15:30", client: "Franco Méndez", service: "Corte clásico", barber: "Matías G.", status: "CONFIRMED" },
];

const StatCard: React.FC<{ stat: (typeof stats)[0]; delay: number }> = ({ stat, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 18, stiffness: 200 } });
  const opacity = interpolate(progress, [0, 0.4], [0, 1]);
  const y = interpolate(progress, [0, 1], [20, 0]);
  // Count up animation
  const displayValue = Math.round(interpolate(progress, [0, 1], [0, stat.value]));

  return (
    <div
      style={{
        background: "#FFF",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "16px",
        flex: 1,
        opacity,
        transform: `translateY(${y}px)`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{stat.label}</span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: stat.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          {stat.icon}
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{displayValue}</div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    CONFIRMED: { label: "Confirmado", color: "#1D4ED8", bg: "#EFF6FF" },
    COMPLETED: { label: "Completado", color: "#15803D", bg: "#F0FDF4" },
    CANCELLED: { label: "Cancelado", color: "#DC2626", bg: "#FEF2F2" },
    PENDING: { label: "Pendiente", color: "#D97706", bg: "#FFFBEB" },
  };
  const s = map[status] ?? map.PENDING;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 12,
      }}
    >
      {s.label}
    </span>
  );
};

const DashboardMain: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar active="panel" />
      <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Panel principal</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Lunes, 14 de Abril 2026</div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} delay={i * 8} />
          ))}
        </div>

        {/* Today's appointments */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            overflow: "hidden",
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [40, 60], [20, 0], { extrapolateRight: "clamp" })}px)`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #F3F4F6",
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Turnos de hoy
          </div>
          {todayAppts.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderBottom: i < todayAppts.length - 1 ? "1px solid #F9FAFB" : "none",
                gap: 12,
                opacity: interpolate(frame, [50 + i * 10, 65 + i * 10], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateX(${interpolate(frame, [50 + i * 10, 65 + i * 10], [-10, 0], { extrapolateRight: "clamp" })}px)`,
              }}
            >
              <div style={{ width: 52, textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{a.time}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{a.end}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{a.client}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                  {a.service} · {a.barber}
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Appointments page ────────────────────────────────────────────────────────

const allAppts = [
  ...todayAppts,
  { time: "09:00", end: "09:30", client: "Sebastián Torres", service: "Corte clásico", barber: "Matías G.", status: "CONFIRMED" },
  { time: "10:30", end: "11:15", client: "Nicolás Vera", service: "Corte + Barba", barber: "Rodrigo M.", status: "PENDING" },
  { time: "15:30", end: "15:50", client: "Hernán Castro", service: "Barba", barber: "Lucas P.", status: "CANCELLED" },
];

const AppointmentsMain: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar active="turnos" />
      <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Gestión de turnos</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Todos", "Hoy", "Esta semana"].map((f, i) => (
              <div
                key={f}
                style={{
                  padding: "5px 12px",
                  background: i === 0 ? "#111827" : "#FFF",
                  color: i === 0 ? "#FFF" : "#6B7280",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid #E5E7EB",
                  cursor: "pointer",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {[
            { label: "Confirmados", count: 5, color: "#1D4ED8", bg: "#EFF6FF" },
            { label: "Completados", count: 1, color: "#15803D", bg: "#F0FDF4" },
            { label: "Cancelados", count: 1, color: "#DC2626", bg: "#FEF2F2" },
            { label: "Pendientes", count: 1, color: "#D97706", bg: "#FFFBEB" },
          ].map(({ label, count, color, bg }) => (
            <div
              key={label}
              style={{
                background: bg,
                borderRadius: 8,
                padding: "8px 14px",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800, color }}>{count}</span>
              <span style={{ fontSize: 12, color, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          style={{
            background: "#FFF",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 1fr 100px 100px",
              padding: "10px 16px",
              background: "#F9FAFB",
              borderBottom: "1px solid #E5E7EB",
              fontSize: 11,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {["Hora", "Cliente", "Servicio · Barbero", "Estado", "Acciones"].map((h) => (
              <div key={h}>{h}</div>
            ))}
          </div>
          {allAppts.slice(0, 7).map((a, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr 100px 100px",
                padding: "10px 16px",
                borderBottom: "1px solid #F9FAFB",
                alignItems: "center",
                opacity: interpolate(frame, [10 + i * 8, 25 + i * 8], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(frame, [10 + i * 8, 25 + i * 8], [8, 0], { extrapolateRight: "clamp" })}px)`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{a.time}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{a.client}</div>
              <div>
                <div style={{ fontSize: 12, color: "#374151" }}>{a.service}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{a.barber}</div>
              </div>
              <StatusBadge status={a.status} />
              <div style={{ display: "flex", gap: 4 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}>✓</div>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}>✕</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard transition screen ──────────────────────────────────────────────

export const DashboardTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const progress = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, stiffness: 160 } });
  const scale = interpolate(progress, [0, 1], [0.85, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          textAlign: "center",
          transform: `scale(${scale}) translateY(${y}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.primaryGlow,
            border: `1px solid ${C.primary}40`,
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 12,
            fontWeight: 700,
            color: C.primaryLight,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Panel del barbero
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, color: C.white, letterSpacing: "-2px", lineHeight: 1 }}>
          Todo bajo control.
        </div>
        <div style={{ fontSize: 20, color: C.muted, marginTop: 12, fontWeight: 400 }}>
          Tu negocio en un solo lugar
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.primaryGlow} 0%, transparent 65%)`,
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Main DashboardScene ──────────────────────────────────────────────────────

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 18, 192, 210], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const browserProgress = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 20, stiffness: 120 } });
  const browserY = interpolate(browserProgress, [0, 1], [60, 0]);
  const browserOpacity = interpolate(browserProgress, [0, 0.5], [0, 1]);
  const floatY = Math.sin((frame / fps) * Math.PI * 0.4) * 6;

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: sceneOpacity }}>
      <Background accent="indigo" intensity={0.85} />

      <div style={{ position: "absolute", left: 80, top: "50%", transform: "translateY(-50%)", width: 380, zIndex: 10 }}>
        <LineReveal delay={10}>
          <div style={{ display: "inline-block", background: C.primaryGlow, border: `1px solid ${C.primary}40`, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: C.primaryLight, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
            Panel del barbero
          </div>
        </LineReveal>
        <WordReveal text="Tu negocio," delay={8} fontSize={52} fontWeight={900} color={C.white} letterSpacing="-0.01em" stagger={4} />
        <WordReveal text="de un vistazo." delay={20} fontSize={52} fontWeight={900} gradient gradientColors={[C.white, C.primaryLight]} letterSpacing="-0.01em" stagger={4} />
        <LineReveal delay={36}>
          <div style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginTop: 14, marginBottom: 22 }}>
            Métricas en tiempo real, turnos del día y todo lo que necesitás al abrir la app.
          </div>
        </LineReveal>
        {["Contadores animados al instante", "Turnos de hoy en orden", "Acceso a toda la gestión"].map((t, i) => (
          <div key={t} style={{
            display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.muted, marginBottom: 10,
            opacity: interpolate(frame, [45 + i * 10, 60 + i * 10], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(frame, [45 + i * 10, 60 + i * 10], [-14, 0], { extrapolateRight: "clamp" })}px)`,
          }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.primaryGlow, border: `1px solid ${C.primary}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: C.primaryLight, fontSize: 10 }}>✓</span>
            </div>
            {t}
          </div>
        ))}
      </div>

      <div style={{
        position: "absolute", right: -20, top: "50%",
        transform: `translateY(-50%) translateY(${browserY + floatY}px)`,
        opacity: browserOpacity,
      }}>
        <div style={{ transform: "perspective(1500px) rotateY(-8deg) rotateX(1.5deg)", transformOrigin: "center center" }}>
          <BrowserWindow url="tuscortes.com/dashboard" width={1050} height={600} scale={0.92}>
            <DashboardMain />
          </BrowserWindow>
        </div>
        <div style={{ position: "absolute", bottom: -28, left: "5%", width: "90%", height: 36, background: "rgba(0,0,0,0.35)", borderRadius: "50%", filter: "blur(18px)", transform: "perspective(1500px) rotateX(80deg)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── AppointmentsScene ────────────────────────────────────────────────────────

export const AppointmentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 18, 162, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const browserProgress = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 20, stiffness: 120 } });
  const browserX = interpolate(browserProgress, [0, 1], [-80, 0]);
  const browserOpacity = interpolate(browserProgress, [0, 0.5], [0, 1]);
  const floatY = Math.sin((frame / fps) * Math.PI * 0.42) * 6;

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: sceneOpacity }}>
      <Background accent="orange" intensity={0.65} />

      <div style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", width: 360, zIndex: 10, textAlign: "right" }}>
        <LineReveal delay={10}>
          <div style={{ display: "inline-flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <div style={{ background: C.orangeGlow, border: `1px solid ${C.orange}40`, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: C.orange, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Gestión de turnos
            </div>
          </div>
        </LineReveal>
        <WordReveal text="Controlá" delay={8} fontSize={52} fontWeight={900} color={C.white} letterSpacing="-0.01em" stagger={4} />
        <WordReveal text="cada turno." delay={16} fontSize={52} fontWeight={900} gradient gradientColors={[C.white, C.orange]} letterSpacing="-0.01em" stagger={4} />
        <LineReveal delay={32}>
          <div style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginTop: 14, marginBottom: 22, textAlign: "right" }}>
            Confirmá, completá o cancelá con un clic. Filtros por fecha, barbero y estado.
          </div>
        </LineReveal>
        {["Filtros por barbero o servicio", "Confirmar / cancelar en un clic", "Historial completo"].map((t, i) => (
          <div key={t} style={{
            display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, fontSize: 14, color: C.muted, marginBottom: 10,
            opacity: interpolate(frame, [44 + i * 10, 58 + i * 10], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(frame, [44 + i * 10, 58 + i * 10], [14, 0], { extrapolateRight: "clamp" })}px)`,
          }}>
            {t}
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.orangeGlow, border: `1px solid ${C.orange}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: C.orange, fontSize: 10 }}>✓</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: "absolute", left: -30, top: "50%",
        transform: `translateY(-50%) translateX(${browserX}px) translateY(${floatY}px)`,
        opacity: browserOpacity,
      }}>
        <div style={{ transform: "perspective(1500px) rotateY(8deg) rotateX(1.5deg)", transformOrigin: "center center" }}>
          <BrowserWindow url="tuscortes.com/dashboard/turnos" width={1050} height={600} scale={0.92}>
            <AppointmentsMain />
          </BrowserWindow>
        </div>
        <div style={{ position: "absolute", bottom: -28, left: "5%", width: "90%", height: 36, background: "rgba(0,0,0,0.35)", borderRadius: "50%", filter: "blur(18px)", transform: "perspective(1500px) rotateX(80deg)" }} />
      </div>
    </AbsoluteFill>
  );
};
