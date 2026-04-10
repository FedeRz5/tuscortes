import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.MIGRATE_URL ?? process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Helpers ──────────────────────────────────────────────────────────────────
function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function addMinutes(time: string, min: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + min;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

async function main() {
  console.log("🌱 Seeding database...");

  const SUPERADMIN_EMAIL    = process.env.SEED_SUPERADMIN_EMAIL    ?? "admin@tuagenda.com";
  const SUPERADMIN_PASSWORD = process.env.SEED_SUPERADMIN_PASSWORD ?? "admin123";
  const DEMO_EMAIL          = process.env.SEED_DEMO_EMAIL          ?? "owner@ramoscutz.com";
  const DEMO_PASSWORD       = process.env.SEED_DEMO_PASSWORD       ?? "demo123";

  // ─── Superadmin ───────────────────────────────────────────────────────────
  const superadminHash = await hash(SUPERADMIN_PASSWORD, 12);
  const superadmin = await prisma.user.upsert({
    where: { email: SUPERADMIN_EMAIL },
    update: {},
    create: {
      email: SUPERADMIN_EMAIL,
      name: "Super Admin",
      passwordHash: superadminHash,
      role: "SUPERADMIN",
    },
  });
  console.log("✅ Superadmin:", superadmin.email);

  // ─── Ramos Cutz ───────────────────────────────────────────────────────────
  const ownerHash = await hash(DEMO_PASSWORD, 12);

  const org = await prisma.organization.upsert({
    where: { slug: "ramos-cutz" },
    update: {},
    create: {
      slug: "ramos-cutz",
      name: "Ramos Cutz",
      description: "Barbería premium en el corazón del barrio. Cortes modernos, clásicos y tratamientos de barba a cargo de los mejores en el rubro.",
      primaryColor: "#111827",
      accentColor: "#f59e0b",
      phone: "+54 11 5131-2610",
      address: "Av. Santa Fe 3421, Palermo, CABA",
      instagramUrl: "https://instagram.com/ramoscutz",
      tiktokUrl: "https://tiktok.com/@ramoscutz",
      welcomeMessage: "Bienvenido a Ramos Cutz. Elegí tu barbero, servicio y el horario que mejor te quede. Sin esperas, sin llamadas.",
      bookingConfirmationMessage: "¡Turno confirmado! Te esperamos puntual. Si necesitás cancelar, hacelo con al menos 2 horas de anticipación.",
      minAdvanceHours: 1,
      maxDaysAhead: 30,
      active: true,
      plan: "PRO",
      users: {
        create: {
          email: DEMO_EMAIL,
          name: "Ramiro Ramos",
          passwordHash: ownerHash,
          role: "OWNER",
        },
      },
    },
  });
  console.log("✅ Organization:", org.name, "→ /b/" + org.slug);

  // ─── Services ─────────────────────────────────────────────────────────────
  const serviceData = [
    { name: "Corte clásico",      description: "Corte de cabello con tijera y máquina. Incluye lavado y styling.",      durationMin: 30, price: 4500,  featured: true,  order: 0 },
    { name: "Fade / Degradado",   description: "Degradado skin fade o low fade, el favorito del momento.",              durationMin: 40, price: 5500,  featured: true,  order: 1 },
    { name: "Corte + Barba",      description: "Combo completo: corte a elección más arreglo y perfilado de barba.",    durationMin: 55, price: 7500,  featured: false, order: 2 },
    { name: "Arreglo de barba",   description: "Perfilado, definición de líneas y terminación con aceite de barba.",    durationMin: 20, price: 3000,  featured: false, order: 3 },
    { name: "Corte infantil",     description: "Corte para chicos hasta 12 años. Paciencia y buen resultado.",          durationMin: 25, price: 3500,  featured: false, order: 4 },
    { name: "Cejas",              description: "Depilación y definición de cejas con hilo o cera.",                     durationMin: 15, price: 1500,  featured: false, order: 5 },
  ];

  const services: { id: string; durationMin: number; name: string }[] = [];
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
    {
      name: "Ramiro",
      bio: "Dueño y maestro barbero con 12 años de experiencia. Especialista en fades y cortes clásicos con navaja.",
      order: 0,
    },
    {
      name: "Diego",
      bio: "Experto en estilos modernos y diseños. Hace los mejores degradados del barrio.",
      order: 1,
    },
    {
      name: "Nico",
      bio: "Barbero especializado en barba y tratamientos. Mano suave y ojo para el detalle.",
      order: 2,
    },
  ];

  const staffMembers: { id: string; name: string }[] = [];
  for (const s of staffData) {
    const existing = await prisma.staff.findFirst({ where: { name: s.name, organizationId: org.id } });
    if (!existing) {
      staffMembers.push(await prisma.staff.create({ data: { ...s, organizationId: org.id } }));
    } else {
      staffMembers.push(existing);
    }
  }
  console.log("✅ Staff:", staffMembers.map((s) => s.name).join(", "));

  // ─── Work Schedules ───────────────────────────────────────────────────────
  // Ramiro: Lun-Sáb 9:00-19:00
  // Diego:  Mar-Dom 10:00-20:00
  // Nico:   Lun-Vie 9:00-18:00, bufferMin 10
  const schedules = [
    { staffIdx: 0, days: [1,2,3,4,5,6], start: "09:00", end: "19:00", buffer: 0 },
    { staffIdx: 1, days: [2,3,4,5,6,0], start: "10:00", end: "20:00", buffer: 0 },
    { staffIdx: 2, days: [1,2,3,4,5],   start: "09:00", end: "18:00", buffer: 10 },
  ];

  for (const sched of schedules) {
    const staff = staffMembers[sched.staffIdx];
    for (const day of sched.days) {
      await prisma.workSchedule.upsert({
        where: { staffId_dayOfWeek: { staffId: staff.id, dayOfWeek: day } },
        update: {},
        create: {
          staffId: staff.id,
          dayOfWeek: day,
          startTime: sched.start,
          endTime: sched.end,
          bufferMin: sched.buffer,
          enabled: true,
        },
      });
    }
  }
  console.log("✅ Work schedules configured");

  // ─── Appointments ─────────────────────────────────────────────────────────
  // Solo crear si no existen (evitar duplicados en re-run)
  const existingApts = await prisma.appointment.count({ where: { organizationId: org.id } });
  if (existingApts > 0) {
    console.log("⏭️  Appointments already seeded, skipping.");
  } else {
    const clientNames = [
      "Lucas Pereyra", "Matías Gómez", "Tomás Herrera", "Agustín López",
      "Franco Díaz", "Sebastián Rojas", "Nicolás Castro", "Ezequiel Morales",
      "Bruno Fernández", "Santiago Acosta", "Leandro Vargas", "Rodrigo Suárez",
      "Facundo Benítez", "Maximiliano Ríos", "Joaquín Flores",
    ];
    const clientPhones = [
      "11 4523-1234", "11 6789-4321", "11 5512-8765", "11 4301-2345",
      "11 6612-3456", "11 7234-5678", "11 4456-7890", "11 5678-9012",
      "11 3456-0123", "11 2345-1234", "11 8901-2345", "11 9012-3456",
      "11 0123-4567", "11 1234-5678", "11 2345-6789",
    ];

    // Slots de mañana / tarde
    const morningSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
    const afternoonSlots = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

    let clientIdx = 0;
    let aptCount = 0;

    const pastAptData: Array<{
      date: string; staffIdx: number; serviceIdx: number;
      slotIdx: number; slots: string[]; status: string; paid: boolean;
    }> = [
      // 6 días atrás
      { date: dateOffset(-6), staffIdx: 0, serviceIdx: 0, slotIdx: 0, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-6), staffIdx: 0, serviceIdx: 2, slotIdx: 2, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-6), staffIdx: 1, serviceIdx: 1, slotIdx: 0, slots: afternoonSlots, status: "COMPLETED", paid: true },
      { date: dateOffset(-6), staffIdx: 2, serviceIdx: 3, slotIdx: 1, slots: morningSlots,   status: "COMPLETED", paid: false },
      // 5 días atrás
      { date: dateOffset(-5), staffIdx: 0, serviceIdx: 1, slotIdx: 1, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-5), staffIdx: 1, serviceIdx: 0, slotIdx: 2, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-5), staffIdx: 1, serviceIdx: 2, slotIdx: 0, slots: afternoonSlots, status: "COMPLETED", paid: true },
      { date: dateOffset(-5), staffIdx: 2, serviceIdx: 5, slotIdx: 3, slots: morningSlots,   status: "CANCELLED", paid: false },
      // 4 días atrás
      { date: dateOffset(-4), staffIdx: 0, serviceIdx: 0, slotIdx: 0, slots: afternoonSlots, status: "COMPLETED", paid: true },
      { date: dateOffset(-4), staffIdx: 0, serviceIdx: 3, slotIdx: 2, slots: afternoonSlots, status: "COMPLETED", paid: true },
      { date: dateOffset(-4), staffIdx: 1, serviceIdx: 1, slotIdx: 1, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-4), staffIdx: 2, serviceIdx: 2, slotIdx: 3, slots: afternoonSlots, status: "COMPLETED", paid: false },
      // 3 días atrás
      { date: dateOffset(-3), staffIdx: 0, serviceIdx: 2, slotIdx: 0, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-3), staffIdx: 1, serviceIdx: 0, slotIdx: 2, slots: afternoonSlots, status: "COMPLETED", paid: true },
      { date: dateOffset(-3), staffIdx: 2, serviceIdx: 1, slotIdx: 1, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-3), staffIdx: 2, serviceIdx: 4, slotIdx: 3, slots: morningSlots,   status: "COMPLETED", paid: true },
      // 2 días atrás
      { date: dateOffset(-2), staffIdx: 0, serviceIdx: 1, slotIdx: 0, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-2), staffIdx: 0, serviceIdx: 0, slotIdx: 2, slots: afternoonSlots, status: "COMPLETED", paid: true },
      { date: dateOffset(-2), staffIdx: 1, serviceIdx: 2, slotIdx: 1, slots: morningSlots,   status: "COMPLETED", paid: true },
      // Ayer
      { date: dateOffset(-1), staffIdx: 0, serviceIdx: 0, slotIdx: 0, slots: morningSlots,   status: "COMPLETED", paid: true },
      { date: dateOffset(-1), staffIdx: 0, serviceIdx: 3, slotIdx: 2, slots: morningSlots,   status: "COMPLETED", paid: false },
      { date: dateOffset(-1), staffIdx: 1, serviceIdx: 1, slotIdx: 1, slots: afternoonSlots, status: "COMPLETED", paid: true },
      { date: dateOffset(-1), staffIdx: 2, serviceIdx: 2, slotIdx: 3, slots: afternoonSlots, status: "COMPLETED", paid: true },
    ];

    const futureAptData: Array<{
      date: string; staffIdx: number; serviceIdx: number;
      slotIdx: number; slots: string[]; status: string; paid: boolean;
    }> = [
      // Hoy
      { date: dateOffset(0), staffIdx: 0, serviceIdx: 0, slotIdx: 0, slots: morningSlots,   status: "CONFIRMED", paid: false },
      { date: dateOffset(0), staffIdx: 0, serviceIdx: 2, slotIdx: 2, slots: morningSlots,   status: "CONFIRMED", paid: false },
      { date: dateOffset(0), staffIdx: 1, serviceIdx: 1, slotIdx: 0, slots: afternoonSlots, status: "CONFIRMED", paid: false },
      { date: dateOffset(0), staffIdx: 2, serviceIdx: 3, slotIdx: 1, slots: morningSlots,   status: "PENDING",   paid: false },
      // Mañana
      { date: dateOffset(1), staffIdx: 0, serviceIdx: 1, slotIdx: 0, slots: morningSlots,   status: "CONFIRMED", paid: false },
      { date: dateOffset(1), staffIdx: 1, serviceIdx: 0, slotIdx: 1, slots: afternoonSlots, status: "CONFIRMED", paid: false },
      { date: dateOffset(1), staffIdx: 2, serviceIdx: 2, slotIdx: 2, slots: morningSlots,   status: "PENDING",   paid: false },
      // +2 días
      { date: dateOffset(2), staffIdx: 0, serviceIdx: 2, slotIdx: 0, slots: afternoonSlots, status: "CONFIRMED", paid: false },
      { date: dateOffset(2), staffIdx: 1, serviceIdx: 1, slotIdx: 1, slots: morningSlots,   status: "PENDING",   paid: false },
      // +3 días
      { date: dateOffset(3), staffIdx: 0, serviceIdx: 0, slotIdx: 2, slots: morningSlots,   status: "CONFIRMED", paid: false },
      { date: dateOffset(3), staffIdx: 2, serviceIdx: 3, slotIdx: 0, slots: afternoonSlots, status: "PENDING",   paid: false },
      // +5 días
      { date: dateOffset(5), staffIdx: 1, serviceIdx: 2, slotIdx: 1, slots: morningSlots,   status: "CONFIRMED", paid: false },
      { date: dateOffset(5), staffIdx: 0, serviceIdx: 1, slotIdx: 3, slots: afternoonSlots, status: "CONFIRMED", paid: false },
    ];

    for (const apt of [...pastAptData, ...futureAptData]) {
      const staff = staffMembers[apt.staffIdx];
      const service = services[apt.serviceIdx];
      const startTime = apt.slots[apt.slotIdx];
      const endTime = addMinutes(startTime, service.durationMin);
      const client = clientNames[clientIdx % clientNames.length];
      const phone = clientPhones[clientIdx % clientPhones.length];
      clientIdx++;

      await prisma.appointment.create({
        data: {
          organizationId: org.id,
          staffId: staff.id,
          serviceId: service.id,
          date: apt.date,
          startTime,
          endTime,
          clientName: client,
          clientPhone: phone,
          status: apt.status,
          paid: apt.paid,
        },
      });
      aptCount++;
    }
    console.log(`✅ ${aptCount} appointments created`);
  }

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Credentials:");
  console.log(`  Superadmin    → ${SUPERADMIN_EMAIL}  / ${SUPERADMIN_PASSWORD}`);
  console.log(`  Ramos Cutz    → ${DEMO_EMAIL}  / ${DEMO_PASSWORD}`);
  console.log("  Página pública → /b/ramos-cutz");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
