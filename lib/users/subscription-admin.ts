import type { SubscriptionPaymentMode } from "./types";

/** Plans admins can attach to customer accounts (ids align with menu subscription demos where applicable). */
export type AdminSubscriptionPlanOption = {
  id: string;
  label: string;
  /** List price in GBP (admin reference). */
  priceGbp: number;
  /** Default length when opening the assign dialog (days from today). */
  defaultTermDays: number;
};

export const ADMIN_SUBSCRIPTION_PLANS: readonly AdminSubscriptionPlanOption[] = [
  {
    id: "demo-subscription-weekly",
    label: "Weekly office meals",
    priceGbp: 24.99,
    defaultTermDays: 30,
  },
  {
    id: "plan-monthly-flex",
    label: "Monthly flex dining",
    priceGbp: 34.99,
    defaultTermDays: 30,
  },
  {
    id: "plan-quarterly-corporate",
    label: "Quarterly corporate package",
    priceGbp: 219.99,
    defaultTermDays: 90,
  },
];

export const SUBSCRIPTION_PAYMENT_MODE_OPTIONS: readonly {
  value: SubscriptionPaymentMode;
  label: string;
}[] = [
  { value: "card", label: "Card" },
  { value: "direct_debit", label: "Direct debit" },
  { value: "invoice", label: "Invoice / PO" },
  { value: "bank_transfer", label: "Bank transfer" },
];

export function subscriptionPaymentModeLabel(
  mode: SubscriptionPaymentMode,
): string {
  return SUBSCRIPTION_PAYMENT_MODE_OPTIONS.find((o) => o.value === mode)
    ?.label ?? mode;
}

export function adminPlanLabel(planId: string): string {
  return (
    ADMIN_SUBSCRIPTION_PLANS.find((p) => p.id === planId)?.label ?? planId
  );
}

export function formatAdminPlanPriceGbp(planId: string): string {
  const n = ADMIN_SUBSCRIPTION_PLANS.find((p) => p.id === planId)?.priceGbp;
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return `£${n.toFixed(2)}`;
}

export function defaultExpiryForPlan(planId: string): string {
  const days =
    ADMIN_SUBSCRIPTION_PLANS.find((p) => p.id === planId)?.defaultTermDays ??
    30;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
