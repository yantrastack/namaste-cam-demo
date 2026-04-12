import type { RestaurantOrderRecord } from "@/lib/orders-restaurant-data";

const STORAGE_KEY = "nc-order-archives-v1";

export const ORDER_ARCHIVES_EVENT = "nc-order-archives";

export function readOrderArchivesMap(): Record<string, RestaurantOrderRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, RestaurantOrderRecord>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeOrderArchive(record: RestaurantOrderRecord) {
  const next = { ...readOrderArchivesMap(), [record.id]: record };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(ORDER_ARCHIVES_EVENT));
}

/** Past orders from server plus any completed/cancelled copies saved from this browser (e.g. admin cancel). */
export function mergeOrderHistoryWithArchives(
  serverOrders: RestaurantOrderRecord[],
  archives: Record<string, RestaurantOrderRecord>,
): RestaurantOrderRecord[] {
  const map = new Map(serverOrders.map((o) => [o.id, o]));
  for (const rec of Object.values(archives)) {
    if (rec.status === "completed" || rec.status === "cancelled") {
      map.set(rec.id, rec);
    }
  }
  return [...map.values()];
}

/** Hide live tickets that were closed in this session (archive wins over seed). */
export function filterActiveOrdersWithArchives(
  serverActive: RestaurantOrderRecord[],
  archives: Record<string, RestaurantOrderRecord>,
): RestaurantOrderRecord[] {
  return serverActive.filter((o) => {
    const a = archives[o.id];
    if (!a) return true;
    return a.status !== "cancelled" && a.status !== "completed";
  });
}
