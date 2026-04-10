import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { WorkScheduleSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";

export const POST = withErrorHandler(async (req) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = WorkScheduleSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { staffId, dayOfWeek, startTime, endTime, enabled, bufferMin } = parsed.data;

  // Verificar que el staff pertenece a la organización del usuario
  const staffMember = await prisma.staff.findUnique({ where: { id: staffId }, select: { organizationId: true } });
  if (!staffMember) return err("Barbero no encontrado", 404);
  if (staffMember.organizationId !== session.user.organizationId) return err("Forbidden", 403);

  const schedule = await prisma.workSchedule.upsert({
    where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
    update: { startTime, endTime, enabled, bufferMin },
    create: { staffId, dayOfWeek, startTime, endTime, enabled, bufferMin },
  });

  return ok(schedule);
});
