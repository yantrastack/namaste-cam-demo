import { connection } from "next/server";
import { OrderHistoryClient } from "@/components/orders/OrderHistoryClient";
import { PageContainer } from "@/components/layout/PageContainer";
import { listOrderHistory } from "@/lib/orders-restaurant-data";

export default async function OrdersHistoryPage() {
  await connection();
  const orders = listOrderHistory();

  return (
    <PageContainer
      title="Order history"
      description="Completed and cancelled tickets, settlement type, closed time, and return-payment flags. Open a row to view the archive (not editable)."
    >
      <OrderHistoryClient orders={orders} />
    </PageContainer>
  );
}
