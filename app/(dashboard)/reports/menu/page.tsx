import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { ReportsToolbar } from "@/components/reports/ReportsToolbar";
import { getMenuPerformanceSample } from "@/lib/reports-sample-data";

export const metadata: Metadata = {
  title: "Menu report",
  description: "Catalog performance highlights (sample).",
};

export default function ReportsMenuPage() {
  const m = getMenuPerformanceSample();

  return (
    <PageContainer
      title="Menu & catalog performance"
      description="Merchandising and pricing still live under Products; this view is read-only demand signals."
      actions={<ReportsToolbar />}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm font-medium text-on-surface-variant">Top seller</p>
          <p className="mt-2 text-xl font-extrabold text-on-surface">{m.topItem}</p>
          <p className="mt-1 text-sm text-on-surface-variant">{m.topItemOrders} orders in window</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-on-surface-variant">Slowest mover</p>
          <p className="mt-2 text-xl font-extrabold text-on-surface">{m.worstItem}</p>
          <p className="mt-1 text-sm text-on-surface-variant">Review placement or portion messaging</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-on-surface-variant">Drinks attach rate</p>
          <p className="mt-2 text-3xl font-extrabold text-on-surface">{m.attachRateDrinks}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-bold text-on-surface">Insight</p>
          <p className="mt-2 text-sm font-medium text-on-surface-variant">{m.insight}</p>
        </Card>
      </div>
    </PageContainer>
  );
}
