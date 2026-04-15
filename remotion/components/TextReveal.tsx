import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../constants";

interface WordRevealProps {
  text: string;
  delay?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  gradient?: boolean;
  gradientColors?: [string, string];
  letterSpacing?: string;
  lineHeight?: number;
  stagger?: number;
}

/** Reveals text word-by-word with spring animation */
export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  delay = 0,
  fontSize = 72,
  fontWeight = 900,
  color = C.white,
  gradient = false,
  gradientColors = [C.white, C.orange],
  letterSpacing = "-0.03em",
  lineHeight = 1.05,
  stagger = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.42em",
        alignItems: "baseline",
        lineHeight,
      }}
    >
      {words.map((word, i) => {
        const wDelay = delay + i * stagger;
        const progress = spring({
          frame: Math.max(0, frame - wDelay),
          fps,
          config: { damping: 20, stiffness: 220, mass: 0.85 },
        });
        const opacity = interpolate(progress, [0, 0.5], [0, 1]);
        const y = interpolate(progress, [0, 1], [36, 0]);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize,
              fontWeight,
              letterSpacing,
              opacity,
              transform: `translateY(${y}px)`,
              lineHeight,
              ...(gradient
                ? {
                    background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }
                : { color }),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

interface LineRevealProps {
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/** Reveals a single line by sweeping a clip-path */
export const LineReveal: React.FC<LineRevealProps> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 24, stiffness: 180 },
  });

  const clip = interpolate(progress, [0, 1], [100, 0]);
  const y = interpolate(progress, [0, 1], [20, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1]);

  return (
    <div
      style={{
        clipPath: `inset(0 ${clip}% 0 0)`,
        opacity,
        transform: `translateY(${y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface CountUpProps {
  from?: number;
  to: number;
  delay?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
}

/** Animated count-up number */
export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  delay = 0,
  duration = 60,
  prefix = "",
  suffix = "",
  fontSize = 80,
  fontWeight = 900,
  color = C.white,
}) => {
  const frame = useCurrentFrame();

  const easedFrame = Math.max(0, frame - delay);
  const progress = Math.min(1, easedFrame / duration);
  // Ease out cubic
  const eased = 1 - Math.pow(1 - progress, 3);
  const value = Math.round(from + (to - from) * eased);

  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        fontSize,
        fontWeight,
        color,
        letterSpacing: "-0.04em",
        opacity,
        display: "inline-block",
      }}
    >
      {prefix}{value.toLocaleString("es-AR")}{suffix}
    </span>
  );
};
