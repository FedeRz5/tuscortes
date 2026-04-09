import prisma from "@/lib/prisma";
import { OrganizationsClient } from "./organizations-client";

export default async function OrganizationsPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { appointments: true, staff: true, users: true } },
    },
  });

  return <OrganizationsClient organizations={organizations} />;
}
