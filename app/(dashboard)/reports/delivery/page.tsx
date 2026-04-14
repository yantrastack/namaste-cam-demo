import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { ReportsToolbar } from "@/components/reports/ReportsToolbar";
import { getDeliveryPerformanceSample } from "@/lib/reports-sample-data";

export const metadata: Metadata = {
  title: "Delivery report",
  description: "Retrospective delivery KPIs (sample).",
};

export default function ReportsDeliveryPage() {
  const d = getDeliveryPerformanceSample();

  return (
    <PageContainer
      title="Delivery performance"
      description="Contrasts with Assign orders and Optimized routes, which focus on live planning."
      actions={<ReportsToolbar />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">On-time arrivals</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{d.onTimePct}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Avg route time</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{d.avgRouteMin}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Orders / driver / shift</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{d.ordersPerDriver}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Late deliveries (window)</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{d.lateDeliveries}</p>
        </Card>
      </div>
      <Card className="mt-8 p-6">
        <p className="text-sm font-bold text-on-surface">Insight</p>
        <p className="mt-2 text-sm font-medium text-on-surface-variant">{d.insight}</p>
      </Card>
    </PageContainer>
  );
}
