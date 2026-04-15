import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const FadeSlide: React.FC<Props> = ({
  delay = 0,
  direction = "up",
  distance = 40,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 180, mass: 0.9 },
    durationInFrames: 40,
  });

  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  const dx = direction === "left" ? distance : direction === "right" ? -distance : 0;
  const dy = direction === "up" ? distance : direction === "down" ? -distance : 0;

  const tx = interpolate(progress, [0, 1], [dx, 0]);
  const ty = interpolate(progress, [0, 1], [dy, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translate(${tx}px, ${ty}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
