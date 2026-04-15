import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ScheduleClient } from "./schedule-client";

export default async function SchedulePage() {
  const session = await getSession();
  if (!session?.user.organizationId) redirect("/login");

  const staff = await prisma.staff.findMany({
    where: { organizationId: session.user.organizationId, active: true },
    include: { schedules: { orderBy: { dayOfWeek: "asc" } } },
    orderBy: { name: "asc" },
  });

  return <ScheduleClient staff={staff} />;
}
