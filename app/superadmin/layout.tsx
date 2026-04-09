import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Providers } from "@/components/providers";

export default async function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "SUPERADMIN") redirect("/login");

  return (
    <Providers>
      <div className="flex h-screen overflow-hidden bg-zinc-50">
        <Sidebar role="SUPERADMIN" orgName="TusCortes" />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </Providers>
  );
}
