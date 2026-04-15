import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tuscortes.com";

export const metadata: Metadata = {
  title: "TusCortes",
  description: "Reservá tu turno en segundos. Sin esperas, sin llamadas.",
  icons: { icon: "/logo.png" },
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "TusCortes",
    description: "Reservá tu turno en segundos. Sin esperas, sin llamadas.",
    url: APP_URL,
    siteName: "TusCortes",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "TusCortes",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "TusCortes",
    description: "Reservá tu turno en segundos. Sin esperas, sin llamadas.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
