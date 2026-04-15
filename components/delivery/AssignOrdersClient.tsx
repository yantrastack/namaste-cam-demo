"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import {
  formatKitchenToDoorSummary,
  groupDeliveryOrdersByOutcode,
  outwardUkPostcode,
  type DeliveryAgent,
  type DeliveryDispatchStatus,
  type DeliveryOrder,
} from "@/lib/delivery-ops-data";

function statusBadgeTone(
  s: DeliveryDispatchStatus,
): "success" | "warning" | "neutral" | "info" {
  if (s === "delivered") return "success";
  if (s === "unassigned") return "warning";
  if (s === "en_route") return "info";
  return "neutral";
}

function statusLabel(s: DeliveryDispatchStatus): string {
  switch (s) {
    case "unassigned":
      return "Unassigned";
    case "assigned":
      return "Assigned";
    case "en_route":
      return "Out for delivery";
    case "delivered":
      return "Delivered";
  }
}

function normalizePinParam(raw: string | null): string {
  if (!raw) return "";
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

function isAssignedOrDelivered(status: DeliveryDispatchStatus): boolean {
  return status === "assigned" || status === "delivered";
}

function activeAssignmentsForAgent(
  agentId: string,
  orders: DeliveryOrder[],
): DeliveryOrder[] {
  return orders.filter(
    (o) =>
      o.assignedAgentId === agentId &&
      o.dispatchStatus !== "delivered" &&
      o.dispatchStatus !== "unassigned",
  );
}

function DeliveryDriverPicker({
  agents,
  orders,
  value,
  onChange,
}: {
  agents: DeliveryAgent[];
  orders: DeliveryOrder[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const selected = agents.find((a) => a.id === value);
  const selectedLive = selected
    ? activeAssignmentsForAgent(selected.id, orders).length
    : 0;

  return (
    <div ref={rootRef} className="relative z-20 w-full max-w-[300px]">
      <button
        type="button"
        id="assign-driver-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="assign-driver-listbox"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full max-w-[300px] items-center justify-between gap-2 rounded-xl border-none bg-surface px-3 py-2.5 text-left font-body text-sm font-semibold text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all",
          open ? "ring-2 ring-primary" : "hover:ring-outline-variant/35",
        )}
      >
        <div className="min-w-0 flex-1">
          {selected ? (
            <>
              <span className="block truncate font-headline text-sm font-extrabold text-on-surface">
                {selected.name}
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-medium leading-snug text-secondary">
                {selected.vehicle} · {selectedLive} on route · {selected.phone}
              </span>
            </>
          ) : (
            <span className="text-secondary">Choose a delivery driver</span>
          )}
        </div>
        <MaterialIcon
          name={open ? "expand_less" : "expand_more"}
          className="shrink-0 text-xl text-secondary"
        />
      </button>

      {open ? (
        <div
          id="assign-driver-listbox"
          role="listbox"
          aria-labelledby="assign-driver-trigger"
          className="absolute bottom-full left-0 z-30 mb-2 w-full max-w-[300px] overflow-hidden rounded-xl bg-surface-container-lowest shadow-lg ring-1 ring-outline-variant/20 sm:left-auto sm:right-0"
        >
          <div className="border-b border-outline-variant/15 px-3 py-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
              Delivery drivers
            </p>
            <p className="text-[11px] font-medium leading-snug text-on-surface-variant">
              Tap a driver — name, vehicle, and active stops on route.
            </p>
          </div>
          <div className="max-h-60 space-y-1 overflow-y-auto overscroll-contain px-2 py-2">
            {agents.map((a) => {
              const active = activeAssignmentsForAgent(a.id, orders);
              const isSelected = a.id === value;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(a.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-2 text-left transition-colors",
                    isSelected
                      ? "bg-primary/10 ring-2 ring-primary/40"
                      : "bg-surface-container-low/40 hover:bg-surface-container-high/60",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-headline text-xs font-extrabold leading-tight text-on-surface">{a.name}</p>
                      <p className="mt-0.5 text-[11px] font-medium text-secondary">{a.phone}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-on-surface-variant">{a.vehicle}</p>
                    </div>
                    <Badge tone={active.length > 2 ? "warning" : "neutral"} className="shrink-0 normal-case text-[10px]">
                      {active.length} active
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type AssignOrdersClientProps = {
  initialOrders: DeliveryOrder[];
  agents: DeliveryAgent[];
};

export function AssignOrdersClient({
  initialOrders,
  agents,
}: AssignOrdersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<DeliveryOrder[]>(initialOrders);
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [agentId, setAgentId] = useState<string>(agents[0]?.id ?? "");
  /** Explicit accordion state; omitted keys follow pin default (open when URL pin matches). */
  const [openOverrides, setOpenOverrides] = useState<Record<string, boolean>>({});

  const pinFromUrl = useMemo(
    () => normalizePinParam(searchParams.get("pin")),
    [searchParams],
  );

  const replaceAssignQuery = useCallback(
    (next: { pin?: string; q?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const pin = next.pin !== undefined ? normalizePinParam(next.pin || null) : pinFromUrl;
      const q = next.q !== undefined ? next.q.trim() : query.trim();

      if (pin) params.set("pin", pin);
      else params.delete("pin");

      if (q) params.set("q", q);
      else params.delete("q");

      const s = params.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [pathname, query, router, searchParams, pinFromUrl],
  );

  const distinctOutcodes = useMemo(() => {
    const s = new Set(orders.map((o) => outwardUkPostcode(o.postcode)));
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [orders]);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = orders;
    if (pinFromUrl) {
      list = list.filter((o) => {
        const oc = outwardUkPostcode(o.postcode).toUpperCase();
        return oc === pinFromUrl || oc.startsWith(pinFromUrl);
      });
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (o) =>
        o.code.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.postcode.toLowerCase().includes(q) ||
        o.areaLabel.toLowerCase().includes(q) ||
        o.addressLine.toLowerCase().includes(q),
    );
  }, [orders, query, pinFromUrl]);

  const groups = useMemo(
    () => groupDeliveryOrdersByOutcode(filtered),
    [filtered],
  );

  const isOpen = useCallback(
    (outcode: string) => {
      if (Object.prototype.hasOwnProperty.call(openOverrides, outcode)) {
        return openOverrides[outcode]!;
      }
      if (!pinFromUrl) return false;
      const oc = outcode.toUpperCase();
      return oc === pinFromUrl || oc.startsWith(pinFromUrl);
    },
    [openOverrides, pinFromUrl],
  );

  const toggleGroup = (outcode: string) => {
    setOpenOverrides((prev) => {
      const resolved = Object.prototype.hasOwnProperty.call(prev, outcode)
        ? prev[outcode]!
        : (() => {
            if (!pinFromUrl) return false;
            const oc = outcode.toUpperCase();
            return oc === pinFromUrl || oc.startsWith(pinFromUrl);
          })();
      return { ...prev, [outcode]: !resolved };
    });
  };

  const toggleRow = (o: DeliveryOrder) => {
    if (o.dispatchStatus !== "unassigned") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(o.id)) next.delete(o.id);
      else next.add(o.id);
      return next;
    });
  };

  const assignSelected = () => {
    if (!agentId || selected.size === 0) return;
    const ids = selected;
    const count = ids.size;
    const targetAgentId = agentId;
    const driver = agents.find((a) => a.id === targetAgentId);
    setOrders((prev) =>
      prev.map((o) =>
        ids.has(o.id) && o.dispatchStatus === "unassigned"
          ? {
              ...o,
              dispatchStatus: "assigned" as const,
              assignedAgentId: agentId,
            }
          : o,
      ),
    );
    setSelected(new Set());
    showToast(
      count === 1
        ? `Assigned 1 order to ${driver?.name ?? "driver"}.`
        : `Assigned ${count} orders to ${driver?.name ?? "driver"}.`,
      "success",
    );
    router.push(`/delivery/routes?highlight=${encodeURIComponent(targetAgentId)}`);
  };

  const selectedAgent = agents.find((a) => a.id === agentId);
  const selectedAgentLive = selectedAgent
    ? activeAssignmentsForAgent(selectedAgent.id, orders).length
    : 0;

  return (
    <PageContainer
      title="Assign to delivery drivers"
      description="Orders are grouped by outward postcode. Filter by area or search, then select open rows to assign a delivery driver. The area and search filters stay in the link so you can share a view."
      actions={
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-end lg:justify-end">
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-2xl lg:shrink-0">
            <div className="relative min-w-0">
              <label htmlFor="assign-pin" className="sr-only">
                Filter by postcode area
              </label>
              <MaterialIcon
                name="location_on"
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-secondary"
              />
              <select
                id="assign-pin"
                value={pinFromUrl || ""}
                onChange={(e) => {
                  replaceAssignQuery({ pin: e.target.value, q: query });
                }}
                className={cn(
                  "w-full appearance-none rounded-xl border-none py-3 pl-11 pr-10 font-body text-sm font-semibold text-on-surface outline-none transition-all",
                  "bg-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary",
                )}
              >
                <option value="">All outward areas</option>
                {distinctOutcodes.map((oc) => (
                  <option key={oc} value={oc.toUpperCase()}>
                    {oc}
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
              />
            </div>
            <div className="relative min-w-0">
              <MaterialIcon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-secondary"
              />
              <input
                type="search"
                placeholder="Search code, customer, postcode…"
                value={query}
                onChange={(e) => {
                  const v = e.target.value;
                  setQuery(v);
                  replaceAssignQuery({ q: v });
                }}
                className={cn(
                  "w-full rounded-xl border-none py-3 pl-11 pr-4 font-body text-sm font-semibold text-on-surface outline-none transition-all",
                  "bg-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary",
                )}
                aria-label="Filter orders"
              />
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          {groups.length === 0 ? (
            <Card className="p-10 text-center font-medium text-on-surface-variant">
              No orders match this search.
            </Card>
          ) : null}
          {groups.map(({ outcode, areaLabel, orders: bucket }) => {
            const total = bucket.length;
            const notAssigned = bucket.filter((o) => o.dispatchStatus === "unassigned").length;
            const assignedDelivery = bucket.filter(
              (o) => o.dispatchStatus === "assigned" || o.dispatchStatus === "en_route",
            ).length;
            const completed = bucket.filter((o) => o.dispatchStatus === "delivered").length;
            return (
              <Card key={outcode} className="overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => toggleGroup(outcode)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-container-low/40"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-headline text-lg font-extrabold tracking-tight text-on-surface">
                        {outcode}
                      </span>
                      <Badge tone="neutral" className="normal-case tracking-normal">
                        {areaLabel}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-secondary">
                      <span className="font-headline font-extrabold tabular-nums text-on-surface">{total}</span>
                      {" total"}
                      <span className="text-on-surface-variant"> · </span>
                      <span className="font-headline font-extrabold tabular-nums text-on-surface">{notAssigned}</span>
                      {" not assigned"}
                      <span className="text-on-surface-variant"> · </span>
                      <span className="font-headline font-extrabold tabular-nums text-on-surface">
                        {assignedDelivery}
                      </span>
                      {" assigned (delivery)"}
                      <span className="text-on-surface-variant"> · </span>
                      <span className="font-headline font-extrabold tabular-nums text-on-surface">{completed}</span>
                      {" completed"}
                    </p>
                  </div>
                  <MaterialIcon
                    name={isOpen(outcode) ? "expand_less" : "expand_more"}
                    className="shrink-0 text-2xl text-secondary"
                  />
                </button>
                {isOpen(outcode) ? (
                  <div className="border-t border-outline-variant/15">
                    <Table>
                      <TableHead className="bg-surface-container-low/50">
                        <TableRow className="hover:bg-transparent">
                          <TableHeaderCell className="w-12 px-4 py-3 text-center text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                            <span className="sr-only">Select</span>
                          </TableHeaderCell>
                          <TableHeaderCell className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                            Order
                          </TableHeaderCell>
                          <TableHeaderCell className="hidden px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant md:table-cell">
                            Customer
                          </TableHeaderCell>
                          <TableHeaderCell className="hidden px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant lg:table-cell">
                            Drop-off
                          </TableHeaderCell>
                          <TableHeaderCell className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                            Postcode
                          </TableHeaderCell>
                          <TableHeaderCell className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                            Status
                          </TableHeaderCell>
                          <TableHeaderCell className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                            Restaurant order
                          </TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bucket.map((o) => {
                          const canPick = o.dispatchStatus === "unassigned";
                          const lockedChecked = isAssignedOrDelivered(o.dispatchStatus);
                          const checked = canPick ? selected.has(o.id) : lockedChecked;
                          const deliveredTiming =
                            o.dispatchStatus === "delivered"
                              ? formatKitchenToDoorSummary(
                                  o.kitchenToDoorMinutes,
                                  o.promisedKitchenToDoorMinutes,
                                )
                              : null;
                          return (
                            <TableRow
                              key={o.id}
                              className={cn(
                                canPick && selected.has(o.id) && "bg-primary/[0.04]",
                                !canPick && "opacity-80",
                              )}
                            >
                              <TableCell className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  disabled={!canPick}
                                  checked={checked}
                                  onChange={() => toggleRow(o)}
                                  className={cn(
                                    "size-4 rounded border-outline-variant text-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed",
                                    lockedChecked && "opacity-90",
                                  )}
                                  aria-label={
                                    lockedChecked
                                      ? `${o.code} is ${o.dispatchStatus === "delivered" ? "delivered" : "assigned"} — locked`
                                      : `Select ${o.code}`
                                  }
                                />
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <span className="font-mono text-sm font-bold text-on-surface">
                                  {o.code}
                                </span>
                                <div className="mt-0.5 text-xs font-medium text-secondary md:hidden">
                                  {o.customerName}
                                </div>
                              </TableCell>
                              <TableCell className="hidden px-4 py-3 text-sm font-semibold text-on-surface md:table-cell">
                                {o.customerName}
                              </TableCell>
                              <TableCell className="hidden max-w-[14rem] px-4 py-3 text-sm text-secondary lg:table-cell">
                                {o.addressLine}
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <span className="text-sm font-semibold text-on-surface">
                                  {outwardUkPostcode(o.postcode)}
                                </span>
                                <div className="text-xs text-secondary">{o.placedAtLabel}</div>
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <Badge tone={statusBadgeTone(o.dispatchStatus)}>
                                  {statusLabel(o.dispatchStatus)}
                                </Badge>
                                {o.assignedAgentId ? (
                                  <div className="mt-1 text-xs font-medium text-secondary">
                                    {agents.find((ag) => ag.id === o.assignedAgentId)?.name ?? "Driver"}
                                  </div>
                                ) : null}
                                {deliveredTiming ? (
                                  <p className="mt-1 text-xs font-semibold leading-snug text-on-surface-variant">
                                    {deliveredTiming}
                                  </p>
                                ) : null}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-right">
                                {o.linkedRestaurantOrderId ? (
                                  <Link
                                    href={`/orders/${o.linkedRestaurantOrderId}`}
                                    className="text-sm font-bold text-primary hover:underline"
                                    aria-label={`View restaurant order ${o.code}`}
                                  >
                                    View order
                                  </Link>
                                ) : (
                                  <span className="text-xs text-secondary">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>

        <Card className="shrink-0 flex flex-col gap-4 overflow-visible p-4 shadow-md ring-outline-variant/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-on-surface">
            <span className="font-headline text-lg font-extrabold text-primary">{selected.size}</span>
            {" selected"}
            {selectedAgent ? (
              <span className="block text-xs font-medium text-secondary">
                Assigning to {selectedAgent.name} · {selectedAgent.vehicle} · {selectedAgentLive} active
              </span>
            ) : null}
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
            <div className="w-full max-w-[300px] shrink-0">
              <DeliveryDriverPicker
                agents={agents}
                orders={orders}
                value={agentId}
                onChange={setAgentId}
              />
            </div>
            <Button
              type="button"
              disabled={selected.size === 0 || !agentId}
              onClick={assignSelected}
              className="shrink-0 sm:min-w-[10rem]"
            >
              <MaterialIcon name="local_shipping" className="text-xl" />
              Assign
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
