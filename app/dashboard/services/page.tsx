import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ServicesClient } from "./services-client";

export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user.organizationId) redirect("/login");

  const services = await prisma.service.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { createdAt: "asc" },
  });

  return <ServicesClient services={services} orgId={session.user.organizationId} />;
}
