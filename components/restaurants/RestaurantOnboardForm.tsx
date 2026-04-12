"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

type OperationalStatus = "active" | "pending" | "inactive";

const fieldLabel =
  "ml-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant";

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className={fieldLabel}>{label}</p>
      {children}
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2">
        <MaterialIcon name={icon} className="text-xl text-primary" />
        <h2 className="text-base font-bold text-on-surface">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </Card>
  );
}

export function RestaurantOnboardForm() {
  const [status, setStatus] = useState<OperationalStatus>("active");
  const [ownerLinked, setOwnerLinked] = useState(true);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard icon="storefront" title="Basic details">
          <FieldShell label="Restaurant name">
            <input
              name="restaurantName"
              placeholder="e.g. Saffron & Stone — Cambridge"
              className="w-full rounded-xl border-none bg-surface px-4 py-4 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
            />
          </FieldShell>
          <FieldShell label="Brand logo">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex size-20 items-center justify-center rounded-full bg-surface-container-low ring-1 ring-outline-variant/20">
                <MaterialIcon name="photo_camera" className="text-2xl text-on-surface-variant" />
              </div>
              <button
                type="button"
                className="text-sm font-bold text-primary hover:underline"
              >
                Upload image
              </button>
            </div>
          </FieldShell>
          <FieldShell label="Short catchphrase">
            <input
              name="tagline"
              placeholder="A line guests see on discovery"
              className="w-full rounded-xl border-none bg-surface px-4 py-4 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
            />
          </FieldShell>
        </SectionCard>

        <SectionCard icon="location_on" title="Location & contact">
          <FieldShell label="Street address">
            <input
              name="street"
              placeholder="Street and number"
              className="w-full rounded-xl border-none bg-surface px-4 py-4 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
            />
          </FieldShell>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldShell label="City">
              <input
                name="city"
                placeholder="City"
                className="w-full rounded-xl border-none bg-surface px-4 py-4 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
              />
            </FieldShell>
            <FieldShell label="Postcode">
              <input
                name="postcode"
                placeholder="Postcode"
                className="w-full rounded-xl border-none bg-surface px-4 py-4 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
              />
            </FieldShell>
          </div>
          <FieldShell label="Contact number">
            <input
              name="phone"
              type="tel"
              placeholder="+44 …"
              className="w-full rounded-xl border-none bg-surface px-4 py-4 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
            />
          </FieldShell>
        </SectionCard>

        <SectionCard icon="toggle_on" title="Operational status">
          <div className="flex flex-wrap gap-4">
            {(
              [
                { id: "active" as const, label: "Active", dot: "bg-green-500" },
                { id: "pending" as const, label: "Pending", dot: "bg-amber-500" },
                { id: "inactive" as const, label: "Inactive", dot: "bg-stone-400" },
              ] satisfies { id: OperationalStatus; label: string; dot: string }[]
            ).map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 transition-all",
                  status === opt.id
                    ? "bg-surface-container-low text-on-surface ring-primary/30"
                    : "bg-surface text-on-surface-variant ring-outline-variant/20 hover:bg-surface-container-low",
                )}
              >
                <input
                  type="radio"
                  name="operationalStatus"
                  value={opt.id}
                  checked={status === opt.id}
                  onChange={() => setStatus(opt.id)}
                  className="sr-only"
                />
                <span className={cn("size-2 shrink-0 rounded-full", opt.dot)} />
                {opt.label}
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon="badge" title="Owner assignment">
          <Input
            label="Linked account"
            name="ownerSearch"
            placeholder="Search owners…"
            autoComplete="off"
            left={<MaterialIcon name="search" className="text-xl text-on-surface-variant" />}
          />
          {ownerLinked ? (
            <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3 ring-1 ring-outline-variant/15">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-on-secondary-container">
                  MS
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Marcus Sterling</p>
                  <p className="text-xs text-on-surface-variant">Owner ID #OWN-4410</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOwnerLinked(false)}
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                aria-label="Remove linked owner"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              Search above to link an owner account.
            </p>
          )}
        </SectionCard>
      </div>

      <SectionCard icon="article" title="Full business description">
        <FieldShell label="Detailed profile">
          <textarea
            name="description"
            rows={5}
            placeholder="Describe the concept, service style, and what makes this partner a fit for Namaste Cam."
            className="w-full resize-y rounded-xl border-none bg-surface px-4 py-4 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
          />
        </FieldShell>
      </SectionCard>

      <SectionCard icon="map" title="Service pincodes">
        <FieldShell label="Enter pincodes">
          <textarea
            name="pincodes"
            rows={3}
            placeholder="Comma-separated list, e.g. CB1 1AA, CB2 3PQ"
            className="w-full resize-y rounded-xl border-none bg-surface px-4 py-4 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
          />
        </FieldShell>
      </SectionCard>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Link
          href="/restaurants"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low"
        >
          Cancel
        </Link>
        <Button variant="primary" size="md" type="submit">
          Save restaurant
        </Button>
      </div>
    </form>
  );
}
