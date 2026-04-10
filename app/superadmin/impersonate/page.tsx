"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function ImpersonatePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;
    signIn("credentials", {
      impersonationToken: token,
      callbackUrl: "/dashboard",
      redirect: true,
    });
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50">
      <p className="text-zinc-500 text-sm">Iniciando sesión como dueño...</p>
    </div>
  );
}
