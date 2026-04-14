"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  UserModuleCanvas,
  UserScreenToolbar,
} from "@/components/users/UserModuleChrome";
import {
  formatJoinDate,
  useUsers,
  userStatusLabel,
} from "@/components/users/UsersProvider";
import { USER_ROLE_OPTIONS } from "@/lib/users/roles";
import {
  isCustomerLikeRole,
  isStaffLikeRole,
} from "@/lib/users/role-policy";
import type { ManagedUser, UserRole } from "@/lib/users/types";
import { PeerToggleRow } from "@/components/users/PeerToggleRow";
import { UserAvatar } from "@/components/users/UserAvatar";
import { cn } from "@/lib/cn";

type Draft = Pick<
  ManagedUser,
  | "name"
  | "email"
  | "phone"
  | "role"
  | "status"
  | "notes"
  | "requirePasswordReset"
>;

function userToDraft(u: ManagedUser): Draft {
  return {
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    notes: u.notes,
    requirePasswordReset: u.requirePasswordReset,
  };
}

const fieldLabel =
  "block px-1 text-[10px] font-bold tracking-widest text-stone-500 uppercase";

const controlClass =
  "w-full rounded-xl border-none bg-surface px-5 py-3.5 font-medium text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

const selectClass =
  "w-full appearance-none rounded-xl border-none bg-surface py-3.5 pl-5 pr-10 font-bold text-secondary transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

function formatDisplayUserId(saved: ManagedUser): string {
  if (saved.id.startsWith("u-")) {
    const n = saved.id.slice(2);
    if (/^\d+$/.test(n)) return `#USR-${n.padStart(4, "0")}`;
  }
  return `#USR-${saved.id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
}

const MAX_AVATAR_BYTES = 2_500_000;

export function UserDetailView() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { getUser, updateUser, hydrated } = useUsers();

  const saved = useMemo(() => (id ? getUser(id) : undefined), [getUser, id]);

  const [draft, setDraft] = useState<Draft | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!saved) return;
    setDraft(userToDraft(saved));
  }, [saved]);


  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!saved) return;
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
          updateUser(saved.id, { avatarUrl: data });
        }
      };
      reader.readAsDataURL(file);
    },
    [saved, updateUser],
  );

  const setField = useCallback(<K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }, []);

  const handleCancel = useCallback(() => {
    if (!saved) return;
    setDraft(userToDraft(saved));
  }, [saved]);

  const handleSave = useCallback(() => {
    if (!saved || !draft) return;
    updateUser(saved.id, { ...draft });
  }, [draft, saved, updateUser]);

  if (!hydrated) {
    return (
      <UserModuleCanvas>
        <p className="py-20 text-center text-sm text-secondary">Loading…</p>
      </UserModuleCanvas>
    );
  }

  if (!saved || !draft) {
    return (
      <UserModuleCanvas>
        <div className="mx-auto max-w-lg space-y-6 py-16 text-center">
          <h1 className="font-headline text-2xl font-extrabold text-on-surface">
            User not found
          </h1>
          <p className="text-secondary">
            This profile may have been removed or the link is invalid.
          </p>
          <button
            type="button"
            onClick={() => router.push("/users")}
            className="rounded-full bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container active:scale-95"
          >
            Back to users
          </button>
        </div>
      </UserModuleCanvas>
    );
  }

  const displayId = formatDisplayUserId(saved);
  const dirty =
    JSON.stringify(userToDraft(saved)) !== JSON.stringify(draft);

  const statusPillClass =
    draft.status === "active"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-stone-100 text-stone-600";

  return (
    <UserModuleCanvas>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={handleAvatarChange}
      />
      <div className="mx-auto max-w-5xl">
        <UserScreenToolbar
          breadcrumbs={[
            { label: "Users", href: "/users" },
            {
              label: draft.name.trim() || "Profile",
            },
          ]}
        />

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-headline text-3xl leading-none font-extrabold tracking-tight text-on-surface">
              User Details
            </h1>
            <p className="mt-2 text-lg text-stone-500">
              Modify account credentials and system permissions
            </p>
          </div>
          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!dirty}
              className="rounded-full border border-outline-variant px-8 py-3 font-bold text-secondary transition-all hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95 active:opacity-80"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty}
              className="rounded-full bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40 active:scale-95 active:opacity-80"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-1">
            <section className="flex flex-col items-center bg-surface-container-lowest p-8 text-center shadow-sm ring-1 ring-black/5 rounded-lg">
              <div className="group relative mb-6">
                <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                  <UserAvatar
                    src={saved.avatarUrl}
                    alt=""
                    width={128}
                    height={128}
                    className="h-full w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-on-primary shadow-md transition-transform hover:scale-110"
                  aria-label="Change profile photo"
                >
                  <MaterialIcon name="edit" className="text-sm" />
                </button>
              </div>
              <h2 className="font-headline text-xl font-bold text-on-surface">
                {draft.name}
              </h2>
              <p className="mb-6 text-sm font-medium tracking-widest text-stone-400 uppercase">
                User ID: {displayId}
              </p>
              <div className="w-full space-y-4 border-t border-stone-50 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Status</span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase",
                      statusPillClass,
                    )}
                  >
                    {userStatusLabel(draft.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Joined</span>
                  <span className="font-semibold text-on-surface">
                    {formatJoinDate(saved.joinDate)}
                  </span>
                </div>
              </div>
            </section>

            {isCustomerLikeRole(saved.role) ? (
              <section className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 rounded-lg">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-50 p-2">
                      <MaterialIcon
                        name="account_balance_wallet"
                        className="text-amber-600"
                      />
                    </div>
                    <h2 className="font-headline text-lg font-bold text-on-surface">
                      Financials
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/users/${id}/financials`)}
                    className="shrink-0 rounded-full border border-outline-variant px-4 py-2 text-xs font-bold text-secondary transition-colors hover:bg-stone-100"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={fieldLabel}>Wallet Balance (GBP)</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                        £
                      </span>
                      <input
                        type="text"
                        readOnly
                        tabIndex={-1}
                        value={saved.walletBalance.toFixed(2)}
                        className="w-full rounded-xl border-none bg-surface py-4 pl-8 pr-4 text-xl font-bold text-primary transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Credit limit</span>
                    <span className="font-bold text-on-surface">
                      £{saved.creditLimit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Strict customer</span>
                    <span className="font-bold text-on-surface">
                      {saved.strictCustomer ? "Yes" : "No"}
                    </span>
                  </div>
                  {saved.walletNote ? (
                    <div className="rounded-xl bg-surface px-4 py-3 text-left">
                      <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                        Wallet note
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-secondary">
                        {saved.walletNote}
                      </p>
                    </div>
                  ) : null}
                  <p className="px-1 text-[11px] leading-relaxed text-stone-400">
                    Updating the wallet balance will trigger an automated
                    notification to the user. Use Edit to change balance, limit,
                    and notes.
                  </p>
                </div>
              </section>
            ) : isStaffLikeRole(saved.role) ? (
              <section className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 rounded-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-purple-50 p-2">
                    <MaterialIcon
                      name="badge"
                      className="text-purple-800"
                    />
                  </div>
                  <h2 className="font-headline text-lg font-bold text-on-surface">
                    Staff record
                  </h2>
                </div>
                {saved.staffProfile ? (
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-stone-500">Alt. email</dt>
                      <dd className="max-w-[55%] truncate text-right font-semibold text-on-surface">
                        {saved.staffProfile.alternativeEmail || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-stone-500">2nd phone</dt>
                      <dd className="font-semibold text-on-surface">
                        {saved.staffProfile.secondaryPhone || "—"}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-surface px-4 py-3">
                      <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                        Address
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-secondary">
                        {saved.staffProfile.address || "—"}
                      </p>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-stone-500">Temporary</dt>
                      <dd className="font-semibold text-on-surface">
                        {saved.staffProfile.temporaryStaff ? "Yes" : "No"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-stone-500">Compensation</dt>
                      <dd className="font-semibold text-on-surface">
                        £{saved.staffProfile.compensationAmount.toFixed(2)}{" "}
                        {saved.staffProfile.compensationType === "hourly"
                          ? "/ hr"
                          : "/ mo"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2 text-xs">
                      <dt className="text-stone-500">ID proof</dt>
                      <dd className="truncate font-medium text-on-surface">
                        {saved.staffProfile.idProofFileName || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2 text-xs">
                      <dt className="text-stone-500">CV</dt>
                      <dd className="truncate font-medium text-on-surface">
                        {saved.staffProfile.cvFileName || "—"}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm text-stone-500">
                    No extended staff details on file yet.
                  </p>
                )}
              </section>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <section className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 md:p-10 rounded-lg">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-lg bg-red-50 p-2">
                  <MaterialIcon name="person" className="text-primary" />
                </div>
                <h2 className="font-headline text-lg font-bold text-on-surface">
                  Profile Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={fieldLabel} htmlFor="user-name">
                    Full Name
                  </label>
                  <input
                    id="user-name"
                    className={controlClass}
                    value={draft.name}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className={fieldLabel} htmlFor="user-email">
                    Email Address
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    className={controlClass}
                    value={draft.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className={fieldLabel} htmlFor="user-phone">
                    Phone Number
                  </label>
                  <input
                    id="user-phone"
                    type="tel"
                    className={controlClass}
                    value={draft.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className={fieldLabel} htmlFor="user-role">
                    User Role
                  </label>
                  <div className="relative">
                    <select
                      id="user-role"
                      className={selectClass}
                      value={draft.role}
                      onChange={(e) =>
                        setField("role", e.target.value as UserRole)
                      }
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
                <div className="space-y-2 pt-2 md:col-span-2">
                  <label className={fieldLabel} htmlFor="user-notes">
                    Administrative Notes
                  </label>
                  <textarea
                    id="user-notes"
                    rows={4}
                    placeholder="Add internal notes about this user account..."
                    className={cn(controlClass, "resize-none py-4")}
                    value={draft.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-12 border-t border-stone-50 pt-8">
                <h3 className="mb-6 flex items-center gap-2 font-headline text-sm font-bold text-on-surface">
                  <MaterialIcon name="security" className="text-sm" />
                  Security &amp; Access
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <PeerToggleRow
                    title="Deactivate user"
                    description={
                      draft.status === "inactive"
                        ? "Sign-in and ordering are disabled for this account"
                        : "Account is active"
                    }
                    checked={draft.status === "inactive"}
                    onChange={(v) => setField("status", v ? "inactive" : "active")}
                  />
                  <PeerToggleRow
                    title="Require PW Reset"
                    description="On next login attempt"
                    checked={draft.requirePasswordReset}
                    onChange={(v) => setField("requirePasswordReset", v)}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-secondary md:hidden">
          <Link href="/users" className="font-semibold text-primary hover:underline">
            ← All users
          </Link>
        </p>
      </div>

      <div className="md:hidden fixed bottom-6 left-6 right-6 z-40 flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={!dirty}
          className="flex-1 rounded-full border border-outline-variant bg-white/90 py-4 font-bold shadow-lg backdrop-blur-md transition-all active:scale-95 disabled:opacity-40"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty}
          className="flex-[2] rounded-full bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-40"
        >
          Save Profile
        </button>
      </div>
    </UserModuleCanvas>
  );
}
