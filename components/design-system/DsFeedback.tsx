"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

export function DsFeedback() {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-12" id="feedback">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight">
          06 Feedback &amp; Messaging
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-8 rounded-lg bg-surface-container-lowest p-10 shadow-sm">
          <h4 className="font-bold">Status Badges</h4>
          <div className="flex flex-wrap gap-4">
            <Badge tone="success">Confirmed</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="error">Cancelled</Badge>
            <Badge tone="neutral">Draft</Badge>
          </div>
          <h4 className="mt-12 font-bold">Loaders &amp; Skeleton</h4>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-sm font-medium">Brewing excellence...</span>
            </div>
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-3/4 rounded-full bg-stone-200" />
              <div className="h-4 w-1/2 rounded-full bg-stone-200" />
            </div>
          </div>
          <Button variant="outline" type="button" onClick={() => setOpen(true)}>
            Open delete dialog (demo)
          </Button>
        </div>

        <div className="flex items-center justify-center rounded-lg bg-surface p-10 shadow-inner">
          <div className="w-full max-w-lg rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-xl ring-1 ring-outline-variant/10">
            <div className="flex gap-3.5 sm:gap-4">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-error-container/45 text-error ring-1 ring-error/15"
                aria-hidden
              >
                <MaterialIcon name="delete_forever" className="text-[1.375rem]! leading-none" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="font-headline text-lg font-bold leading-snug tracking-tight text-on-surface">
                  Delete recipe?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  This action cannot be undone. All related menu pairings will also be removed from the
                  system.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-outline-variant/10 pt-5 sm:flex-row sm:justify-end sm:gap-3">
              <Button variant="outline" size="sm" className="w-full border-outline-variant/35 sm:w-auto sm:min-w-26">
                Cancel
              </Button>
              <Button variant="danger" size="sm" className="w-full sm:w-auto sm:min-w-26">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          /* Design-system demo: no persistence */
        }}
        title="Delete recipe?"
        description="This action cannot be undone. All related menu pairings will also be removed from the system."
        confirmLabel="Delete"
      />
    </section>
  );
}
