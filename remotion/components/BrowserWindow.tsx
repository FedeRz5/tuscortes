import React from "react";
import { C } from "../constants";

interface Props {
  children: React.ReactNode;
  url?: string;
  width?: number;
  height?: number;
  scale?: number;
  style?: React.CSSProperties;
}

export const BrowserWindow: React.FC<Props> = ({
  children,
  url = "tuscortes.com",
  width = 1100,
  height = 680,
  scale = 1,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px ${C.borderStrong}`,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        ...style,
      }}
    >
      {/* Chrome bar */}
      <div
        style={{
          background: "#1A1A2E",
          height: 44,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          paddingRight: 16,
          gap: 16,
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((color) => (
            <div key={color} style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
          ))}
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 6,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${C.border}`,
          }}
        >
          <span style={{ color: C.muted, fontSize: 12, fontFamily: "monospace" }}>
            🔒 {url}
          </span>
        </div>

        <div style={{ width: 60 }} />
      </div>

      {/* Content */}
      <div style={{ background: "#F8F9FA", height: height - 44, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};
