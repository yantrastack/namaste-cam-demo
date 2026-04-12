import Link from "next/link";
import { connection } from "next/server";
import { MaterialIcon } from "@/components/MaterialIcon";
import { ActiveOrdersClient } from "@/components/orders/ActiveOrdersClient";
import { PageContainer } from "@/components/layout/PageContainer";
import { cn } from "@/lib/cn";
import { listActiveRestaurantOrders } from "@/lib/orders-restaurant-data";

export default async function OrdersPage() {
  await connection();
  const orders = listActiveRestaurantOrders();

  return (
    <PageContainer
      title="Active orders"
      description="Live restaurant tickets, search, and hand-off to the bill editor."
      actions={
        <Link
          href="/orders/create"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold shadow-md transition-all active:scale-95",
            "bg-primary text-on-primary shadow-primary-soft hover:bg-primary/90",
          )}
        >
          <MaterialIcon name="add" className="text-xl" />
          New order
        </Link>
      }
    >
      <ActiveOrdersClient orders={orders} />
    </PageContainer>
  );
}
