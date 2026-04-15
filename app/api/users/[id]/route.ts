import { requireAuth, ok, err, withErrorHandler } from "@/lib/api";
import { logActivity } from "@/lib/activity";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const PatchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8, "Mínimo 8 caracteres").optional(),
  active: z.boolean().optional(),
});

export const PATCH = withErrorHandler(async (req, ctx) => {
  const { session, error } = await requireAuth();
  if (error) return error;
  if (session.user.role !== "SUPERADMIN") return err("Sin permisos", 403);

  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { password, ...rest } = parsed.data;
  const data: { name?: string; email?: string; active?: boolean; passwordHash?: string } = { ...rest };
  if (password) data.passwordHash = await hash(password, 12);

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, organizationId: true, createdAt: true },
  });

  const changes = [];
  if (parsed.data.name) changes.push("nombre");
  if (parsed.data.email) changes.push("email");
  if (parsed.data.password) changes.push("contraseña");
  logActivity({
    organizationId: user.organizationId ?? undefined,
    action: "OWNER_EDITED",
    detail: `Dueño "${user.email}" editado (${changes.join(", ")})`,
    performedBy: session.user.email!,
  });

  return ok(user);
});
