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
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tuscortes.com";
  const title = `${org.name} — Reservar turno`;
  const description = org.description ?? `Reservá tu turno en ${org.name}`;
  const url = `${APP_URL}/b/${slug}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: org.name,
      locale: "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params;

  const org = await prisma.organization.findUnique({
    where: { slug, active: true },
    include: {
      services: { where: { active: true }, orderBy: [{ featured: "desc" }, { order: "asc" }] },
      staff: {
        where: { active: true },
        include: { schedules: { where: { enabled: true } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!org) notFound();

  return <BookingWizard org={org} />;
}
