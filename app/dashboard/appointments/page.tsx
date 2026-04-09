import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { AppointmentsClient } from "./appointments-client";

export default async function AppointmentsPage() {
  const session = await auth();
  if (!session?.user.organizationId) redirect("/login");

  const today = new Date().toISOString().split("T")[0];

  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId: session.user.organizationId,
      date: { gte: today },
    },
    include: { service: true, staff: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return <AppointmentsClient appointments={appointments} />;
}
