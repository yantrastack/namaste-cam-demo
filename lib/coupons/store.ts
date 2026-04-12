import seed from "@/data/coupon-promotions.json";
import type { Coupon, CouponPromotionsSeed, ScheduledCampaign } from "./types";

const STORAGE_KEY = "namaste-cam-coupon-store-v1";

export type CouponStoreState = {
  coupons: Coupon[];
  campaigns: ScheduledCampaign[];
};

const initial: CouponStoreState = {
  coupons: (seed as CouponPromotionsSeed).coupons,
  campaigns: (seed as CouponPromotionsSeed).campaigns,
};

function cloneSeed(): CouponStoreState {
  return JSON.parse(JSON.stringify(initial)) as CouponStoreState;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadCouponStore(): CouponStoreState {
  if (!isBrowser()) return cloneSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return cloneSeed();
    }
    const parsed = JSON.parse(raw) as CouponStoreState;
    if (!Array.isArray(parsed.coupons) || !Array.isArray(parsed.campaigns)) {
      return cloneSeed();
    }
    return parsed;
  } catch {
    return cloneSeed();
  }
}

export function saveCouponStore(next: CouponStoreState): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function resetCouponStore(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function newCouponId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `c-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function slugCodeFromTitle(title: string): string {
  const base = title
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 10);
  return base || "OFFER";
}
