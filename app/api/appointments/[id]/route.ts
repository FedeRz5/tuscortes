import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { AppointmentPatchSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";

export const PATCH = withErrorHandler(async (req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;

  const existing = await prisma.appointment.findUnique({ where: { id }, select: { organizationId: true } });
  if (!existing) return err("No encontrado", 404);
  if (existing.organizationId !== session.user.organizationId) return err("Forbidden", 403);

  const body = await req.json();
  const parsed = AppointmentPatchSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const appointment = await prisma.appointment.update({ where: { id }, data: parsed.data });
  return ok(appointment);
});

export const DELETE = withErrorHandler(async (_req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;

  const existing = await prisma.appointment.findUnique({ where: { id }, select: { organizationId: true } });
  if (!existing) return err("No encontrado", 404);
  if (existing.organizationId !== session.user.organizationId) return err("Forbidden", 403);

  await prisma.appointment.delete({ where: { id } });
  return ok({ success: true });
});
