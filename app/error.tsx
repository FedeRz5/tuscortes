"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-black text-[#111111] mb-2">Algo salió mal</h1>
      <p className="text-black/40 text-sm mb-8">Intentá de nuevo o volvé al inicio.</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-[#E7FF51] px-6 py-3 text-sm font-bold text-black hover:bg-[#d4f000] transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-xl border border-black/15 px-6 py-3 text-sm font-semibold text-black/60 hover:text-black transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
