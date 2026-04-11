import { requireAuth, ok, err } from "@/lib/api";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;
  if (!session.user.organizationId) return err("Sin organización", 403);

  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");

  if (!since) return err("Falta parámetro since", 400);

  const sinceDate = new Date(since);
  if (isNaN(sinceDate.getTime())) return err("Fecha inválida", 400);

  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId: session.user.organizationId,
      createdAt: { gt: sinceDate },
      status: { not: "CANCELLED" },
    },
    select: { id: true, clientName: true, startTime: true, date: true },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  return ok({ appointments, count: appointments.length });
}
