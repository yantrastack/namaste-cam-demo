import { connection } from "next/server";
import { OrderViewActionClient } from "@/components/orders/OrderViewActionClient";
import { OrderScreenBreadcrumbs } from "@/components/orders/OrderScreenBreadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { listDriverOrderSummaries } from "@/lib/driver-orders-data";
import { buildDeliveryRoutePlans, listDeliveryOpsOrders } from "@/lib/delivery-ops-data";
import { listActiveRestaurantOrders } from "@/lib/orders-restaurant-data";

export default async function OrdersViewActionPage() {
  await connection();

  const orders = listActiveRestaurantOrders();
  const deliveryOrders = listDeliveryOpsOrders();
  const driverOrders = listDriverOrderSummaries();
  const routePlans = buildDeliveryRoutePlans(deliveryOrders);

  return (
    <PageContainer
      breadcrumbs={<OrderScreenBreadcrumbs orderCode="Ops cockpit" />}
      title="View / action orders"
      description="Single-screen admin cockpit for staffing, delivery pressure, payment mix, routing, and detailed order actioning."
    >
      <OrderViewActionClient
        orders={orders}
        deliveryOrders={deliveryOrders}
        driverOrders={driverOrders}
        routePlans={routePlans}
      />
    </PageContainer>
  );
}
