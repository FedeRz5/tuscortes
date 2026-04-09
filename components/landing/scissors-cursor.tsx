"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function ScissorsCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [angle, setAngle] = useState(0);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const springConfig = { stiffness: 600, damping: 40 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Solo en desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      const dx = e.clientX - prevPos.x;
      const dy = e.clientY - prevPos.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) {
        setAngle(Math.atan2(dy, dx) * (180 / Math.PI) + 45);
        setPrevPos({ x: e.clientX, y: e.clientY });
      }
      mouseX.set(e.clientX - 14);
      mouseY.set(e.clientY - 14);
      setVisible(true);
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [prevPos]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[99999] pointer-events-none hidden sm:block"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.2 } }}
    >
      <motion.svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        animate={{ rotate: angle }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Blade A */}
        <path
          d="M6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M9 9L20 3"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Blade B */}
        <path
          d="M6 15C6 13.3431 7.34315 12 9 12C10.6569 12 12 13.3431 12 15C12 16.6569 10.6569 18 9 18C7.34315 18 6 16.6569 6 15Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M9 15L20 21"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Pivot */}
        <circle cx="12" cy="12" r="1.2" fill="#6366f1" />
      </motion.svg>
    </motion.div>
  );
}
