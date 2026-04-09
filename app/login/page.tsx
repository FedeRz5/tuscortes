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
          <h1 className="text-3xl font-bold text-zinc-900">Tu Agenda</h1>
          <p className="text-zinc-500 mt-2">Ingresá a tu panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
