import { requireSuperadmin, ok, err, withErrorHandler } from "@/lib/api";
import { OrganizationCreateSchema } from "@/lib/schemas";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req) => {
  const { session, error } = await requireSuperadmin();
  if (error) return error;

  const body = await req.json();
  const parsed = OrganizationCreateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { name, slug, ownerEmail, ownerPassword, ownerName } = parsed.data;

  const existing = await prisma.organization.findUnique({ where: { slug } });
  if (existing) return err("El slug ya está en uso");

  const existingUser = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (existingUser) return err("El email ya está en uso");

  const passwordHash = await hash(ownerPassword, 12);

  const org = await prisma.organization.create({
    data: {
      name,
      slug,
      users: {
        create: { email: ownerEmail, name: ownerName, passwordHash, role: "OWNER" },
      },
    },
  });

  logActivity({
    organizationId: org.id,
    action: "ORG_CREATED",
    detail: `Barbería "${org.name}" creada con plan FREE`,
    performedBy: session!.user.email!,
  });

  return ok(org, 201);
});
