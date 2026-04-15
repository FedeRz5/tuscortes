import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { C } from "./constants";
import { ColdOpen } from "./scenes/ColdOpen";
import { ProblemScene } from "./scenes/Problem";
import { ClientFlowScene } from "./scenes/ClientFlow";
import { DashboardTransition, DashboardScene, AppointmentsScene } from "./scenes/DashboardScene";
import { RevenueScene, StaffScene } from "./scenes/RevenueStaff";
import { StatsScene } from "./scenes/Stats";
import { OutroScene } from "./scenes/Outro";

// ─── Scene durations (frames @ 30fps) ────────────────────────────────────────
const D = {
  COLD_OPEN:    150,  // 5s
  PROBLEM:      210,  // 7s
  CLIENT:       480,  // 16s (180+150+150)
  DASH_INTRO:   75,   // 2.5s
  DASHBOARD:    210,  // 7s
  APPOINTMENTS: 180,  // 6s
  REVENUE:      180,  // 6s
  STAFF:        150,  // 5s
  STATS:        150,  // 5s
  OUTRO:        360,  // 12s
};

export const TusCortesDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <Series>
        <Series.Sequence durationInFrames={D.COLD_OPEN}>
          <ColdOpen />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.PROBLEM}>
          <ProblemScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.CLIENT}>
          <ClientFlowScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.DASH_INTRO}>
          <DashboardTransition />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.DASHBOARD}>
          <DashboardScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.APPOINTMENTS}>
          <AppointmentsScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.REVENUE}>
          <RevenueScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.STAFF}>
          <StaffScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.STATS}>
          <StatsScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={D.OUTRO}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
