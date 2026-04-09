import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";
config();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.MIGRATE_URL ?? process.env.DATABASE_URL ?? "",
  },
  // @ts-ignore — 'migrate' is a valid Prisma CLI config key, not yet in types
  migrate: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async adapter(env: any) {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      return new PrismaPg({ connectionString: env.MIGRATE_URL ?? env.DATABASE_URL });
    },
  },
});
