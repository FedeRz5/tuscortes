import Image from "next/image";
import { LoginForm } from "./login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect(session.user.role === "SUPERADMIN" ? "/superadmin" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="TusCortes" width={160} height={80} className="mx-auto h-20 w-auto object-contain mb-4" />
          <p className="text-zinc-500">Ingresá a tu panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
