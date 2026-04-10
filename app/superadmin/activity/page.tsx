import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, UserCog, Trash2, ToggleLeft, CreditCard, Plus } from "lucide-react";

const ACTION_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  ORG_CREATED:    { label: "Barbería creada",       icon: Plus,       color: "text-green-600 bg-green-50" },
  ORG_DELETED:    { label: "Barbería eliminada",     icon: Trash2,     color: "text-red-600 bg-red-50" },
  PLAN_CHANGED:   { label: "Plan modificado",        icon: CreditCard, color: "text-blue-600 bg-blue-50" },
  STATUS_CHANGED: { label: "Estado modificado",      icon: ToggleLeft, color: "text-amber-600 bg-amber-50" },
  OWNER_EDITED:   { label: "Dueño editado",          icon: UserCog,    color: "text-purple-600 bg-purple-50" },
};

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days} d`;
}

export default async function ActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { organization: { select: { name: true, slug: true, primaryColor: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Actividad</h1>
        <p className="text-zinc-500 text-sm mt-1">Últimas {logs.length} acciones en la plataforma</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {logs.length === 0 ? (
            <p className="text-zinc-400 text-sm italic text-center py-8">No hay actividad registrada todavía.</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, i) => {
                const meta = ACTION_META[log.action] ?? { label: log.action, icon: Building2, color: "text-zinc-600 bg-zinc-100" };
                const Icon = meta.icon;
                return (
                  <div key={log.id}>
                    {i > 0 && <div className="border-t border-zinc-50 my-1" />}
                    <div className="flex items-start gap-4 py-3 px-2 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${meta.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-zinc-900 text-sm">{meta.label}</span>
                          {log.organization && (
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                              <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ backgroundColor: log.organization.primaryColor }}
                              />
                              {log.organization.name}
                            </span>
                          )}
                        </div>
                        {log.detail && <p className="text-sm text-zinc-500 mt-0.5">{log.detail}</p>}
                        <p className="text-xs text-zinc-400 mt-1">{log.performedBy} · {timeAgo(log.createdAt)}</p>
                      </div>
                      <span className="text-xs text-zinc-300 shrink-0 mt-1">
                        {log.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
