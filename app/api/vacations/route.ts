import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { VacationBlockSchema } from "@/lib/schemas";
import { hasFeature } from "@/lib/plans";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = VacationBlockSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  if (session.user.organizationId !== parsed.data.organizationId) return err("Forbidden", 403);

  const org = await prisma.organization.findUnique({
    where: { id: parsed.data.organizationId },
    select: { plan: true },
  });
  if (!org) return err("Organización no encontrada", 404);

  if (!hasFeature(org.plan, "vacationBlocks")) {
    return err("Los bloques de vacaciones están disponibles a partir del plan Pro.", 403);
  }

  const vacation = await prisma.vacationBlock.create({ data: parsed.data });
  return ok(vacation, 201);
});
