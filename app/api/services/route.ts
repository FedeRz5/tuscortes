import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { ServiceSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";

export const POST = withErrorHandler(async (req) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = ServiceSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  if (session.user.organizationId !== parsed.data.organizationId) return err("Sin permisos", 403);

  const service = await prisma.service.create({ data: parsed.data });
  return ok(service, 201);
});
