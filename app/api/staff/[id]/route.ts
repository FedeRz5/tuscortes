import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { StaffPatchSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = withErrorHandler(async (req, ctx) => {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = StaffPatchSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const staff = await prisma.staff.update({ where: { id }, data: parsed.data });
  return ok(staff);
});

export const DELETE = withErrorHandler(async (_req, ctx) => {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.staff.delete({ where: { id } });
  return ok({ success: true });
});
