import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { ReportStatGrid } from "@/components/reports/ReportStatGrid";
import { ReportsToolbar } from "@/components/reports/ReportsToolbar";
import { buildOrdersReportMetrics } from "@/lib/reports-sample-data";
import { listOrderHistory } from "@/lib/orders-restaurant-data";

export const metadata: Metadata = {
  title: "Orders report",
  description: "Aggregates from archived tickets — not a row-level ledger.",
};

export default function ReportsOrdersPage() {
  const orders = listOrderHistory();
  const { cards } = buildOrdersReportMetrics(orders);

  return (
    <PageContainer
      title="Orders analytics"
      description="Summaries from the same archive as Order history. Open History for ticket-level detail."
      actions={<ReportsToolbar />}
    >
      <div className="space-y-8">
        <ReportStatGrid cards={cards} />
        <Card className="p-6">
          <p className="text-sm font-medium text-on-surface-variant">
            For fulfillment-time and SLA metrics, pair this view with{" "}
            <span className="font-bold text-on-surface">Delivery performance</span> once live telemetry is wired.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
