import { connection } from "next/server";
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardKpiGrid } from "@/components/dashboard/DashboardKpiGrid";
import { OrdersTrendPanel } from "@/components/dashboard/OrdersTrendPanel";
import { RevenueByCategoryPanel } from "@/components/dashboard/RevenueByCategoryPanel";
import { Card } from "@/components/ui/Card";
import { ReportsToolbar } from "@/components/reports/ReportsToolbar";
import { buildSalesReportFromDashboard } from "@/lib/reports-sample-data";

export const metadata: Metadata = {
  title: "Sales report",
  description: "Revenue and order trend for the selected period.",
};

export default async function ReportsSalesPage() {
  await connection();
  const data = buildSalesReportFromDashboard();

  return (
    <PageContainer
      title="Sales & revenue"
      description="Uses the same sample generator as the dashboard KPIs and charts (demo data)."
      actions={<ReportsToolbar />}
    >
      <div className="space-y-10">
        <DashboardKpiGrid kpis={data.kpis} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <OrdersTrendPanel className="lg:col-span-2" current={data.trendCurrent} previous={data.trendPrevious} />
          <RevenueByCategoryPanel rows={data.revenueCategories} insight={data.insight} />
        </div>
        <Card className="p-6">
          <p className="text-sm font-medium text-on-surface-variant">
            <span className="font-bold text-on-surface">Note:</span> Settlement and payout detail will move to
            Payments once that module is populated; this view stays focused on commercial performance.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
