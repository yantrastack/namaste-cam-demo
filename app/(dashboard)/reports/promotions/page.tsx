import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { ReportsToolbar } from "@/components/reports/ReportsToolbar";
import { getPromotionsReportSample } from "@/lib/reports-sample-data";

export const metadata: Metadata = {
  title: "Promotions report",
  description: "Coupon and campaign outcomes (sample).",
};

export default function ReportsPromotionsPage() {
  const p = getPromotionsReportSample();

  return (
    <PageContainer
      title="Promotions"
      description="Complements Coupons & Promotions — create and edit codes there; review outcomes here."
      actions={<ReportsToolbar />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Redemptions</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{p.couponsRedeemed}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Discount value</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{p.discountValue}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Unique customers</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{p.uniqueCustomers}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Top campaign</p>
          <p className="mt-2 text-lg font-extrabold text-on-surface">{p.topCampaign}</p>
        </Card>
      </div>
      <Card className="mt-8 p-6">
        <p className="text-sm font-bold text-on-surface">Insight</p>
        <p className="mt-2 text-sm font-medium text-on-surface-variant">{p.insight}</p>
      </Card>
    </PageContainer>
  );
}
