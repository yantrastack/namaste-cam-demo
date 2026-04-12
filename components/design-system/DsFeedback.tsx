"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

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
          <div className="max-w-sm rounded-xl border border-outline-variant/10 bg-white p-8 shadow-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-primary">
              <MaterialIcon name="delete_forever" className="text-4xl" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Delete Recipe?</h3>
            <p className="mb-8 leading-relaxed text-stone-500">
              This action cannot be undone. All related menu pairings will also
              be removed from the system.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 bg-stone-100 text-stone-600">
                Cancel
              </Button>
              <Button className="flex-1">Confirm</Button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-primary">
          <MaterialIcon name="delete_forever" className="text-4xl" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-on-surface">Delete Recipe?</h3>
        <p className="mb-8 leading-relaxed text-stone-500">
          This action cannot be undone. All related menu pairings will also be
          removed from the system.
        </p>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            type="button"
            className="flex-1 bg-stone-100 text-stone-600"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </div>
      </Modal>
    </section>
  );
}
