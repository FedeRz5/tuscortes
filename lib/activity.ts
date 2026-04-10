import prisma from "@/lib/prisma";

export async function logActivity(params: {
  organizationId?: string;
  action: string;
  detail?: string;
  performedBy: string;
}) {
  try {
    await prisma.activityLog.create({ data: params });
  } catch {
    // No bloqueamos el flujo principal si falla el log
  }
}
