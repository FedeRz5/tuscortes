import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        impersonationToken: { label: "Impersonation Token", type: "text" },
      },
      async authorize(credentials) {
        // Impersonation flow
        if (credentials?.impersonationToken) {
          const record = await prisma.impersonationToken.findUnique({
            where: { token: credentials.impersonationToken as string, used: false },
          });
          if (!record || record.expiresAt < new Date()) return null;

          const user = await prisma.user.findUnique({ where: { id: record.userId } });
          if (!user) return null;

          await prisma.impersonationToken.update({ where: { id: record.id }, data: { used: true } });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            organizationId: user.organizationId,
          };
        }

        // Normal login
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const valid = await compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
});
