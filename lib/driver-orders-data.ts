import {
  formatKitchenToDoorSummary,
  listDeliveryAgents,
  listDeliveryOpsOrders,
  type DeliveryOrder,
} from "@/lib/delivery-ops-data";

/** Sample login emails aligned with `listDeliveryAgents()` seed IDs. */
const DRIVER_EMAIL_BY_AGENT_ID: Record<string, string> = {
  "ag-raj": "rajesh.kumar@namastecam.example",
  "ag-amy": "amy.okonkwo@namastecam.example",
  "ag-li": "li.wei@namastecam.example",
  "ag-sam": "sam.brooks@namastecam.example",
};

export type DriverOrderSummary = {
  agentId: string;
  name: string;
  email: string;
  /** Orders currently or historically assigned to this driver in the sample set. */
  total: number;
  /** Assigned + out for delivery. */
  yetToDeliver: number;
  delivered: number;
  /** Human line for completed drops (timing vs SLA), or null when none. */
  deliveredDetails: string | null;
};

function emailForAgent(agentId: string, name: string): string {
  return (
    DRIVER_EMAIL_BY_AGENT_ID[agentId] ??
    `${name.toLowerCase().replace(/\s+/g, ".")}@namastecam.example`
  );
}

function summarizeDelivered(orders: DeliveryOrder[]): string | null {
  const delivered = orders.filter((o) => o.dispatchStatus === "delivered");
  if (delivered.length === 0) return null;

  const timed = delivered.filter(
    (o) =>
      o.kitchenToDoorMinutes != null && o.promisedKitchenToDoorMinutes != null,
  );
  if (timed.length === 0) {
    return `${delivered.length} completed drop${delivered.length === 1 ? "" : "s"}`;
  }

  const avgMins = Math.round(
    timed.reduce((s, o) => s + (o.kitchenToDoorMinutes ?? 0), 0) / timed.length,
  );
  let onTime = 0;
  for (const o of timed) {
    const a = o.kitchenToDoorMinutes!;
    const p = o.promisedKitchenToDoorMinutes!;
    if (a <= p) onTime++;
  }
  const example = timed[0]!;
  const lastLine = formatKitchenToDoorSummary(
    example.kitchenToDoorMinutes,
    example.promisedKitchenToDoorMinutes,
  );
  const onTimeLabel = `${onTime}/${timed.length} on time`;
  return lastLine
    ? `Avg ${avgMins} min · ${onTimeLabel} · latest: ${lastLine}`
    : `Avg ${avgMins} min · ${onTimeLabel}`;
}

export function listDriverOrderSummaries(): DriverOrderSummary[] {
  const agents = listDeliveryAgents();
  const orders = listDeliveryOpsOrders();

  return agents.map((a) => {
    const mine = orders.filter((o) => o.assignedAgentId === a.id);
    const yetToDeliver = mine.filter(
      (o) => o.dispatchStatus === "assigned" || o.dispatchStatus === "en_route",
    ).length;
    const delivered = mine.filter((o) => o.dispatchStatus === "delivered").length;
    return {
      agentId: a.id,
      name: a.name,
      email: emailForAgent(a.id, a.name),
      total: mine.length,
      yetToDeliver,
      delivered,
      deliveredDetails: summarizeDelivered(mine),
    };
  });
}
