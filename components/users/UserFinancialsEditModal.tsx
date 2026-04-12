"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { ManagedUser } from "@/lib/users/types";

const labelClass =
  "mb-1 block text-[10px] font-bold tracking-widest text-stone-500 uppercase";

const inputClass =
  "w-full rounded-xl border-none bg-surface px-4 py-3 font-semibold text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

type Props = {
  user: ManagedUser;
  open: boolean;
  onClose: () => void;
  onSave: (
    patch: Pick<ManagedUser, "walletBalance" | "creditLimit" | "walletNote">,
  ) => void;
};

function parseMoney(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

export function UserFinancialsEditModal({
  user,
  open,
  onClose,
  onSave,
}: Props) {
  const [balanceStr, setBalanceStr] = useState("");
  const [creditStr, setCreditStr] = useState("");
  const [walletNote, setWalletNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setBalanceStr(user.walletBalance.toFixed(2));
    setCreditStr(user.creditLimit.toFixed(2));
    setWalletNote(user.walletNote);
  }, [open, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      walletBalance: parseMoney(balanceStr),
      creditLimit: parseMoney(creditStr),
      walletNote: walletNote.trim(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit wallet & limits"
      description="Update balance, credit limit, and internal wallet notes. Changes save immediately."
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="fin-wallet">
            Wallet balance (USD)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
              $
            </span>
            <input
              id="fin-wallet"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={balanceStr}
              onChange={(e) => setBalanceStr(e.target.value)}
              className={cn(inputClass, "pl-9")}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="fin-credit">
            Credit limit (USD)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
              $
            </span>
            <input
              id="fin-credit"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={creditStr}
              onChange={(e) => setCreditStr(e.target.value)}
              className={cn(inputClass, "pl-9")}
            />
          </div>
          <p className="mt-1.5 text-xs text-stone-500">
            Maximum the user can carry or draw against before a hold is placed.
          </p>
        </div>
        <div>
          <label className={labelClass} htmlFor="fin-note">
            Wallet note
          </label>
          <textarea
            id="fin-note"
            rows={3}
            value={walletNote}
            onChange={(e) => setWalletNote(e.target.value)}
            placeholder="e.g. Approved manual top-up, dispute pending…"
            className={cn(inputClass, "resize-none py-3")}
          />
        </div>
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
