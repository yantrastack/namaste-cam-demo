"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { cn } from "@/lib/cn";
import { snapshotWithProgress, type FulfillmentProgress, type FulfillmentSnapshot } from "@/lib/order-fulfillment";

const COMPLETED_PROGRESS = 4 satisfies FulfillmentProgress;

const STATUS_OPTIONS: {
  progress: FulfillmentProgress;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    progress: 0,
    title: "Draft",
    description: "Ticket saved locally — not yet confirmed to service.",
    icon: "edit_note",
  },
  {
    progress: 1,
    title: "Confirmed",
    description: "Guest is seated and the ticket is live for the pass.",
    icon: "verified",
  },
  {
    progress: 2,
    title: "Preparing",
    description: "Kitchen and bar are actively producing this order.",
    icon: "restaurant",
  },
  {
    progress: 3,
    title: "Ready",
    description: "Food or drinks are staged — runner or server hand-off.",
    icon: "shopping_bag",
  },
  {
    progress: 4,
    title: "Completed",
    description: "Meal delivered or check closed — archive when billing syncs.",
    icon: "task_alt",
  },
];

function statusLabel(progress: FulfillmentProgress) {
  return STATUS_OPTIONS.find((o) => o.progress === progress)?.title ?? "—";
}

type Props = {
  placedAtLabel: string;
  snapshot: FulfillmentSnapshot;
  onCommit: (next: FulfillmentSnapshot) => void;
};

export function OrderStatusDropdown({ placedAtLabel, snapshot, onCommit }: Props) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<FulfillmentProgress>(snapshot.progress);

  useEffect(() => {
    if (open) setPreview(snapshot.progress);
  }, [open, snapshot.progress]);

  const currentLabel = statusLabel(snapshot.progress);
  const previewLabel = statusLabel(preview);
  const dirty = preview !== snapshot.progress;
  const nextSnapshot = dirty ? snapshotWithProgress(snapshot, preview, placedAtLabel) : snapshot;

  const apply = () => {
    if (!dirty) {
      setOpen(false);
      return;
    }
    onCommit(nextSnapshot);
    setOpen(false);
  };

  return (
    <div className="relative inline-flex">
      <Button
        type="button"
        variant="primary"
        size="md"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <MaterialIcon name="stat_2" className="text-lg" />
        Update status
      </Button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        position="right"
        className={cn(
          "flex h-full w-[min(100vw,28rem)]! max-w-[min(100vw,28rem)]! flex-col overflow-hidden border-l border-outline-variant/15 shadow-2xl sm:rounded-l-2xl",
          "bg-surface-container-lowest",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-outline-variant/15 px-5 pb-4 pt-5">
          <div className="min-w-0">
            <h2 className="font-headline text-xl font-extrabold tracking-tight text-on-surface">Update order status</h2>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-secondary">
              Pick a stage below. Completing an order is managed elsewhere for now.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-secondary"
            aria-label="Close drawer"
            onClick={() => setOpen(false)}
          >
            <MaterialIcon name="close" className="text-xl" />
          </Button>
        </div>

        <div className="shrink-0 border-b border-outline-variant/15 bg-surface-container-low/50 px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/15">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">Current</p>
              <p className="mt-1 font-headline text-lg font-extrabold text-on-surface">{currentLabel}</p>
            </div>
            <div
              className={cn(
                "overflow-hidden rounded-xl ring-1 transition-colors ring-outline-variant/15",
                dirty && "ring-2 ring-primary/30",
              )}
            >
              <div className="bg-surface-container-low px-4 pb-3 pt-4">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">After apply</p>
              </div>
              <div className="bg-background px-4 pb-4 pt-1">
                <p className={cn("font-headline text-lg font-extrabold", dirty ? "text-primary" : "text-on-surface")}>
                  {previewLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4" role="listbox" aria-label="Fulfillment stages">
          {STATUS_OPTIONS.map((opt) => {
            const isPast = opt.progress < preview;
            const isActive = opt.progress === preview;
            const isFuture = opt.progress > preview;
            const live = snapshot.progress === opt.progress;
            const soft = isPast || isFuture;
            const isCompletedLocked = opt.progress === COMPLETED_PROGRESS;

            return (
              <button
                key={opt.progress}
                type="button"
                role="option"
                aria-selected={isActive}
                disabled={isCompletedLocked}
                className={cn(
                  "flex w-full text-left transition-colors",
                  isActive && "flex-col overflow-hidden rounded-xl shadow-md shadow-primary-soft",
                  !isActive &&
                    "items-start gap-4 rounded-xl px-4 py-4",
                  soft &&
                    !isActive &&
                    "bg-primary-container/12 text-on-surface ring-1 ring-primary/10 hover:bg-primary-container/20",
                  isCompletedLocked &&
                    "cursor-not-allowed opacity-50 ring-1 ring-outline-variant/10 hover:bg-transparent",
                )}
                onClick={() => {
                  if (!isCompletedLocked) setPreview(opt.progress);
                }}
              >
                {isActive ? (
                  <>
                    <div className="flex items-start gap-4 bg-primary px-4 py-4 text-on-primary">
                      <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-on-primary/20 text-lg text-on-primary">
                        <MaterialIcon name={opt.icon} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-headline text-sm font-extrabold text-on-primary">{opt.title}</span>
                          {live ? (
                            <span className="rounded-full bg-on-primary/25 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-on-primary">
                              Live
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <MaterialIcon name="check_circle" className="mt-1 shrink-0 text-xl text-on-primary" />
                    </div>
                    <div className="bg-background px-4 py-3">
                      <span className="block text-xs font-medium leading-snug text-secondary">{opt.description}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className={cn(
                        "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full text-lg",
                        "bg-surface-container-high text-secondary",
                      )}
                    >
                      <MaterialIcon name={opt.icon} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-headline text-sm font-extrabold text-on-surface">{opt.title}</span>
                        {live ? (
                          <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-on-secondary-container">
                            Live
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-xs font-medium leading-snug text-secondary">
                        {opt.description}
                      </span>
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 gap-3 border-t border-outline-variant/15 bg-surface-container-low/40 px-5 py-4">
          <Button type="button" variant="ghost" size="md" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="md" className="flex-1" disabled={!dirty} onClick={apply}>
            Apply status
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
