"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
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
  const [open, setOpen] = useState(false);
  const links = role === "SUPERADMIN" ? superadminLinks : ownerLinks;

  // Close drawer on navigation
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navContent = (
    <>
      <div className="flex h-14 items-center border-b border-zinc-200 px-5 justify-between">
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
            {role === "SUPERADMIN" ? "Super Admin" : "Panel"}
          </p>
          <p className="font-semibold text-zinc-900 truncate">{orgName ?? "TusCortes"}</p>
        </div>
        <button
          className="md:hidden p-1 text-zinc-400 hover:text-zinc-900"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
    </>
  );

  return (
    <>
      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4">
        <p className="font-semibold text-zinc-900">{orgName ?? "TusCortes"}</p>
        <button onClick={() => setOpen(true)} className="p-1 text-zinc-600">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, static on desktop */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-in-out md:translate-x-0 md:transition-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
