"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import type { SelectedLineSlotAvailability } from "./model";

const controlSm =
  "w-full rounded-xl border-none bg-surface px-3 py-2.5 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-secondary">
      {children}
    </span>
  );
}

export type ProductLineAvailabilityFieldsProps = {
  value: SelectedLineSlotAvailability;
  onChange: (next: SelectedLineSlotAvailability) => void;
  className?: string;
};

export function ProductLineAvailabilityFields({
  value,
  onChange,
  className,
}: ProductLineAvailabilityFieldsProps) {
  const patch = (partial: Partial<SelectedLineSlotAvailability>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Availability</h3>
        <label className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={value.available}
            onChange={(e) => patch({ available: e.target.checked })}
          />
          <span className="pointer-events-none absolute inset-0 rounded-full bg-surface-container-high transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-container-lowest" />
          <span className="pointer-events-none absolute start-[2px] top-1/2 z-10 h-4 w-4 -translate-y-1/2 rounded-full border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-transform peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5" />
        </label>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="min-w-0 flex-1">
            <FieldLabel>From</FieldLabel>
            <input
              type="time"
              className={controlSm}
              value={value.timeFrom}
              onChange={(e) => patch({ timeFrom: e.target.value })}
              aria-label="Available from"
            />
          </div>
          <div className="min-w-0 flex-1">
            <FieldLabel>To</FieldLabel>
            <input
              type="time"
              className={controlSm}
              value={value.timeTo}
              onChange={(e) => patch({ timeTo: e.target.value })}
              aria-label="Available until"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/15 bg-surface-container-low/50 p-3">
            <input
              type="checkbox"
              checked={value.deliverable}
              onChange={(e) => patch({ deliverable: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-[11px] font-bold text-on-surface">Deliverable</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/15 bg-surface-container-low/50 p-3">
            <input
              type="checkbox"
              checked={value.pickup}
              onChange={(e) => patch({ pickup: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-[11px] font-bold text-on-surface">Pickup</span>
          </label>
        </div>
        <div>
          <Input
            label="Prep time (mins)"
            name="prepMins"
            type="number"
            min={0}
            value={value.prepMins}
            onChange={(e) => patch({ prepMins: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
