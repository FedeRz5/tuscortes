import { requireSuperadmin, ok, err, withErrorHandler } from "@/lib/api";
import prisma from "@/lib/prisma";

export const POST = withErrorHandler(async (_req, ctx) => {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const { userId } = await ctx.params;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  if (!user) return err("Usuario no encontrado", 404);
  if (user.role === "SUPERADMIN") return err("No se puede impersonar a otro superadmin", 403);

  // Limpiar tokens anteriores sin usar
  await prisma.impersonationToken.deleteMany({ where: { userId, used: false } });

  const token = await prisma.impersonationToken.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
    },
  });

  return ok({ token: token.token });
});
