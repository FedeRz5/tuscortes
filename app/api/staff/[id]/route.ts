import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { StaffPatchSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";

export const PATCH = withErrorHandler(async (req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;

  const existing = await prisma.staff.findUnique({ where: { id }, select: { organizationId: true } });
  if (!existing) return err("No encontrado", 404);
  if (existing.organizationId !== session.user.organizationId) return err("Sin permisos", 403);

  const body = await req.json();
  const parsed = StaffPatchSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const staff = await prisma.staff.update({ where: { id }, data: parsed.data });
  return ok(staff);
});

export const DELETE = withErrorHandler(async (_req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;

  const existing = await prisma.staff.findUnique({ where: { id }, select: { organizationId: true } });
  if (!existing) return err("No encontrado", 404);
  if (existing.organizationId !== session.user.organizationId) return err("Sin permisos", 403);

  await prisma.staff.delete({ where: { id } });
  return ok({ success: true });
});
