import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../constants";
import { BrowserWindow } from "../components/BrowserWindow";
import { FadeSlide } from "../components/FadeSlide";

// ─── Sidebar (reused) ─────────────────────────────────────────────────────────

const Sidebar: React.FC<{ active: string }> = ({ active }) => {
  const items = [
    { icon: "🏠", label: "Panel", id: "panel" },
    { icon: "📅", label: "Turnos", id: "turnos" },
    { icon: "🗓️", label: "Calendario", id: "calendario" },
    { icon: "💰", label: "Ingresos", id: "ingresos" },
    { icon: "👥", label: "Barberos", id: "barberos" },
    { icon: "✂️", label: "Servicios", id: "servicios" },
    { icon: "⚙️", label: "Horarios", id: "horarios" },
  ];
  return (
    <div style={{ width: 200, height: "100%", background: "#111827", display: "flex", flexDirection: "column", padding: "16px 0", flexShrink: 0 }}>
      <div style={{ padding: "0 16px 16px", borderBottom: "1px solid #1F2937", marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#FFF", letterSpacing: "-0.5px" }}>
          Tus<span style={{ color: "#EF4444" }}>Cortes</span>
        </div>
        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Ramos Cutz</div>
      </div>
      {items.map(({ icon, label, id }) => (
        <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", background: active === id ? "rgba(79,70,229,0.15)" : "transparent", borderRight: active === id ? "3px solid #4F46E5" : "3px solid transparent" }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: active === id ? 600 : 400, color: active === id ? "#E0E7FF" : "#9CA3AF" }}>{label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Revenue page ─────────────────────────────────────────────────────────────

const revenueStats = [
  { label: "Cobrado", value: "$42.000", icon: "✅", color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0" },
  { label: "Pendiente", value: "$8.500", icon: "⏳", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { label: "Proyectado", value: "$50.500", icon: "📈", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
];

const staffRevenue = [
  { name: "Rodrigo M.", count: 18, total: "$22.000", collected: "$18.500", rate: 84 },
  { name: "Lucas P.", count: 15, total: "$16.500", collected: "$14.000", rate: 85 },
  { name: "Matías G.", count: 11, total: "$12.000", collected: "$9.500", rate: 79 },
];

const RevenuePage: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar active="ingresos" />
      <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Ingresos</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Control de caja · Abril 2026</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Hoy", "Esta semana", "Este mes"].map((f, i) => (
              <div key={f} style={{ padding: "5px 12px", background: i === 2 ? "#111827" : "#FFF", color: i === 2 ? "#FFF" : "#6B7280", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid #E5E7EB", cursor: "pointer" }}>
                {f}
              </div>
            ))}
            <div style={{ padding: "5px 14px", background: "#FFF", color: "#374151", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 4 }}>
              ⬇ Exportar CSV
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {revenueStats.map((s, i) => (
            <div key={s.label} style={{
              flex: 1, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px",
              opacity: interpolate(frame, [i * 10, i * 10 + 20], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [i * 10, i * 10 + 20], [15, 0], { extrapolateRight: "clamp" })}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Staff breakdown */}
        <div style={{
          background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden",
          opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [35, 55], [15, 0], { extrapolateRight: "clamp" })}px)`,
        }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid #F3F4F6", fontSize: 13, fontWeight: 700, color: "#111827" }}>
            Por barbero · este mes
          </div>
          {staffRevenue.map((s, i) => (
            <div key={s.name} style={{
              padding: "12px 18px", borderBottom: i < staffRevenue.length - 1 ? "1px solid #F9FAFB" : "none",
              opacity: interpolate(frame, [50 + i * 12, 65 + i * 12], [0, 1], { extrapolateRight: "clamp" }),
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 13, fontWeight: 700 }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.count} turnos</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24, textAlign: "right" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>Facturado</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{s.total}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>Cobrado</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#15803D" }}>{s.collected}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>%</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.rate >= 80 ? "#15803D" : "#D97706" }}>{s.rate}%</div>
                  </div>
                </div>
              </div>
              <div style={{ height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.rate}%`, background: s.rate >= 80 ? "#10B981" : "#F59E0B", borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Staff & Services page ────────────────────────────────────────────────────

const staffList = [
  { name: "Rodrigo M.", role: "Barbero senior", services: ["Corte", "Barba", "Degradé"], color: "#818CF8" },
  { name: "Lucas P.", role: "Barbero", services: ["Corte", "Barba"], color: "#4F46E5" },
  { name: "Matías G.", role: "Barbero", services: ["Corte", "Degradé"], color: "#10B981" },
];

const servicesList = [
  { name: "Corte clásico", dur: "30 min", price: "$3.500", active: true },
  { name: "Corte + Barba", dur: "45 min", price: "$5.000", active: true },
  { name: "Degradé", dur: "40 min", price: "$4.500", active: true },
  { name: "Barba", dur: "20 min", price: "$2.000", active: true },
  { name: "Corte niños", dur: "25 min", price: "$2.800", active: false },
];

const StaffServicesPage: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Sidebar active="barberos" />
      <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden", display: "flex", gap: 16 }}>
        {/* Staff */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Barberos</div>
            <div style={{ background: "#4F46E5", color: "#FFF", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8, cursor: "pointer" }}>+ Agregar</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {staffList.map((s, i) => (
              <div key={s.name} style={{
                background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: "14px 16px",
                opacity: interpolate(frame, [i * 10, i * 10 + 20], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateX(${interpolate(frame, [i * 10, i * 10 + 20], [-15, 0], { extrapolateRight: "clamp" })}px)`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${s.color}, ${s.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 16, fontWeight: 800 }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{s.role}</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {s.services.map((sv) => (
                    <span key={sv} style={{ background: "#F3F4F6", color: "#374151", fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>{sv}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Servicios</div>
            <div style={{ background: "#4F46E5", color: "#FFF", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8, cursor: "pointer" }}>+ Agregar</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {servicesList.map((s, i) => (
              <div key={s.name} style={{
                background: "#FFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                opacity: interpolate(frame, [5 + i * 8, 20 + i * 8], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateX(${interpolate(frame, [5 + i * 8, 20 + i * 8], [15, 0], { extrapolateRight: "clamp" })}px)`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.active ? "#111827" : "#9CA3AF" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.dur}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{s.price}</div>
                  <div style={{ width: 32, height: 18, borderRadius: 9, background: s.active ? "#4F46E5" : "#E5E7EB", position: "relative" }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FFF", position: "absolute", top: 2, left: s.active ? 16 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── RevenueScene ─────────────────────────────────────────────────────────────

export const RevenueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 20, 160, 180], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const browserProgress = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 18, stiffness: 130 } });
  const browserY = interpolate(browserProgress, [0, 1], [50, 0]);
  const browserOpacity = interpolate(browserProgress, [0, 0.4], [0, 1]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: sceneOpacity }}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 40, padding: "60px",
      }}>
        <div style={{ width: "100%", textAlign: "center", zIndex: 10 }}>
          <FadeSlide delay={15}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ background: C.successBg, border: `1px solid ${C.success}40`, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: C.success, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Módulo de Ingresos
              </div>
            </div>
            <div style={{ fontSize: 58, fontWeight: 800, color: C.white, lineHeight: 1.15, marginBottom: 14 }}>
              Controlá tu caja
            </div>
            <div style={{ fontSize: 18, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
              Seguí lo cobrado vs. pendiente. Estadísticas por barbero y exportación CSV.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              {["Stats por barbero", "Marcar turno como cobrado", "Exportar a CSV"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: C.muted }}>
                  <span style={{ color: C.success }}>✓</span> {f}
                </div>
              ))}
            </div>
          </FadeSlide>
        </div>

        <div style={{ transform: `translateY(${browserY}px)`, opacity: browserOpacity }}>
          <BrowserWindow url="tuscortes.com/dashboard/ingresos" width={950} height={500} scale={1}>
            <RevenuePage />
          </BrowserWindow>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── StaffScene ───────────────────────────────────────────────────────────────

export const StaffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const browserProgress = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 18, stiffness: 130 } });
  const browserX = interpolate(browserProgress, [0, 1], [-60, 0]);
  const browserOpacity = interpolate(browserProgress, [0, 0.4], [0, 1]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: sceneOpacity }}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 40, padding: "60px",
      }}>
        <div style={{ width: "100%", textAlign: "center", zIndex: 10 }}>
          <FadeSlide delay={15} direction="left">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ background: C.purpleBg, border: `1px solid ${C.purple}40`, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: C.purple, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Equipo y servicios
              </div>
            </div>
            <div style={{ fontSize: 58, fontWeight: 800, color: C.white, lineHeight: 1.15, marginBottom: 14 }}>
              Tu equipo, tus reglas
            </div>
            <div style={{ fontSize: 18, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
              Agregá barberos, asignales servicios y configurá sus horarios independientemente.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              {["Foto y nombre por barbero", "Servicios por barbero", "Horarios independientes"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: C.muted }}>
                  <span style={{ color: C.purple }}>✓</span> {f}
                </div>
              ))}
            </div>
          </FadeSlide>
        </div>

        <div style={{ transform: `translateX(${browserX}px)`, opacity: browserOpacity }}>
          <BrowserWindow url="tuscortes.com/dashboard/barberos" width={950} height={500} scale={1}>
            <StaffServicesPage />
          </BrowserWindow>
        </div>
      </div>
    </AbsoluteFill>
  );
};
