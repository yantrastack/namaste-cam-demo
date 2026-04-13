import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { OrderBillEditorClient } from "@/components/orders/OrderBillEditorClient";
import { PageContainer } from "@/components/layout/PageContainer";
import { emptyDraftOrder } from "@/lib/orders-restaurant-data";

export default function OrderCreatePage() {
  const draft = emptyDraftOrder();

  return (
    <PageContainer
      breadcrumbs={
        <nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
          <Link href="/dashboard" className="transition-colors hover:text-primary">
            Admin
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" />
          <Link href="/orders" className="transition-colors hover:text-primary">
            Orders
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" />
          <span className="text-primary">Create order</span>
        </nav>
      }
      title="Create order"
      description="Add guests, build the ticket from the catalog, and reconcile split payments."
    >
      <OrderBillEditorClient mode="create" initial={draft} />
    </PageContainer>
  );
}
