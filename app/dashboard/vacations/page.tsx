import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { VacationsClient } from "./vacations-client";

export default async function VacationsPage() {
  const session = await auth();
  if (!session?.user.organizationId) redirect("/login");

  const [vacations, staff] = await Promise.all([
    prisma.vacationBlock.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: { startDate: "asc" },
    }),
    prisma.staff.findMany({
      where: { organizationId: session.user.organizationId, active: true },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <VacationsClient
      vacations={vacations}
      staff={staff}
      orgId={session.user.organizationId}
    />
  );
}
