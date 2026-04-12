"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { UserModuleCanvas, UserScreenToolbar } from "@/components/users/UserModuleChrome";
import { useUsers } from "@/components/users/UsersProvider";
import type { ManagedUser } from "@/lib/users/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const labelClass =
  "mb-1 block text-[10px] font-bold tracking-widest text-stone-500 uppercase";

const inputClass =
  "w-full rounded-xl border-none bg-surface px-4 py-3 font-semibold text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

function parseMoney(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

export default function UserFinancialsPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { getUser, updateUser, hydrated } = useUsers();

  const [balanceStr, setBalanceStr] = useState("");
  const [creditStr, setCreditStr] = useState("");
  const [walletNote, setWalletNote] = useState("");
  const [user, setUser] = useState<ManagedUser | null>(null);

  useEffect(() => {
    const userData = id ? getUser(id) : null;
    setUser(userData || null);
    if (userData) {
      setBalanceStr(userData.walletBalance.toFixed(2));
      setCreditStr(userData.creditLimit.toFixed(2));
      setWalletNote(userData.walletNote);
    }
  }, [id, getUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    updateUser(user.id, {
      walletBalance: parseMoney(balanceStr),
      creditLimit: parseMoney(creditStr),
      walletNote: walletNote.trim(),
    });
    
    router.push(`/users/${id}`);
  };

  const handleCancel = () => {
    router.push(`/users/${id}`);
  };

  if (!hydrated) {
    return (
      <UserModuleCanvas>
        <p className="py-20 text-center text-sm text-secondary">Loading...</p>
      </UserModuleCanvas>
    );
  }

  if (!user) {
    return (
      <UserModuleCanvas>
        <div className="mx-auto max-w-lg space-y-6 py-16 text-center">
          <h1 className="font-headline text-2xl font-extrabold text-on-surface">
            User not found
          </h1>
          <p className="text-secondary">
            This profile may have been removed or the link is invalid.
          </p>
          <Button onClick={() => router.push("/users")}>
            Back to users
          </Button>
        </div>
      </UserModuleCanvas>
    );
  }

  return (
    <UserModuleCanvas>
      <div className="mx-auto max-w-2xl">
        <UserScreenToolbar title="Edit Financials" />

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-amber-50 p-2">
              <MaterialIcon name="account_balance_wallet" className="text-amber-600" />
            </div>
            <div>
              <h1 className="font-headline text-2xl font-extrabold text-on-surface">
                Wallet & Credit Settings
              </h1>
              <p className="mt-1 text-secondary">
                Update balance, credit limit, and internal wallet notes for {user.name}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 rounded-lg">
            <div className="space-y-6">
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
                <p className="mt-1.5 text-xs text-stone-500">
                  Current available balance in the user's wallet
                </p>
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
                  Maximum the user can carry or draw against before a hold is placed
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="fin-note">
                  Wallet note
                </label>
                <textarea
                  id="fin-note"
                  rows={4}
                  value={walletNote}
                  onChange={(e) => setWalletNote(e.target.value)}
                  placeholder="e.g. Approved manual top-up, dispute pending, special arrangements..."
                  className={cn(inputClass, "resize-none py-3")}
                />
                <p className="mt-1.5 text-xs text-stone-500">
                  Internal notes about this user's wallet status and changes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MaterialIcon name="warning" className="text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">Important Notice</h3>
                <p className="mt-1 text-sm text-amber-800">
                  Updating the wallet balance will trigger an automated notification to the user. 
                  Please ensure all changes are accurate before saving.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </UserModuleCanvas>
  );
}
