"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";

type ServicePincodeRow = {
  id: string;
  pincode: string;
  areaName: string;
};

function newPincodeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `pc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

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
  const [operationalActive, setOperationalActive] = useState(true);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [ownerLinked, setOwnerLinked] = useState(true);
  const [servicePincodes, setServicePincodes] = useState<ServicePincodeRow[]>([]);
  const [draftPincode, setDraftPincode] = useState("");
  const [draftAreaName, setDraftAreaName] = useState("");
  const [editingPincodeId, setEditingPincodeId] = useState<string | null>(null);

  const servicePincodesPayload = useMemo(
    () =>
      JSON.stringify(
        servicePincodes.map(({ pincode, areaName }) => ({ pincode, areaName })),
      ),
    [servicePincodes],
  );

  function resetPincodeDraft() {
    setDraftPincode("");
    setDraftAreaName("");
    setEditingPincodeId(null);
  }

  function handleAddOrSavePincode() {
    const pincode = draftPincode.trim();
    const areaName = draftAreaName.trim();
    if (!pincode || !areaName) return;

    if (editingPincodeId) {
      setServicePincodes((rows) =>
        rows.map((row) =>
          row.id === editingPincodeId ? { ...row, pincode, areaName } : row,
        ),
      );
      resetPincodeDraft();
      return;
    }

    setServicePincodes((rows) => [
      ...rows,
      { id: newPincodeId(), pincode, areaName },
    ]);
    setDraftPincode("");
    setDraftAreaName("");
  }

  function handleStartEditPincode(row: ServicePincodeRow) {
    setEditingPincodeId(row.id);
    setDraftPincode(row.pincode);
    setDraftAreaName(row.areaName);
  }

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
          <input
            type="hidden"
            name="operationalStatus"
            value={operationalActive ? "active" : "inactive"}
            readOnly
          />
          <input type="hidden" name="deliveryOnly" value={deliveryOnly ? "true" : "false"} readOnly />
          <FieldShell label="Partner visibility">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-surface px-4 py-3 ring-1 ring-outline-variant/20">
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-bold text-on-surface">
                  {operationalActive ? "Active" : "Inactive"}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {operationalActive
                    ? "This partner can appear on Namaste Cam and receive orders."
                    : "This partner is hidden from discovery and cannot receive new orders."}
                </p>
              </div>
              <Switch
                checked={operationalActive}
                onCheckedChange={setOperationalActive}
                className="shrink-0"
                aria-label={operationalActive ? "Set partner inactive" : "Set partner active"}
              />
            </div>
          </FieldShell>
          <FieldShell label="Delivery only">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-surface px-4 py-3 ring-1 ring-outline-variant/20">
              <p className="min-w-0 text-sm text-on-surface-variant">
                When enabled, this partner is shown for delivery only (no dine-in on Namaste Cam).
              </p>
              <Switch
                checked={deliveryOnly}
                onCheckedChange={setDeliveryOnly}
                className="shrink-0"
                aria-label="Delivery only"
              />
            </div>
          </FieldShell>
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
        <input type="hidden" name="servicePincodes" value={servicePincodesPayload} readOnly />
        <FieldShell label={editingPincodeId ? "Edit service area" : "Add service area"}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Pincode"
              name="draftServicePincode"
              value={draftPincode}
              onChange={(e) => setDraftPincode(e.target.value)}
              placeholder="e.g. CB1 1AA"
              autoComplete="postal-code"
            />
            <Input
              label="Area name"
              name="draftServiceAreaName"
              value={draftAreaName}
              onChange={(e) => setDraftAreaName(e.target.value)}
              placeholder="e.g. Cambridge city centre"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={handleAddOrSavePincode}
              disabled={!draftPincode.trim() || !draftAreaName.trim()}
            >
              <MaterialIcon name={editingPincodeId ? "save" : "add"} className="text-lg" />
              {editingPincodeId ? "Save changes" : "Add pincode"}
            </Button>
            {editingPincodeId ? (
              <Button variant="secondary" size="sm" type="button" onClick={resetPincodeDraft}>
                Cancel
              </Button>
            ) : null}
          </div>
        </FieldShell>

        <FieldShell label="Service areas">
          {servicePincodes.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              No service areas yet. Add a pincode and area name above.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl ring-1 ring-outline-variant/15">
              <Table>
                <TableHead className="border-b border-outline-variant/10 bg-surface-container-low/60">
                  <tr>
                    <TableHeaderCell className="py-3 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                      Pincode
                    </TableHeaderCell>
                    <TableHeaderCell className="py-3 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                      Area name
                    </TableHeaderCell>
                    <TableHeaderCell className="w-px py-3 text-right text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                      Actions
                    </TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody className="divide-y-0 bg-surface-container-lowest">
                  {servicePincodes.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low/40"
                    >
                      <TableCell className="py-3 text-sm font-bold text-on-surface">
                        {row.pincode}
                      </TableCell>
                      <TableCell className="py-3 text-sm font-medium text-on-surface">
                        {row.areaName}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditPincode(row)}
                            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                            aria-label={`Edit ${row.pincode}`}
                          >
                            <MaterialIcon name="edit" className="text-lg" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setServicePincodes((rows) => rows.filter((r) => r.id !== row.id));
                              if (editingPincodeId === row.id) resetPincodeDraft();
                            }}
                            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
                            aria-label={`Remove ${row.pincode}`}
                          >
                            <MaterialIcon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
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
