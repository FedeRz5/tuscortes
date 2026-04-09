"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Users,
  Scissors,
  Clock,
  Settings,
  LayoutDashboard,
  Building2,
  LogOut,
  CalendarOff,
  DollarSign,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const ownerLinks = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "Turnos", icon: Calendar },
  { href: "/dashboard/services", label: "Servicios", icon: Scissors },
  { href: "/dashboard/staff", label: "Barberos", icon: Users },
  { href: "/dashboard/schedule", label: "Horarios", icon: Clock },
  { href: "/dashboard/vacations", label: "Vacaciones", icon: CalendarOff },
  { href: "/dashboard/revenue", label: "Ingresos", icon: DollarSign },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

const superadminLinks = [
  { href: "/superadmin", label: "Panel", icon: LayoutDashboard },
  { href: "/superadmin/organizations", label: "Barberías", icon: Building2 },
];

interface SidebarProps {
  role: string;
  orgName?: string;
}

export function Sidebar({ role, orgName }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "SUPERADMIN" ? superadminLinks : ownerLinks;

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
            {role === "SUPERADMIN" ? "Super Admin" : "Panel"}
          </p>
          <p className="font-semibold text-zinc-900 truncate">{orgName ?? "Tu Agenda"}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === pathname ||
            (href !== "/dashboard" && href !== "/superadmin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
