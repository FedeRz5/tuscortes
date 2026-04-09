import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.MIGRATE_URL ?? process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Superadmin ───────────────────────────────────────────────────────────
  const superadminHash = await hash("admin123", 12);
  const superadmin = await prisma.user.upsert({
    where: { email: "admin@tuagenda.com" },
    update: {},
    create: {
      email: "admin@tuagenda.com",
      name: "Super Admin",
      passwordHash: superadminHash,
      role: "SUPERADMIN",
    },
  });
  console.log("✅ Superadmin:", superadmin.email);

  // ─── Demo barbershop ──────────────────────────────────────────────────────
  const ownerHash = await hash("demo123", 12);

  const org = await prisma.organization.upsert({
    where: { slug: "barberia-demo" },
    update: {},
    create: {
      slug: "barberia-demo",
      name: "Barbería El Clásico",
      description: "La mejor barbería del barrio. Cortes clásicos y modernos.",
      primaryColor: "#18181b",
      accentColor: "#f59e0b",
      phone: "+54 11 1234-5678",
      address: "Av. Corrientes 1234, CABA",
      active: true,
      plan: "FREE",
      users: {
        create: {
          email: "owner@barberia.com",
          name: "Carlos Rodríguez",
          passwordHash: ownerHash,
          role: "OWNER",
        },
      },
    },
  });
  console.log("✅ Organization:", org.name, "→ /b/" + org.slug);

  // ─── Services ─────────────────────────────────────────────────────────────
  const serviceData = [
    { name: "Corte clásico", description: "Corte de cabello con tijera y máquina", durationMin: 30, price: 3500 },
    { name: "Arreglo de barba", description: "Perfilado y arreglo completo de barba", durationMin: 20, price: 2000 },
    { name: "Combo corte + barba", description: "Corte completo más arreglo de barba", durationMin: 50, price: 5000 },
  ];

  const services = [];
  for (const s of serviceData) {
    const existing = await prisma.service.findFirst({ where: { name: s.name, organizationId: org.id } });
    if (!existing) {
      services.push(await prisma.service.create({ data: { ...s, organizationId: org.id } }));
    } else {
      services.push(existing);
    }
  }
  console.log("✅ Services:", services.map((s) => s.name).join(", "));

  // ─── Staff ────────────────────────────────────────────────────────────────
  const staffData = [
    { name: "Carlos", bio: "10 años de experiencia. Especialista en cortes clásicos." },
    { name: "Martín", bio: "Experto en estilos modernos y degradados." },
  ];

  const staffMembers = [];
  for (const s of staffData) {
    const existing = await prisma.staff.findFirst({ where: { name: s.name, organizationId: org.id } });
    if (!existing) {
      staffMembers.push(await prisma.staff.create({ data: { ...s, organizationId: org.id } }));
    } else {
      staffMembers.push(existing);
    }
  }
  console.log("✅ Staff:", staffMembers.map((s) => s.name).join(", "));

  // ─── Work Schedules (Mon–Sat, 9am–7pm) ────────────────────────────────────
  const workDays = [1, 2, 3, 4, 5, 6]; // Mon to Sat
  for (const staff of staffMembers) {
    for (const day of workDays) {
      await prisma.workSchedule.upsert({
        where: { staffId_dayOfWeek: { staffId: staff.id, dayOfWeek: day } },
        update: {},
        create: {
          staffId: staff.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "19:00",
          enabled: true,
        },
      });
    }
  }
  console.log("✅ Work schedules configured (Mon–Sat 9:00–19:00)");

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Credentials:");
  console.log("  Superadmin → admin@tuagenda.com / admin123");
  console.log("  Barbershop owner → owner@barberia.com / demo123");
  console.log("  Public booking page → /b/barberia-demo");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
