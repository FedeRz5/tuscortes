import { requireAuth, ok, withErrorHandler } from "@/lib/api";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const DELETE = withErrorHandler(async (_req, ctx) => {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.vacationBlock.delete({ where: { id } });
  return ok({ success: true });
});
