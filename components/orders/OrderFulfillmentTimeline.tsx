"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";
import type { FulfillmentSnapshot } from "@/lib/order-fulfillment";
import { FULFILLMENT_STEPS, fulfillmentLinePercent } from "@/lib/order-fulfillment";

type Props = {
  snapshot: FulfillmentSnapshot;
};

export function OrderFulfillmentTimeline({ snapshot }: Props) {
  const { progress, times } = snapshot;
  const linePct = fulfillmentLinePercent(progress);

  return (
    <div className="relative flex w-full items-start justify-between gap-1 pt-2 sm:gap-2">
      <div className="absolute left-0 top-5 z-0 h-0.5 w-full bg-surface-container-high sm:top-6">
        <div
          className="h-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${linePct}%` }}
        />
      </div>
      {FULFILLMENT_STEPS.map((step, i) => {
        const done = i < progress;
        const current = i === progress && progress < 4;
        const pending = i > progress;

        return (
          <div key={step.id} className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full shadow-md transition-colors sm:size-10",
                done && "bg-primary text-on-primary shadow-primary-soft",
                current &&
                  "bg-primary-container text-on-primary-container ring-2 ring-primary/30 ring-offset-2 ring-offset-surface-container-lowest",
                pending && "bg-surface-container-high text-secondary",
              )}
            >
              <MaterialIcon name={step.icon} className="text-lg sm:text-xl" />
            </div>
            <div className="max-w-[5.5rem] text-center sm:max-w-none">
              <p
                className={cn(
                  "text-[10px] font-extrabold uppercase leading-tight tracking-wide sm:text-xs",
                  pending ? "text-secondary" : "font-headline text-on-surface",
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-[9px] font-semibold text-secondary sm:text-[10px]">{times[i]}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
