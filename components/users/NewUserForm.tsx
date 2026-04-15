"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  UserModuleCanvas,
  UserScreenToolbar,
} from "@/components/users/UserModuleChrome";
import { PeerToggleRow } from "@/components/users/PeerToggleRow";
import { formatJoinDate, useUsers } from "@/components/users/UsersProvider";
import { USER_ROLE_OPTIONS } from "@/lib/users/roles";
import {
  buildNewUserSections,
  defaultNewUserFormValues,
  type NewUserFieldDef,
  type NewUserFormValues,
} from "@/lib/users/new-user-form-config";
import { isCustomerLikeRole, isStaffLikeRole } from "@/lib/users/role-policy";
import type { UserRole } from "@/lib/users/types";
import { cn } from "@/lib/cn";

const fieldLabel =
  "block px-1 text-[10px] font-bold tracking-widest text-stone-500 uppercase";

const controlClass =
  "w-full rounded-xl border-none bg-surface px-5 py-3.5 font-medium text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

const selectClass =
  "w-full appearance-none rounded-xl border-none bg-surface py-3.5 pl-5 pr-10 font-bold text-secondary transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none";

const MAX_PHOTO_BYTES = 2_500_000;
const MAX_DOC_BYTES = 5_000_000;

function parseMoney(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function roleOptions() {
  return USER_ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
}

function setFormValue<K extends keyof NewUserFormValues>(
  prev: NewUserFormValues,
  key: K,
  value: NewUserFormValues[K],
): NewUserFormValues {
  return { ...prev, [key]: value };
}

function FormFieldsGrid({
  fields,
  values,
  onChange,
}: {
  fields: NewUserFieldDef[];
  values: NewUserFormValues;
  onChange: <K extends keyof NewUserFormValues>(
    key: K,
    value: NewUserFormValues[K],
  ) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
      {fields.map((field) => {
        const colClass = field.colSpan === 2 ? "md:col-span-2" : "";
        const v = values[field.key];

        if (field.type === "checkbox") {
          return (
            <div key={field.key} className={cn("pt-2", colClass)}>
              <PeerToggleRow
                title={field.label}
                description={field.hint ?? ""}
                checked={Boolean(v)}
                onChange={(next) => onChange(field.key, next)}
              />
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.key} className={cn("space-y-2", colClass)}>
              <label className={fieldLabel} htmlFor={`nf-${field.key}`}>
                {field.label}
              </label>
              <textarea
                id={`nf-${field.key}`}
                rows={4}
                placeholder={field.placeholder}
                className={cn(controlClass, "resize-none py-4")}
                value={String(v)}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
              {field.hint ? (
                <p className="px-1 text-[11px] leading-relaxed text-stone-400">
                  {field.hint}
                </p>
              ) : null}
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key} className={cn("space-y-2", colClass)}>
              <label className={fieldLabel} htmlFor={`nf-${field.key}`}>
                {field.label}
              </label>
              <div className="relative">
                <select
                  id={`nf-${field.key}`}
                  className={selectClass}
                  value={String(v)}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (field.key === "role") {
                      onChange("role", raw as UserRole);
                    } else if (field.key === "compensationType") {
                      onChange(
                        "compensationType",
                        raw === "monthly" ? "monthly" : "hourly",
                      );
                    } else {
                      onChange(field.key, raw);
                    }
                  }}
                >
                  {(field.options ?? []).map((o) => (
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
              {field.hint ? (
                <p className="px-1 text-[11px] leading-relaxed text-stone-400">
                  {field.hint}
                </p>
              ) : null}
            </div>
          );
        }

        if (field.type === "money") {
          return (
            <div key={field.key} className={cn("space-y-2", colClass)}>
              <label className={fieldLabel} htmlFor={`nf-${field.key}`}>
                {field.label}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                  £
                </span>
                <input
                  id={`nf-${field.key}`}
                  type="text"
                  inputMode="decimal"
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border-none bg-surface py-3.5 pr-4 pl-8 font-semibold text-on-surface transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  value={String(v)}
                  onChange={(e) => onChange(field.key, e.target.value)}
                />
              </div>
              {field.hint ? (
                <p className="px-1 text-[11px] leading-relaxed text-stone-400">
                  {field.hint}
                </p>
              ) : null}
            </div>
          );
        }

        const inputType =
          field.type === "email"
            ? "email"
            : field.type === "tel"
              ? "tel"
              : "text";

        return (
          <div key={field.key} className={cn("space-y-2", colClass)}>
            <label className={fieldLabel} htmlFor={`nf-${field.key}`}>
              {field.label}
            </label>
            <input
              id={`nf-${field.key}`}
              type={inputType}
              className={controlClass}
              value={String(v)}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.key, e.target.value)}
              autoComplete={
                field.key === "name"
                  ? "name"
                  : field.key === "email"
                    ? "email"
                    : field.key === "phone"
                      ? "tel"
                      : undefined
              }
            />
            {field.hint ? (
              <p className="px-1 text-[11px] leading-relaxed text-stone-400">
                {field.hint}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function SectionHeader({
  icon,
  iconBgClass,
  iconClass,
  title,
  description,
}: {
  icon: string;
  iconBgClass: string;
  iconClass: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 space-y-1">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg p-2", iconBgClass)}>
          <MaterialIcon name={icon} className={iconClass} />
        </div>
        <h2 className="font-headline text-lg font-bold text-on-surface">
          {title}
        </h2>
      </div>
      {description ? (
        <p className="text-sm text-stone-500">{description}</p>
      ) : null}
    </div>
  );
}

export function NewUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addUser, hydrated } = useUsers();
  const [values, setValues] = useState<NewUserFormValues>(() =>
    defaultNewUserFormValues(),
  );
  const [deactivateUser, setDeactivateUser] = useState(false);
  const [requirePasswordReset, setRequirePasswordReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idProofName, setIdProofName] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const idProofRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const context = searchParams.get("context");
    const roleParam = searchParams.get("role") as UserRole | null;
    if (context === "staff") {
      setValues((v) =>
        setFormValue(v, "role", roleParam ?? "delivery_agent"),
      );
    } else if (
      roleParam &&
      USER_ROLE_OPTIONS.some((o) => o.value === roleParam)
    ) {
      setValues((v) => setFormValue(v, "role", roleParam));
    }
  }, [searchParams]);

  const sections = useMemo(
    () => buildNewUserSections(values.role, roleOptions()),
    [values.role],
  );

  const profileSection = sections.find((s) => s.id === "profile");
  const customerFinancialSection = sections.find(
    (s) => s.id === "customer-financial",
  );
  const staffSections = sections.filter((s) => s.id.startsWith("staff-"));

  const patch = <K extends keyof NewUserFormValues>(
    key: K,
    value: NewUserFormValues[K],
  ) => {
    setValues((prev) => setFormValue(prev, key, value));
  };

  const today = new Date().toISOString().slice(0, 10);
  const previewName = values.name.trim() || "New user";
  const fromStaffFlow = searchParams.get("context") === "staff";

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_PHOTO_BYTES) {
      setError("Please choose a profile photo under 2.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      if (typeof data === "string") {
        setPhotoPreview(data);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!values.name.trim() || !values.email.trim() || !values.phone.trim()) {
      setError("Please fill in full name, email, and phone.");
      return;
    }

    let walletBalance: number | undefined;
    let creditLimit: number | undefined;
    if (isCustomerLikeRole(values.role)) {
      walletBalance = parseMoney(values.walletBalance);
      creditLimit = parseMoney(values.creditLimit);
      if (creditLimit < 0) {
        setError("Credit limit cannot be negative.");
        return;
      }
    }

    if (isStaffLikeRole(values.role)) {
      const rate = parseMoney(values.compensationAmount);
      if (!Number.isFinite(rate) || rate <= 0) {
        setError("Enter a compensation amount greater than zero.");
        return;
      }
    }

    addUser({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      role: values.role,
      status: deactivateUser ? "inactive" : "active",
      notes: values.notes.trim(),
      requirePasswordReset,
      walletBalance,
      creditLimit,
      strictCustomer: isCustomerLikeRole(values.role)
        ? values.strictCustomer
        : false,
      avatarUrl: photoPreview ?? undefined,
      staffProfile: isStaffLikeRole(values.role)
        ? {
            alternativeEmail: values.alternativeEmail.trim(),
            secondaryPhone: values.secondaryPhone.trim(),
            address: values.address.trim(),
            idProofFileName: idProofName,
            cvFileName: cvFileName,
            temporaryStaff: values.temporaryStaff,
            compensationType: values.compensationType,
            compensationAmount: parseMoney(values.compensationAmount),
          }
        : undefined,
    });
    router.push("/users");
  };

  const avatarSrc =
    photoPreview ??
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA9hbRJ_e1L8nTeuPZ77n1KRKKhkWcNcyg6UQMuiqJD-blZjfhk3xVk3pyotPX1BokJIlYuA9lUGXedKH5lgq8g8b5YW112Gq4JuIUKuNXDlrfoLQ0wpPCbTc0Fx0kiaOecQUe9B_qk1SACoJEIsknUjg7gPSzirDaQm8jNugiAb-ZX64oQWqKtLwlaR1fwlpbWhXdSdoMD0cLoICuCYAKuVJjsT_wpK0XigXC6yV_jXgOtUJji2LXGWZVu8Dz0My3D4O1fl3Y1KYg";

  const compensationLabel =
    values.compensationType === "hourly"
      ? "per hour"
      : "per month";

  return (
    <UserModuleCanvas>
      <form
        id="new-user-form"
        onSubmit={handleSubmit}
        className="w-full"
      >
        <UserScreenToolbar
          breadcrumbs={[
            { label: "Users", href: "/users" },
            {
              label: fromStaffFlow ? "Add team member" : "Add new",
            },
          ]}
        />

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-headline text-3xl leading-none font-extrabold tracking-tight text-on-surface">
              {fromStaffFlow ? "Staff onboarding" : "User Details"}
            </h1>
            <p className="mt-2 text-lg text-stone-500">
              {fromStaffFlow
                ? "Same flow as customer accounts — fields update automatically from the selected role."
                : "Create an account; customer and staff sections appear based on role."}
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
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                onChange={handlePhoto}
              />
              <section className="flex flex-col items-center bg-surface-container-lowest p-8 text-center shadow-sm ring-1 ring-black/5 rounded-lg">
                <div className="group relative mb-6">
                  <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                    <Image
                      src={avatarSrc}
                      alt=""
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                      unoptimized={Boolean(photoPreview)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-on-primary shadow-md"
                    aria-label={
                      isStaffLikeRole(values.role)
                        ? "Upload staff photo"
                        : "Change profile photo"
                    }
                  >
                    <MaterialIcon name="edit" className="text-sm" />
                  </button>
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

              {customerFinancialSection ? (
                <section className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 rounded-lg">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-amber-50 p-2">
                      <MaterialIcon
                        name="account_balance_wallet"
                        className="text-amber-600"
                      />
                    </div>
                    <h2 className="font-headline text-lg font-bold text-on-surface">
                      {customerFinancialSection.title}
                    </h2>
                  </div>
                  {customerFinancialSection.description ? (
                    <p className="mb-6 text-sm text-stone-500">
                      {customerFinancialSection.description}
                    </p>
                  ) : null}
                  <FormFieldsGrid
                    fields={customerFinancialSection.fields}
                    values={values}
                    onChange={patch}
                  />
                </section>
              ) : null}

              {isStaffLikeRole(values.role) ? (
                <section className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 rounded-lg">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-purple-50 p-2">
                      <MaterialIcon
                        name="assignment"
                        className="text-purple-800"
                      />
                    </div>
                    <h2 className="font-headline text-lg font-bold text-on-surface">
                      Record preview
                    </h2>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Pay basis</dt>
                      <dd className="font-bold text-on-surface">
                        {values.compensationType === "hourly"
                          ? "Hourly"
                          : "Monthly"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Rate</dt>
                      <dd className="font-bold text-on-surface">
                        £{parseMoney(values.compensationAmount).toFixed(2)}{" "}
                        {compensationLabel}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-500">Temporary</dt>
                      <dd className="font-bold text-on-surface">
                        {values.temporaryStaff ? "Yes" : "No"}
                      </dd>
                    </div>
                  </dl>
                </section>
              ) : null}
            </div>

            <div className="lg:col-span-2">
              {profileSection ? (
                <section className="bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 md:p-10 rounded-lg">
                  <SectionHeader
                    icon={profileSection.icon}
                    iconBgClass={profileSection.iconBgClass}
                    iconClass={profileSection.iconClass}
                    title={profileSection.title}
                    description={profileSection.description}
                  />
                  <FormFieldsGrid
                    fields={profileSection.fields}
                    values={values}
                    onChange={patch}
                  />

                  {isStaffLikeRole(values.role) ? (
                    <div className="mt-10 border-t border-stone-50 pt-8">
                      <SectionHeader
                        icon="folder_special"
                        iconBgClass="bg-stone-100"
                        iconClass="text-secondary"
                        title="Documents"
                        description="ID verification and optional CV — filenames are stored for this demo."
                      />
                      <input
                        ref={idProofRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        aria-hidden
                        tabIndex={-1}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          if (!f) return;
                          if (f.size > MAX_DOC_BYTES) {
                            setError("ID proof must be under 5 MB.");
                            return;
                          }
                          setIdProofName(f.name);
                          setError(null);
                        }}
                      />
                      <input
                        ref={cvRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        aria-hidden
                        tabIndex={-1}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          if (!f) return;
                          if (f.size > MAX_DOC_BYTES) {
                            setError("CV must be under 5 MB.");
                            return;
                          }
                          setCvFileName(f.name);
                          setError(null);
                        }}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className={fieldLabel}>ID proof</label>
                          <button
                            type="button"
                            onClick={() => idProofRef.current?.click()}
                            className="flex w-full items-center justify-between rounded-xl bg-surface px-5 py-3.5 text-left font-semibold text-secondary ring-1 ring-outline-variant/20 transition-all hover:ring-primary/30"
                          >
                            <span className="truncate text-on-surface">
                              {idProofName || "Choose file"}
                            </span>
                            <MaterialIcon name="upload_file" />
                          </button>
                          <p className="px-1 text-[11px] text-stone-400">
                            PDF or image, max 5 MB
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className={fieldLabel}>
                            CV (optional)
                          </label>
                          <button
                            type="button"
                            onClick={() => cvRef.current?.click()}
                            className="flex w-full items-center justify-between rounded-xl bg-surface px-5 py-3.5 text-left font-semibold text-secondary ring-1 ring-outline-variant/20 transition-all hover:ring-primary/30"
                          >
                            <span className="truncate text-on-surface">
                              {cvFileName || "Choose file"}
                            </span>
                            <MaterialIcon name="description" />
                          </button>
                          <p className="px-1 text-[11px] text-stone-400">
                            PDF, DOC, or DOCX
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-12 border-t border-stone-50 pt-8">
                    <h3 className="mb-6 flex items-center gap-2 font-headline text-sm font-bold text-on-surface">
                      <MaterialIcon name="security" className="text-sm" />
                      Security &amp; Access
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <PeerToggleRow
                        title="Deactivate user"
                        description={
                          deactivateUser
                            ? "Account will be created as inactive"
                            : "Account will be active after creation"
                        }
                        checked={deactivateUser}
                        onChange={setDeactivateUser}
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
                    <p
                      className="mt-6 text-sm font-semibold text-error"
                      role="alert"
                    >
                      {error}
                    </p>
                  ) : null}
                </section>
              ) : null}

              {staffSections.map((section) => (
                <section
                  key={section.id}
                  className="mt-8 bg-surface-container-lowest p-8 shadow-sm ring-1 ring-black/5 md:p-10 rounded-lg"
                >
                  <SectionHeader
                    icon={section.icon}
                    iconBgClass={section.iconBgClass}
                    iconClass={section.iconClass}
                    title={section.title}
                    description={section.description}
                  />
                  <FormFieldsGrid
                    fields={section.fields}
                    values={values}
                    onChange={patch}
                  />
                </section>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-secondary md:hidden">
          <Link
            href="/users"
            className="font-semibold text-primary hover:underline"
          >
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
