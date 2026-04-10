import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TusCortes — Turnos online para tu barbería",
  description: "Reservá tu turno en segundos. Sin esperas, sin llamadas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
