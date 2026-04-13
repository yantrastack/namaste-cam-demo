"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/MaterialIcon";
import { UserAvatar } from "@/components/users/UserAvatar";
import { cn } from "@/lib/cn";
import { USER_ROLE_OPTIONS } from "@/lib/users/roles";
import type { ManagedUser, UserRole, UserStatus } from "@/lib/users/types";

const labelClass =
  "mb-1 block text-[10px] font-bold tracking-widest text-stone-500 uppercase";

const inputClass =
  "w-full rounded-xl border-none bg-surface px-4 py-3 font-semibold text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

const selectClass =
  "w-full appearance-none rounded-xl border-none bg-surface py-3.5 pl-5 pr-10 font-bold text-secondary transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

type Draft = Pick<
  ManagedUser,
  | "name"
  | "email"
  | "phone"
  | "role"
  | "status"
  | "notes"
  | "walletBalance"
  | "creditLimit"
  | "walletNote"
  | "avatarUrl"
>;

type Props = {
  user: ManagedUser;
  open: boolean;
  onClose: () => void;
  onSave: (patch: Partial<ManagedUser>) => void;
};

const MAX_AVATAR_BYTES = 2_500_000;

function parseMoney(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function userToDraft(u: ManagedUser): Draft {
  return {
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    notes: u.notes,
    walletBalance: u.walletBalance,
    creditLimit: u.creditLimit,
    walletNote: u.walletNote,
    avatarUrl: u.avatarUrl,
  };
}

export function UserEditModal({
  user,
  open,
  onClose,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(userToDraft(user));
  }, [open, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_AVATAR_BYTES) {
      window.alert("Please choose an image under 2.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      if (typeof data === "string") {
        setDraft((d) => (d ? { ...d, avatarUrl: data } : d));
      }
    };
    reader.readAsDataURL(file);
  };

  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    onSave(draft);
    onClose();
  };

  if (!draft) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit User"
      description="Update user information, wallet details, and profile settings"
      className="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo Section */}
        <div className="flex items-center gap-6 p-6 bg-surface-container-lowest rounded-lg">
          <div className="relative group">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
              <UserAvatar
                src={draft.avatarUrl}
                alt=""
                width={80}
                height={80}
                className="h-full w-full"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-0 bottom-0 rounded-full bg-primary p-1.5 text-on-primary shadow-md transition-transform hover:scale-110"
              aria-label="Change profile photo"
            >
              <MaterialIcon name="edit" className="text-xs" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-on-surface mb-1">Profile Photo</h3>
            <p className="text-sm text-secondary">Click the edit icon to change photo</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          onChange={handleAvatarChange}
        />

        {/* Basic Information */}
        <div>
          <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon name="person" className="text-sm" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="edit-name">
                Full Name
              </label>
              <input
                id="edit-name"
                type="text"
                value={draft.name}
                onChange={(e) => setField("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-email">
                Email Address
              </label>
              <input
                id="edit-email"
                type="email"
                value={draft.email}
                onChange={(e) => setField("email", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-phone">
                Phone Number
              </label>
              <input
                id="edit-phone"
                type="tel"
                value={draft.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-role">
                User Role
              </label>
              <div className="relative">
                <select
                  id="edit-role"
                  className={selectClass}
                  value={draft.role}
                  onChange={(e) => setField("role", e.target.value as UserRole)}
                >
                  {USER_ROLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <MaterialIcon
                  name="expand_more"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-status">
                Account Status
              </label>
              <div className="relative">
                <select
                  id="edit-status"
                  className={selectClass}
                  value={draft.status}
                  onChange={(e) => setField("status", e.target.value as UserStatus)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <MaterialIcon
                  name="expand_more"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div>
          <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon name="account_balance_wallet" className="text-sm" />
            Financial Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="edit-wallet">
                Wallet Balance (GBP)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                  £
                </span>
                <input
                  id="edit-wallet"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={draft.walletBalance.toFixed(2)}
                  onChange={(e) => setField("walletBalance", parseMoney(e.target.value))}
                  className={cn(inputClass, "pl-9")}
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-credit">
                Credit Limit (GBP)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                  £
                </span>
                <input
                  id="edit-credit"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={draft.creditLimit.toFixed(2)}
                  onChange={(e) => setField("creditLimit", parseMoney(e.target.value))}
                  className={cn(inputClass, "pl-9")}
                />
              </div>
              <p className="mt-1.5 text-xs text-stone-500">
                Maximum the user can carry or draw against before a hold is placed.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass} htmlFor="edit-wallet-note">
              Wallet Note
            </label>
            <textarea
              id="edit-wallet-note"
              rows={3}
              value={draft.walletNote}
              onChange={(e) => setField("walletNote", e.target.value)}
              placeholder="e.g. Approved manual top-up, dispute pending…"
              className={cn(inputClass, "resize-none py-3")}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass} htmlFor="edit-notes">
            Administrative Notes
          </label>
          <textarea
            id="edit-notes"
            rows={4}
            value={draft.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Add internal notes about this user account..."
            className={cn(inputClass, "resize-none py-3")}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 pt-4 border-t border-stone-100 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
