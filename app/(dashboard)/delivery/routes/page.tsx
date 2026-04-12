import { connection } from "next/server";
import { DeliveryRoutesClient } from "@/components/delivery/DeliveryRoutesClient";
import {
  buildDeliveryRoutePlans,
  listDeliveryOpsOrders,
} from "@/lib/delivery-ops-data";

export default async function DeliveryRoutesPage() {
  await connection();
  const orders = listDeliveryOpsOrders();
  const plans = buildDeliveryRoutePlans(orders);

  return <DeliveryRoutesClient initialPlans={plans} />;
}
