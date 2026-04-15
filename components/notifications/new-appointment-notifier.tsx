"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import Link from "next/link";

export function NewAppointmentNotifier() {
  const lastSinceRef = useRef(new Date().toISOString());
  const [notifications, setNotifications] = useState<{ id: string; clientName: string; startTime: string }[]>([]);

  useEffect(() => {
    const poll = async () => {
      // No pollear si el tab está en segundo plano
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch(
          `/api/dashboard/notifications?since=${encodeURIComponent(lastSinceRef.current)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.appointments?.length > 0) {
          lastSinceRef.current = new Date().toISOString();
          setNotifications((prev) => [...prev, ...data.appointments]);
        }
      } catch {}
    };

    const interval = setInterval(poll, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (notifications.length === 0) return null;

  const latest = notifications[notifications.length - 1];
  const count = notifications.length;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 bg-zinc-900 text-white rounded-2xl shadow-2xl p-4 animate-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-8 w-8 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
            <Bell className="h-4 w-4 text-yellow-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {count === 1
                ? `Nuevo turno de ${latest.clientName}`
                : `${count} nuevos turnos`}
            </p>
            {count === 1 && (
              <p className="text-xs text-zinc-400 mt-0.5">A las {latest.startTime}</p>
            )}
            <Link
              href="/dashboard/appointments"
              onClick={() => setNotifications([])}
              className="text-xs text-yellow-400 hover:text-yellow-300 mt-1 inline-block"
            >
              Ver turnos →
            </Link>
          </div>
        </div>
        <button
          onClick={() => setNotifications([])}
          className="text-zinc-500 hover:text-white shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
