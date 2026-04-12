import { MaterialIcon } from "@/components/MaterialIcon";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { RevenueCategoryRow } from "@/lib/dashboard-sample-data";

export type RevenueByCategoryPanelProps = {
  rows: RevenueCategoryRow[];
  insight: string;
  className?: string;
};

export function RevenueByCategoryPanel({
  rows,
  insight,
  className,
}: RevenueByCategoryPanelProps) {
  return (
    <Card className={cn("p-6 sm:p-8", className)}>
      <h2 className="mb-8 text-lg font-bold text-on-surface">Revenue by category</h2>
      <div className="space-y-6">
        {rows.map((row) => (
          <div key={row.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-on-surface-variant">{row.name}</span>
              <span className="font-bold text-on-surface">{row.amountLabel}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className={cn("h-full rounded-full", row.barClass)}
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-xl border border-tertiary-fixed/30 bg-tertiary-fixed/20 p-4">
        <p className="mb-1 flex items-center gap-2 text-xs font-bold text-tertiary">
          <MaterialIcon name="lightbulb" className="text-base" />
          Insight
        </p>
        <p className="text-[11px] font-medium leading-relaxed text-on-tertiary-container">
          {insight}
        </p>
      </div>
    </Card>
  );
}
