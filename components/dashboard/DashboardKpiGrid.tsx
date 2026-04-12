import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { KpiDelta, SampleKpi } from "@/lib/dashboard-sample-data";

const accentRing: Record<SampleKpi["accent"], string> = {
  primary: "bg-primary-fixed/50 text-primary",
  amber: "bg-tertiary-fixed/40 text-tertiary",
  blue: "bg-secondary-container text-on-secondary-container",
  purple: "bg-secondary-fixed text-on-secondary-fixed",
};

function DeltaBadge({ delta }: { delta: KpiDelta }) {
  if (delta.kind === "stable") {
    return (
      <Badge tone="neutral" className="text-[10px] tracking-tighter">
        Stable
      </Badge>
    );
  }
  if (delta.kind === "percent") {
    return (
      <Badge tone="success" className="text-[10px] tracking-tighter">
        {delta.value}
      </Badge>
    );
  }
  return (
    <Badge tone="success" className="text-[10px] tracking-tighter">
      +{delta.value} {delta.label}
    </Badge>
  );
}

export function DashboardKpiGrid({ kpis }: { kpis: SampleKpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card
          key={kpi.label}
          className="group border border-transparent p-6 transition-all hover:border-primary/10 hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div
              className={cn(
                "rounded-lg p-2 ring-1 ring-outline-variant/15",
                accentRing[kpi.accent],
              )}
            >
              <MaterialIcon name={kpi.icon} className="text-2xl" />
            </div>
            <DeltaBadge delta={kpi.delta} />
          </div>
          <p className="mb-1 text-sm font-medium text-on-surface-variant">{kpi.label}</p>
          <p className="text-2xl font-extrabold tracking-tight text-on-surface">{kpi.value}</p>
        </Card>
      ))}
    </div>
  );
}
