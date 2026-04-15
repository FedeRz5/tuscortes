export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = FPS * 75; // 75 seconds

export const C = {
  bg: "#05081A",
  bgSecondary: "#080C24",
  surface: "rgba(255,255,255,0.045)",
  surfaceHover: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.18)",

  // Primary: blue profundo — serio, confiable
  primary: "#2563EB",
  primaryLight: "#93C5FD",
  primaryGlow: "rgba(37,99,235,0.28)",

  // Accent: indigo-lavanda — reemplaza naranja, sofisticado
  orange: "#818CF8",
  orangeLight: "#C7D2FE",
  orangeGlow: "rgba(129,140,248,0.28)",

  white: "#FFFFFF",
  text: "#E2E8F0",
  muted: "#94A3B8",
  dim: "#475569",

  success: "#10B981",
  successBg: "rgba(16,185,129,0.13)",
  successBorder: "rgba(16,185,129,0.3)",

  warning: "#F59E0B",
  warningBg: "rgba(245,158,11,0.13)",

  danger: "#EF4444",
  dangerBg: "rgba(239,68,68,0.13)",

  blue: "#60A5FA",
  blueBg: "rgba(96,165,250,0.13)",

  purple: "#A78BFA",
  purpleBg: "rgba(167,139,250,0.13)",
};

// Scene durations in frames
export const SCENES = {
  INTRO:       { dur: 90  },  // 3s
  HOOK:        { dur: 150 },  // 5s
  CLIENT_PAGE: { dur: 180 },  // 6s – vista pública
  CLIENT_DATE: { dur: 150 },  // 5s – elegir fecha y hora
  CLIENT_CONF: { dur: 120 },  // 4s – confirmación
  DASH_INTRO:  { dur: 90  },  // 3s – transición "panel del barbero"
  DASHBOARD:   { dur: 210 },  // 7s – stats + turnos de hoy
  APPOINTMENTS:{ dur: 180 },  // 6s – gestión de turnos
  REVENUE:     { dur: 180 },  // 6s – módulo de ingresos
  STAFF:       { dur: 150 },  // 5s – staff y servicios
  OUTRO:       { dur: 300 },  // 10s – CTA final
};
