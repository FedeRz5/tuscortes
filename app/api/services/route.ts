import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { ServiceSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req) => {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = ServiceSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const service = await prisma.service.create({ data: parsed.data });
  return ok(service, 201);
});
