import { connection } from "next/server";
import { Suspense } from "react";
import { DeliveryRoutesClient } from "@/components/delivery/DeliveryRoutesClient";
import {
  buildDeliveryRoutePlans,
  listDeliveryOpsOrders,
} from "@/lib/delivery-ops-data";

export default async function DeliveryRoutesPage() {
  await connection();
  const orders = listDeliveryOpsOrders();
  const plans = buildDeliveryRoutePlans(orders);

  return (
    <Suspense
      fallback={
        <div className="-m-6 flex min-h-[calc(100dvh-7.5rem)] items-center justify-center p-6">
          <div className="rounded-xl bg-surface-container-lowest p-10 text-center text-sm font-medium text-secondary ring-1 ring-outline-variant/10">
            Loading routes…
          </div>
        </div>
      }
    >
      <DeliveryRoutesClient initialPlans={plans} />
    </Suspense>
  );
}
