import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: ReturnType<typeof auth> extends Promise<infer T> ? T : never }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Rutas que requieren autenticación
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/superadmin")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Superadmin: solo SUPERADMIN puede entrar
  if (pathname.startsWith("/superadmin")) {
    if (session?.user?.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/superadmin/:path*"],
};
