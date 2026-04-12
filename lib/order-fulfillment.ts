import type { OrderStatus } from "@/lib/orders-restaurant-data";

/** Four milestones shown on the order detail timeline (matches reference UI). */
export const FULFILLMENT_STEPS = [
  { id: "confirmed", label: "Confirmed", icon: "check" as const },
  { id: "preparing", label: "Preparing", icon: "restaurant" as const },
  { id: "ready", label: "Ready", icon: "shopping_bag" as const },
  { id: "completed", label: "Completed", icon: "task_alt" as const },
] as const;

export type FulfillmentProgress = 0 | 1 | 2 | 3 | 4;

const STORAGE_KEY_V2 = "nc-order-fulfillment-v2:";

export type FulfillmentSnapshot = {
  progress: FulfillmentProgress;
  /** Display time per milestone index (0–3). */
  times: [string, string, string, string];
};

export function fulfillmentSnapshotKey(orderId: string) {
  return `${STORAGE_KEY_V2}${orderId}`;
}

/** Map persisted order status to default timeline progress (0 = none done, 4 = all done). */
export function statusToFulfillmentProgress(status: OrderStatus): FulfillmentProgress {
  switch (status) {
    case "draft":
      return 0;
    case "active":
      return 1;
    case "preparing":
      return 2;
    case "ready":
      return 3;
    case "completed":
      return 4;
    case "cancelled":
      return 0;
    default:
      return 0;
  }
}

/** Reverse map: progress → canonical status for list filtering / badges. */
export function fulfillmentProgressToStatus(progress: FulfillmentProgress): OrderStatus {
  if (progress <= 0) return "draft";
  if (progress === 1) return "active";
  if (progress === 2) return "preparing";
  if (progress === 3) return "ready";
  return "completed";
}

export function buildInitialSnapshot(
  _orderId: string,
  status: OrderStatus,
  placedAtLabel: string,
): FulfillmentSnapshot {
  const progress = statusToFulfillmentProgress(status);
  const times: FulfillmentSnapshot["times"] = ["—", "—", "—", "—"];
  for (let i = 0; i < progress && i < 4; i++) {
    times[i] = i === 0 ? placedAtLabel : "—";
  }
  return { progress, times };
}

export function readFulfillmentSnapshot(orderId: string): FulfillmentSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(fulfillmentSnapshotKey(orderId));
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<FulfillmentSnapshot>;
    if (typeof data.progress !== "number" || data.progress < 0 || data.progress > 4) return null;
    if (!Array.isArray(data.times) || data.times.length !== 4) return null;
    return {
      progress: data.progress as FulfillmentProgress,
      times: data.times as FulfillmentSnapshot["times"],
    };
  } catch {
    return null;
  }
}

export function writeFulfillmentSnapshot(orderId: string, snapshot: FulfillmentSnapshot) {
  try {
    window.sessionStorage.setItem(fulfillmentSnapshotKey(orderId), JSON.stringify(snapshot));
  } catch {
    /* ignore */
  }
}

/** Apply a new progress level (forward or back), adjusting milestone timestamps. */
export function snapshotWithProgress(
  prev: FulfillmentSnapshot,
  nextProgress: FulfillmentProgress,
  placedAtLabel: string,
): FulfillmentSnapshot {
  const times = [...prev.times] as string[];

  if (nextProgress === 0) {
    return { progress: 0, times: ["—", "—", "—", "—"] };
  }

  if (nextProgress < prev.progress) {
    for (let i = nextProgress; i < 4; i++) {
      times[i] = "—";
    }
    return { progress: nextProgress, times: times as FulfillmentSnapshot["times"] };
  }

  if (nextProgress > prev.progress) {
    for (let i = prev.progress; i < nextProgress && i < 4; i++) {
      const empty = !times[i]?.trim() || times[i] === "—";
      if (empty) {
        times[i] =
          i === 0
            ? placedAtLabel
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
    }
  }

  return { progress: nextProgress, times: times as FulfillmentSnapshot["times"] };
}

/** Progress bar width: 0–100 across the three segments between four nodes. */
export function fulfillmentLinePercent(progress: FulfillmentProgress) {
  if (progress >= 4) return 100;
  return (progress / 3) * 100;
}
