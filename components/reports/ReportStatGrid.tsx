import { Card } from "@/components/ui/Card";
import type { ReportMetricCard } from "@/lib/reports-sample-data";

export function ReportStatGrid({ cards }: { cards: ReportMetricCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="border border-transparent p-5">
          <p className="text-sm font-medium text-on-surface-variant">{c.label}</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-on-surface">{c.value}</p>
          {c.hint ? <p className="mt-1 text-xs font-medium text-on-surface-variant">{c.hint}</p> : null}
        </Card>
      ))}
    </div>
  );
}
