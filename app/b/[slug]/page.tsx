import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { BookingWizard } from "./booking-wizard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const org = await prisma.organization.findUnique({ where: { slug, active: true } });
  if (!org) return { title: "No encontrado" };
  return {
    title: `${org.name} — Reservar turno`,
    description: org.description ?? `Reservá tu turno en ${org.name}`,
  };
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params;

  const org = await prisma.organization.findUnique({
    where: { slug, active: true },
    include: {
      services: { where: { active: true }, orderBy: { name: "asc" } },
      staff: {
        where: { active: true },
        include: { schedules: { where: { enabled: true } } },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!org) notFound();

  return <BookingWizard org={org} />;
}
