import { notFound } from "next/navigation";
import { connection } from "next/server";
import { OrderDetailView } from "@/components/orders/OrderDetailView";
import { OrderScreenBreadcrumbs } from "@/components/orders/OrderScreenBreadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { getRestaurantOrder } from "@/lib/orders-restaurant-data";

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  await connection();
  const { orderId } = await params;
  const order = getRestaurantOrder(orderId);
  if (!order) notFound();

  const archive = order.status === "completed" || order.status === "cancelled";

  return (
    <PageContainer
      breadcrumbs={
        <OrderScreenBreadcrumbs
          orderCode={order.code}
          ordersCrumb={archive ? { href: "/orders/history", label: "Order history" } : undefined}
        />
      }
      title={`Order #${order.code}`}
      description={
        <>
          Placed {order.placedAtLabel} · {order.serverName} (Server) · {order.venueLabel}
          {archive ? (
            <>
              {" "}
              · <span className="font-bold text-secondary">Read-only archive</span>
            </>
          ) : null}
        </>
      }
    >
      <OrderDetailView order={order} />
    </PageContainer>
  );
}
