"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  UserModuleCanvas,
  UserScreenToolbar,
} from "@/components/users/UserModuleChrome";
import { PeerToggleRow } from "@/components/users/PeerToggleRow";
import { formatJoinDate, useUsers } from "@/components/users/UsersProvider";
import { USER_ROLE_OPTIONS } from "@/lib/users/roles";
import type { UserRole } from "@/lib/users/types";
import { cn } from "@/lib/cn";

const fieldLabel =
  "block px-1 text-[10px] font-bold tracking-widest text-stone-500 uppercase";

const controlClass =
  "w-full rounded-xl border-none bg-surface px-5 py-3.5 font-medium text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

const selectClass =
  "w-full appearance-none rounded-xl border-none bg-surface py-3.5 pl-5 pr-10 font-bold text-secondary transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

export function NewUserForm() {
  const router = useRouter();
  const { addUser, hydrated } = useUsers();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [notes, setNotes] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [requirePasswordReset, setRequirePasswordReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in full name, email, and phone.");
      return;
    }
    addUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      notes: notes.trim(),
      twoFactorEnabled,
      requirePasswordReset,
    });
    router.push("/users");
  };

  const previewName = name.trim() || "New user";

  return (
    <UserModuleCanvas>
      <form
        id="new-user-form"
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl"
      >
        <UserScreenToolbar title="Add New User" />

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-headline text-3xl leading-none font-extrabold tracking-tight text-on-surface">
              User Details
            </h1>
            <p className="mt-2 text-lg text-stone-500">
              Create an account and set role, notes, and access options
            </p>
          </div>
          <div className="hidden gap-3 md:flex">
            <Link
              href="/users"
              className="rounded-full border border-outline-variant px-8 py-3 text-center font-bold text-secondary transition-all hover:bg-stone-100 active:scale-95 active:opacity-80"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-full bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container active:scale-95 active:opacity-80"
            >
              Save Changes
            </button>
          </div>
        </div>

        {!hydrated ? (
          <p className="py-12 text-center text-sm text-secondary">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-8 lg:col-span-1">
              <section className="flex flex-col items-center bg-surface-container-lowest p-8 text-center shadow-sm ring-1 ring-black/5 rounded-lg">
                <div className="group relative mb-6">
                  <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9hbRJ_e1L8nTeuPZ77n1KRKKhkWcNcyg6UQMuiqJD-blZjfhk3xVk3pyotPX1BokJIlYuA9lUGXedKH5lgq8g8b5YW112Gq4JuIUKuNXDlrfoLQ0wpPCbTc0Fx0kiaOecQUe9B_qk1SACoJEIsknUjg7gPSzirDaQm8jNugiAb-ZX64oQWqKtLwlaR1fwlpbWhXdSdoMD0cLoICuCYAKuVJjsT_wpK0XigXC6yV_jXgOtUJji2LXGWZVu8Dz0My3D4O1fl3Y1KYg"
                      alt=""
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                  <span
                    className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-on-primary shadow-md"
                    aria-hidden
                  >
                    <MaterialIcon name="edit" className="text-sm" />
                  </span>
                </div>
                <h2 className="font-headline text-xl font-bold text-on-surface">
                  {previewName}
                </h2>
                <p className="mb-6 text-sm font-medium tracking-widest text-stone-400 uppercase">
                  User ID: pending
                </p>
                <div className="w-full space-y-4 border-t border-stone-50 pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Status</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Joined</span>
                    <span className="font-semibold text-on-surface">
                      {formatJoinDate(today)}
                    </span>
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 rounded-lg">
                <div className="mb-6 flex items-center gap-3">
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
                <div className="space-y-2">
                  <label className={fieldLabel}>Wallet Balance (USD)</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      $
                    </span>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value="0.00"
                      className="w-full cursor-not-allowed rounded-xl border-none bg-surface py-4 pl-8 pr-4 text-xl font-bold text-primary opacity-90 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <p className="mt-2 px-1 text-[11px] leading-relaxed text-stone-400">
                    Updating the wallet balance will trigger an automated
                    notification to the user.
                  </p>
                </div>
              </section>
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
                    <label className={fieldLabel} htmlFor="new-name">
                      Full Name
                    </label>
                    <input
                      id="new-name"
                      className={controlClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      placeholder="e.g. Julian Rodriguez"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={fieldLabel} htmlFor="new-email">
                      Email Address
                    </label>
                    <input
                      id="new-email"
                      type="email"
                      className={controlClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={fieldLabel} htmlFor="new-phone">
                      Phone Number
                    </label>
                    <input
                      id="new-phone"
                      type="tel"
                      className={controlClass}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={fieldLabel} htmlFor="new-role">
                      User Role
                    </label>
                    <div className="relative">
                      <select
                        id="new-role"
                        className={selectClass}
                        value={role}
                        onChange={(e) =>
                          setRole(e.target.value as UserRole)
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
                    <label className={fieldLabel} htmlFor="new-notes">
                      Administrative Notes
                    </label>
                    <textarea
                      id="new-notes"
                      rows={4}
                      placeholder="Add internal notes about this user account..."
                      className={cn(controlClass, "resize-none py-4")}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
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
                      title="Two-Factor Auth"
                      description={
                        twoFactorEnabled
                          ? "Will be enabled for this account"
                          : "Currently disabled for this account"
                      }
                      checked={twoFactorEnabled}
                      onChange={setTwoFactorEnabled}
                    />
                    <PeerToggleRow
                      title="Require PW Reset"
                      description="On next login attempt"
                      checked={requirePasswordReset}
                      onChange={setRequirePasswordReset}
                    />
                  </div>
                </div>

                {error ? (
                  <p className="mt-6 text-sm font-semibold text-error" role="alert">
                    {error}
                  </p>
                ) : null}
              </section>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-secondary md:hidden">
          <Link href="/users" className="font-semibold text-primary hover:underline">
            ← All users
          </Link>
        </p>
      </form>

      <div className="md:hidden fixed bottom-6 left-6 right-6 z-40 flex gap-3">
        <Link
          href="/users"
          className="flex flex-1 items-center justify-center rounded-full border border-outline-variant bg-white/90 py-4 text-center font-bold shadow-lg backdrop-blur-md transition-all active:scale-95"
        >
          Discard
        </Link>
        <button
          type="submit"
          form="new-user-form"
          className="flex-[2] rounded-full bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/30 transition-all active:scale-95"
        >
          Save Profile
        </button>
      </div>
    </UserModuleCanvas>
  );
}
