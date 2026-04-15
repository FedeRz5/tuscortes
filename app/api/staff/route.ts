import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { StaffSchema } from "@/lib/schemas";
import { getLimits } from "@/lib/plans";
import prisma from "@/lib/prisma";

export const POST = withErrorHandler(async (req) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = StaffSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  // Verificar que el usuario pertenece a la organización
  if (session.user.organizationId !== parsed.data.organizationId) return err("Sin permisos", 403);

  // Verificar límite de barberos según plan
  const org = await prisma.organization.findUnique({
    where: { id: parsed.data.organizationId },
    select: { plan: true },
  });
  if (!org) return err("Organización no encontrada", 404);

  const limits = getLimits(org.plan);
  if (limits.maxStaff !== null) {
    const staffCount = await prisma.staff.count({
      where: { organizationId: parsed.data.organizationId },
    });
    if (staffCount >= limits.maxStaff) {
      return err(
        `Tu plan ${org.plan} permite hasta ${limits.maxStaff} barbero${limits.maxStaff === 1 ? "" : "s"}. Actualizá tu plan para agregar más.`,
        403
      );
    }
  }

  const staff = await prisma.staff.create({ data: parsed.data });
  return ok(staff, 201);
});
