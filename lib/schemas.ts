import { z } from "zod";

export const ServiceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  description: z.string().max(500).optional().nullable(),
  durationMin: z.number().int().min(5).max(480),
  price: z.number().min(0),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
  organizationId: z.string().cuid(),
});

export const ServicePatchSchema = ServiceSchema.partial().omit({ organizationId: true });

export const StaffSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  bio: z.string().max(500).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable().or(z.literal("")),
  maxAppointmentsPerDay: z.number().int().min(1).optional().nullable(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
  organizationId: z.string().cuid(),
});

export const StaffPatchSchema = StaffSchema.partial().omit({ organizationId: true });

export const WorkScheduleSchema = z.object({
  staffId: z.string().cuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido HH:MM"),
  enabled: z.boolean(),
  bufferMin: z.number().int().min(0).max(120).optional().default(0),
});

export const OrganizationCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  ownerEmail: z.string().email(),
  ownerPassword: z.string().min(8, "Mínimo 8 caracteres"),
  ownerName: z.string().optional(),
});

export const OrganizationPatchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional().nullable(),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  phone: z.string().max(30).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  instagramUrl: z.string().url().optional().nullable().or(z.literal("")),
  tiktokUrl: z.string().url().optional().nullable().or(z.literal("")),
  welcomeMessage: z.string().max(500).optional().nullable(),
  bookingConfirmationMessage: z.string().max(500).optional().nullable(),
  minAdvanceHours: z.number().int().min(0).max(168).optional(),
  maxDaysAhead: z.number().int().min(1).max(365).optional(),
  active: z.boolean().optional(),
  plan: z.enum(["FREE", "PRO", "PREMIUM"]).optional(),
});

export const AppointmentPatchSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  notes: z.string().max(500).optional().nullable(),
  paid: z.boolean().optional(),
});

export const BookingSchema = z.object({
  orgSlug: z.string().min(1),
  staffId: z.string().cuid(),
  serviceId: z.string().cuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  clientName: z.string().min(1).max(100),
  clientPhone: z.string().min(6).max(30),
  clientEmail: z.string().email().optional().nullable().or(z.literal("")),
  notes: z.string().max(500).optional().nullable(),
});

export const VacationBlockSchema = z.object({
  organizationId: z.string().cuid(),
  staffId: z.string().cuid().optional().nullable(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(200).optional().nullable(),
});
