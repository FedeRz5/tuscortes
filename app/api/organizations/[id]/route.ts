import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { OrganizationPatchSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = withErrorHandler(async (req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;

  if (session.user.role !== "SUPERADMIN" && session.user.organizationId !== id) {
    return err("Forbidden", 403);
  }

  const body = await req.json();

  // Owners cannot change active/plan status
  if (session.user.role !== "SUPERADMIN") {
    delete body.active;
    delete body.plan;
  }

  const parsed = OrganizationPatchSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const org = await prisma.organization.update({ where: { id }, data: parsed.data });
  return ok(org);
});
