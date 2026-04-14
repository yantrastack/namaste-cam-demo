import { connection } from "next/server";
import { DeliveryOverviewClient } from "@/components/delivery/DeliveryOverviewClient";
import { listDeliveryOpsOrders } from "@/lib/delivery-ops-data";

export default async function DeliveryOverviewPage() {
  await connection();
  const orders = listDeliveryOpsOrders();

  return <DeliveryOverviewClient orders={orders} />;
}
