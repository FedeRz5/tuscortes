import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { WorkScheduleSchema } from "@/lib/schemas";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req) => {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = WorkScheduleSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { staffId, dayOfWeek, startTime, endTime, enabled, bufferMin } = parsed.data;

  const schedule = await prisma.workSchedule.upsert({
    where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
    update: { startTime, endTime, enabled, bufferMin },
    create: { staffId, dayOfWeek, startTime, endTime, enabled, bufferMin },
  });

  return ok(schedule);
});
