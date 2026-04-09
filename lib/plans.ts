export type Plan = "FREE" | "PRO" | "PREMIUM";

export interface PlanLimits {
  maxStaff: number | null;          // null = ilimitado
  maxAppointmentsPerMonth: number | null;
  features: {
    customization: boolean;         // logo, colores, cover, redes
    vacationBlocks: boolean;
    revenueModule: boolean;
    revenueExport: boolean;
    whatsappNotifications: boolean;
  };
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    maxStaff: 1,
    maxAppointmentsPerMonth: 80,
    features: {
      customization: false,
      vacationBlocks: false,
      revenueModule: false,
      revenueExport: false,
      whatsappNotifications: false,
    },
  },
  PRO: {
    maxStaff: 4,
    maxAppointmentsPerMonth: null,
    features: {
      customization: true,
      vacationBlocks: true,
      revenueModule: true,
      revenueExport: false,
      whatsappNotifications: false,
    },
  },
  PREMIUM: {
    maxStaff: null,
    maxAppointmentsPerMonth: null,
    features: {
      customization: true,
      vacationBlocks: true,
      revenueModule: true,
      revenueExport: true,
      whatsappNotifications: true,
    },
  },
};

export const PLAN_LABELS: Record<Plan, string> = {
  FREE: "Free",
  PRO: "Pro",
  PREMIUM: "Premium",
};

export const PLAN_PRICES: Record<Plan, string> = {
  FREE: "Gratis",
  PRO: "USD 15/mes",
  PREMIUM: "USD 35/mes",
};

export function getLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[(plan as Plan) ?? "FREE"] ?? PLAN_LIMITS.FREE;
}

export function hasFeature(plan: string, feature: keyof PlanLimits["features"]): boolean {
  return getLimits(plan).features[feature];
}
