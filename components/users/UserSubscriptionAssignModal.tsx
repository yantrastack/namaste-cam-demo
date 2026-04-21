"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  ADMIN_SUBSCRIPTION_PLANS,
  SUBSCRIPTION_PAYMENT_MODE_OPTIONS,
  adminPlanLabel,
  defaultExpiryForPlan,
  formatAdminPlanPriceGbp,
} from "@/lib/users/subscription-admin";
import type { SubscriptionPaymentMode, UserSubscription } from "@/lib/users/types";
import { MaterialIcon } from "@/components/MaterialIcon";

const labelClass =
  "mb-1 block text-[10px] font-bold tracking-widest text-stone-500 uppercase";

const readOnlyBoxClass =
  "w-full rounded-xl border-none bg-surface px-4 py-3 font-semibold text-on-surface";

const notesClass =
  "w-full resize-none rounded-xl border-none bg-surface px-4 py-3 font-semibold text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

const selectClass =
  "w-full appearance-none rounded-xl border-none bg-surface py-3.5 pl-4 pr-10 font-semibold text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

type Props = {
  open: boolean;
  onClose: () => void;
  /** When set, dialog pre-fills for an update. */
  existing: UserSubscription | null | undefined;
  onSave: (next: UserSubscription) => void;
};

export function UserSubscriptionAssignModal({
  open,
  onClose,
  existing,
  onSave,
}: Props) {
  const [planId, setPlanId] = useState("");
  const [paymentMode, setPaymentMode] =
    useState<SubscriptionPaymentMode>("card");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    const first = ADMIN_SUBSCRIPTION_PLANS[0];
    if (existing) {
      setPlanId(existing.planId);
      setPaymentMode(existing.paymentMode);
      setNotes(existing.notes);
    } else if (first) {
      setPlanId(first.id);
      setPaymentMode("card");
      setNotes("");
    }
  }, [open, existing]);

  const computedExpiresOn = useMemo(
    () => (planId ? defaultExpiryForPlan(planId) : ""),
    [planId],
  );

  const planPriceDisplay = useMemo(
    () => (planId ? formatAdminPlanPriceGbp(planId) : "—"),
    [planId],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId || !computedExpiresOn) return;
    onSave({
      planId,
      planLabel: adminPlanLabel(planId),
      expiresOn: computedExpiresOn,
      paymentMode,
      notes: notes.trim(),
      assignedOn:
        existing?.assignedOn ?? new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  const isEdit = Boolean(existing);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Update subscription" : "Assign subscription plan"}
      description="Choose a plan and payment mode. Term end and price follow the plan catalogue."
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="sub-plan">
            Subscription plan
          </label>
          <div className="relative">
            <select
              id="sub-plan"
              className={selectClass}
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required
            >
              {ADMIN_SUBSCRIPTION_PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Plan price</label>
          <div
            className={cn(readOnlyBoxClass, "text-primary")}
            aria-readonly="true"
          >
            {planPriceDisplay}
          </div>
          <p className="mt-1.5 text-xs text-stone-500">
            Catalogue list price (read-only).
          </p>
        </div>
        <div>
          <label className={labelClass}>Expires on</label>
          <div className={readOnlyBoxClass} aria-readonly="true">
            {computedExpiresOn
              ? new Date(computedExpiresOn + "T12:00:00").toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  },
                )
              : "—"}
          </div>
          <p className="mt-1.5 text-xs text-stone-500">
            Set automatically from the plan length (from today).
          </p>
        </div>
        <div>
          <label className={labelClass} htmlFor="sub-pay">
            Payment mode
          </label>
          <div className="relative">
            <select
              id="sub-pay"
              className={selectClass}
              value={paymentMode}
              onChange={(e) =>
                setPaymentMode(e.target.value as SubscriptionPaymentMode)
              }
            >
              {SUBSCRIPTION_PAYMENT_MODE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="sub-notes">
            Notes
          </label>
          <textarea
            id="sub-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="PO number, billing contact, trial terms…"
            className={cn(notesClass, "py-3")}
          />
        </div>
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEdit ? "Save changes" : "Assign plan"}</Button>
        </div>
      </form>
    </Modal>
  );
}
