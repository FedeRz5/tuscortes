import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import prisma from "@/lib/prisma";
import { Providers } from "@/components/providers";
import { NewAppointmentNotifier } from "@/components/notifications/new-appointment-notifier";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  let orgName: string | undefined;
  if (session.user.organizationId) {
    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: { name: true },
    });
    orgName = org?.name;
  }

  return (
    <Providers>
      <div className="flex h-screen overflow-hidden bg-zinc-50">
        <Sidebar role={session.user.role} orgName={orgName} />
        <main className="flex-1 overflow-y-auto">
          <div className="pt-14 md:pt-0 p-4 md:p-8">{children}</div>
        </main>
        <NewAppointmentNotifier />
      </div>
    </Providers>
  );
}
