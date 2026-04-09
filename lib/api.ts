import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function requireAuth(): Promise<
  { session: Session; error: null } | { session: null; error: NextResponse }
> {
  const session = await auth();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export async function requireSuperadmin(): Promise<
  { session: Session; error: null } | { session: null; error: NextResponse }
> {
  const { session, error } = await requireAuth();
  if (error) return { session: null, error };
  if (session!.user.role !== "SUPERADMIN") {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session: session!, error: null };
}

// ─── Response helpers ─────────────────────────────────────────────────────────

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// ─── Route wrapper with try/catch ─────────────────────────────────────────────

type RouteHandler = (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (e) {
      console.error("[API Error]", e);
      return err("Error interno del servidor", 500);
    }
  };
}
