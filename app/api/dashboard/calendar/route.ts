import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import prisma from "@/lib/prisma";

export const GET = withErrorHandler(async (req) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = session.user.organizationId;
  if (!orgId) return err("Sin organización", 403);

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const [staff, appointments] = await Promise.all([
    prisma.staff.findMany({
      where: { organizationId: orgId, active: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, avatarUrl: true },
    }),
    prisma.appointment.findMany({
      where: { organizationId: orgId, date },
      include: { service: { select: { name: true, price: true } } },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return ok({ date, staff, appointments });
});
