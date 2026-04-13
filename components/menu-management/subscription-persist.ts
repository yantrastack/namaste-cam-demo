import type { SubscriptionMenuRecord } from "./initial-demo-subscriptions";

const STORAGE_KEY = "namaste-cam-demo-subscriptions-v1";

function isRecord(value: unknown): value is SubscriptionMenuRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.active === "boolean" &&
    typeof r.createdAt === "number" &&
    r.menu !== null &&
    typeof r.menu === "object" &&
    Array.isArray((r.menu as { sections?: unknown }).sections)
  );
}

export function loadPersistedSubscriptions(): SubscriptionMenuRecord[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const out = parsed.filter(isRecord);
    return out;
  } catch {
    return null;
  }
}

export function savePersistedSubscriptions(records: SubscriptionMenuRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* quota or private mode */
  }
}
