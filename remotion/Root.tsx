import React from "react";
import { Composition } from "remotion";
import { TusCortesDemo } from "./Video";
import { FPS } from "./constants";

// Total: 150+210+480+75+210+180+180+150+150+360 = 2145 frames ≈ 71.5s
const TOTAL_FRAMES = 150 + 210 + 480 + 75 + 210 + 180 + 180 + 150 + 150 + 360;

export const Root: React.FC = () => (
  <Composition
    id="TusCortesDemo"
    component={TusCortesDemo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
