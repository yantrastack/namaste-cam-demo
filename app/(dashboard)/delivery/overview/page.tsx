import { connection } from "next/server";
import { DeliveryOverviewClient } from "@/components/delivery/DeliveryOverviewClient";
import {
  computeDeliveryAreaStats,
  listDeliveryOpsOrders,
} from "@/lib/delivery-ops-data";

export default async function DeliveryOverviewPage() {
  await connection();
  const orders = listDeliveryOpsOrders();
  const rows = computeDeliveryAreaStats(orders);

  return <DeliveryOverviewClient rows={rows} />;
}
