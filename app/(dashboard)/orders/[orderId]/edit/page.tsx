import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { OrderBillEditorClient } from "@/components/orders/OrderBillEditorClient";
import { OrderScreenBreadcrumbs } from "@/components/orders/OrderScreenBreadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { getRestaurantOrder } from "@/lib/orders-restaurant-data";

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderEditPage({ params }: Props) {
  await connection();
  const { orderId } = await params;
  const order = getRestaurantOrder(orderId);
  if (!order) notFound();
  if (order.status === "completed" || order.status === "cancelled") {
    redirect(`/orders/${orderId}`);
  }

  return (
    <PageContainer
      breadcrumbs={<OrderScreenBreadcrumbs orderCode={order.code} tail="Edit" />}
      title={`Edit order #${order.code}`}
      description="Adjust line items, tax presentation, discounts, and split payments before closing the bill."
    >
      <OrderBillEditorClient mode="edit" initial={order} />
    </PageContainer>
  );
}
