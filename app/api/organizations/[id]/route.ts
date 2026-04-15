import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { OrganizationPatchSchema } from "@/lib/schemas";
import { logActivity } from "@/lib/activity";
import prisma from "@/lib/prisma";

export const PATCH = withErrorHandler(async (req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;

  if (session.user.role !== "SUPERADMIN" && session.user.organizationId !== id) {
    return err("Sin permisos", 403);
  }

  const body = await req.json();

  // Owners cannot change active/plan/adminNotes
  if (session.user.role !== "SUPERADMIN") {
    delete body.active;
    delete body.plan;
    delete body.adminNotes;
  }

  const parsed = OrganizationPatchSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  // Fetch current state to detect what changed
  const current = await prisma.organization.findUnique({
    where: { id },
    select: { plan: true, active: true, name: true },
  });

  const org = await prisma.organization.update({ where: { id }, data: parsed.data });

  // Log significant changes
  if (session.user.role === "SUPERADMIN" && current) {
    if (parsed.data.plan && parsed.data.plan !== current.plan) {
      logActivity({
        organizationId: id,
        action: "PLAN_CHANGED",
        detail: `Plan cambiado de ${current.plan} a ${parsed.data.plan}`,
        performedBy: session.user.email!,
      });
    }
    if (parsed.data.active !== undefined && parsed.data.active !== current.active) {
      logActivity({
        organizationId: id,
        action: "STATUS_CHANGED",
        detail: parsed.data.active ? "Barbería activada" : "Barbería desactivada",
        performedBy: session.user.email!,
      });
    }
  }

  return ok(org);
});

export const DELETE = withErrorHandler(async (_req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;
  if (session.user.role !== "SUPERADMIN") return err("Sin permisos", 403);

  const { id } = await ctx.params;

  const org = await prisma.organization.findUnique({ where: { id }, select: { name: true } });

  // Log before deleting (cascade will remove the log too, but it's useful for the moment)
  if (org) {
    await logActivity({
      action: "ORG_DELETED",
      detail: `Barbería "${org.name}" eliminada`,
      performedBy: session.user.email!,
    });
  }

  await prisma.organization.delete({ where: { id } });
  return ok({ deleted: true });
});
