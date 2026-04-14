import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { DriverOrdersTable } from "@/components/orders/DriverOrdersTable";
import { listDriverOrderSummaries } from "@/lib/driver-orders-data";

export default async function DriverOrdersPage() {
  await connection();
  const rows = listDriverOrderSummaries();

  return (
    <PageContainer
      title="Driver orders"
      description="Per-driver load from assigned delivery tickets: totals, open drops, completed count, and timing summary for delivered stops."
    >
      <DriverOrdersTable rows={rows} />
    </PageContainer>
  );
}
