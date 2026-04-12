import type { Coupon } from "./types";

export function formatCouponValue(c: Coupon): string {
  if (c.type === "percentage" && c.percentOff != null) return `${c.percentOff}%`;
  if (c.type === "fixed_amount" && c.fixedAmount != null)
    return `£${c.fixedAmount.toFixed(2)}`;
  if (c.type === "product_bundle")
    return c.freeItemLabel?.trim() ? c.freeItemLabel : "Free gift";
  return "—";
}

export function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
