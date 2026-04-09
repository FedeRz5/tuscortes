import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { StaffClient } from "./staff-client";

export default async function StaffPage() {
  const session = await auth();
  if (!session?.user.organizationId) redirect("/login");

  const staff = await prisma.staff.findMany({
    where: { organizationId: session.user.organizationId },
    include: { schedules: true },
    orderBy: { createdAt: "asc" },
  });

  return <StaffClient staff={staff} orgId={session.user.organizationId} />;
}
