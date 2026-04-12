import { connection } from "next/server";
import { Suspense } from "react";
import { AssignOrdersClient } from "@/components/delivery/AssignOrdersClient";
import {
  listDeliveryAgents,
  listDeliveryOpsOrders,
} from "@/lib/delivery-ops-data";

export default async function DeliveryAssignPage() {
  await connection();
  const orders = listDeliveryOpsOrders();
  const agents = listDeliveryAgents();

  return (
    <Suspense
      fallback={
        <div className="rounded-xl bg-surface-container-lowest p-10 text-center text-sm font-medium text-secondary ring-1 ring-outline-variant/10">
          Loading assign orders…
        </div>
      }
    >
      <AssignOrdersClient initialOrders={orders} agents={agents} />
    </Suspense>
  );
}
