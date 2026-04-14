import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { ReportsToolbar } from "@/components/reports/ReportsToolbar";
import { getStaffLaborSummarySample } from "@/lib/reports-sample-data";

export const metadata: Metadata = {
  title: "Staff report",
  description: "Labor rollups (sample) — punches stay under Staff management.",
};

export default function ReportsStaffPage() {
  const s = getStaffLaborSummarySample();

  return (
    <PageContainer
      title="Staff & labor summary"
      description="Rollups only. Use Attendance and Check-in / check-out for operational corrections."
      actions={<ReportsToolbar />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Hours scheduled</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{s.hoursScheduled}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Hours worked</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{s.hoursWorked}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Late arrivals</p>
          <p className="mt-2 text-2xl font-extrabold text-on-surface">{s.lateArrivals}</p>
        </Card>
      </div>
      <Card className="mt-8 p-6">
        <p className="text-sm font-bold text-on-surface">Insight</p>
        <p className="mt-2 text-sm font-medium text-on-surface-variant">{s.insight}</p>
      </Card>
    </PageContainer>
  );
}
