"use client";

import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className }: MagneticButtonProps) {
  return <div className={cn("inline-block", className)}>{children}</div>;
}
