"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { snapshotWithProgress, type FulfillmentProgress, type FulfillmentSnapshot } from "@/lib/order-fulfillment";

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

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        unpadded
        backdropClassName="bg-inverse-surface/55 backdrop-blur-lg sm:bg-inverse-surface/60"
        className="!w-full !max-w-2xl overflow-hidden rounded-2xl border-outline-variant/15 !bg-surface-container-lowest/95 shadow-2xl shadow-primary-soft/15 backdrop-blur-sm sm:!max-w-3xl md:!max-w-4xl lg:!max-w-[52rem]"
      >
        <div className="px-6 pb-2 pt-6">
          <h2 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">Update order status</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-secondary">
            Earlier stages use a light wash, the selected stage is full primary, and later stages use the same light
            treatment.
          </p>
        </div>

        <div className="border-b border-outline-variant/15 bg-surface-container-low/50 px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/15">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">Current</p>
              <p className="mt-1 font-headline text-lg font-extrabold text-on-surface">{currentLabel}</p>
            </div>
            <div
              className={cn(
                "rounded-xl p-4 ring-2 transition-colors",
                dirty ? "bg-primary/8 ring-primary/30" : "bg-surface-container-high/50 ring-outline-variant/15",
              )}
            >
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">After apply</p>
              <p className={cn("mt-1 font-headline text-lg font-extrabold", dirty ? "text-primary" : "text-on-surface")}>
                {previewLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 px-4 py-4" role="listbox" aria-label="Fulfillment stages">
          {STATUS_OPTIONS.map((opt) => {
            const isPast = opt.progress < preview;
            const isActive = opt.progress === preview;
            const isFuture = opt.progress > preview;
            const live = snapshot.progress === opt.progress;
            const soft = isPast || isFuture;

            return (
              <button
                key={opt.progress}
                type="button"
                role="option"
                aria-selected={isActive}
                className={cn(
                  "flex w-full items-start gap-4 rounded-xl px-4 py-4 text-left transition-colors",
                  isActive &&
                    "bg-primary text-on-primary shadow-md shadow-primary-soft ring-0 ring-transparent",
                  soft &&
                    "bg-primary-container/12 text-on-surface ring-1 ring-primary/10 hover:bg-primary-container/20",
                )}
                onClick={() => setPreview(opt.progress)}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full text-lg",
                    isActive ? "bg-on-primary/20 text-on-primary" : "bg-surface-container-high text-secondary",
                  )}
                >
                  <MaterialIcon name={opt.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "font-headline text-sm font-extrabold",
                        isActive ? "text-on-primary" : "text-on-surface",
                      )}
                    >
                      {opt.title}
                    </span>
                    {live ? (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider",
                          isActive
                            ? "bg-on-primary/25 text-on-primary"
                            : "bg-secondary-container text-on-secondary-container",
                        )}
                      >
                        Live
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-xs font-medium leading-snug",
                      isActive ? "text-on-primary/85" : "text-secondary",
                    )}
                  >
                    {opt.description}
                  </span>
                </span>
                {isActive ? (
                  <MaterialIcon name="check_circle" className="mt-1 shrink-0 text-xl text-on-primary" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 border-t border-outline-variant/15 bg-surface-container-low/40 px-6 py-4">
          <Button type="button" variant="ghost" size="md" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="md" className="flex-1" disabled={!dirty} onClick={apply}>
            Apply status
          </Button>
        </div>
      </Modal>
    </div>
  );
}
