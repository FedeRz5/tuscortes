import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import prisma from "@/lib/prisma";

export const DELETE = withErrorHandler(async (_req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;

  const existing = await prisma.vacationBlock.findUnique({ where: { id }, select: { organizationId: true } });
  if (!existing) return err("No encontrado", 404);
  if (existing.organizationId !== session.user.organizationId) return err("Forbidden", 403);

  await prisma.vacationBlock.delete({ where: { id } });
  return ok({ success: true });
});
