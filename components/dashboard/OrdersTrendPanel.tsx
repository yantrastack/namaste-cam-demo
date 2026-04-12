import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function buildPath(values: number[], width: number, height: number) {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padY = 16;
  const innerH = height - padY * 2;
  return values
    .map((v, i) => {
      const x = values.length === 1 ? 0 : (i / (values.length - 1)) * width;
      const t = max === min ? 0.5 : (v - min) / (max - min);
      const y = padY + (1 - t) * innerH;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export type OrdersTrendPanelProps = {
  current: number[];
  previous: number[];
  className?: string;
};

export function OrdersTrendPanel({ current, previous, className }: OrdersTrendPanelProps) {
  const w = 800;
  const h = 200;
  const pathCurrent = buildPath(current, w, h);
  const pathPrevious = buildPath(previous, w, h);

  return (
    <Card className={cn("p-6 sm:p-8", className)}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-on-surface">Orders trend</h2>
        <div className="flex flex-wrap gap-4 text-xs font-medium text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary" />
            Current
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-surface-container-highest ring-1 ring-outline-variant/30" />
            Previous
          </span>
        </div>
      </div>
      <div className="relative h-64 w-full">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-surface-container-high" />
          ))}
        </div>
        <svg
          viewBox={`0 0 ${w} ${h + 32}`}
          className="absolute inset-x-0 top-0 h-[calc(100%-1.5rem)] w-full overflow-visible"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={pathPrevious}
            fill="none"
            stroke="currentColor"
            className="text-surface-container-highest"
            strokeWidth={2}
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
          <path
            d={pathCurrent}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute bottom-0 flex w-full justify-between text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}
