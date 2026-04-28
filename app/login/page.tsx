import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

function LogoHover() {
  return (
    <Link href="/" className="relative inline-block group h-20 mb-4">
      <Image src="/Tuscortes-negro.png" alt="TusCortes" width={160} height={80} className="h-20 w-auto object-contain transition-opacity duration-200 group-hover:opacity-0" unoptimized />
      <Image src="/TusCortes-verde.png" alt="TusCortes" width={160} height={80} className="h-20 w-auto object-contain transition-opacity duration-200 opacity-0 group-hover:opacity-100 absolute inset-0" unoptimized />
    </Link>
  );
}

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect(session.user.role === "SUPERADMIN" ? "/superadmin" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1]">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <LogoHover />
          <p className="text-black/40">Ingresá a tu panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
