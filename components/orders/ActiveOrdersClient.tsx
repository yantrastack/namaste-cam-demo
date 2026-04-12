"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import { computeRestaurantBill, formatGbp } from "@/lib/order-bill-math";
import type { OrderFulfillmentType, OrderStatus, RestaurantOrderRecord } from "@/lib/orders-restaurant-data";
import {
  formatOrderFulfillmentType,
  getOrderFulfillmentType,
  normalizeUkPostcode,
} from "@/lib/orders-restaurant-data";
import { ORDER_ARCHIVES_EVENT, filterActiveOrdersWithArchives, readOrderArchivesMap } from "@/lib/order-session-archives";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

/** Theme-token avatar fills so initials stay readable (stable colour per guest + order). */
const AVATAR_PALETTE = [
  { bg: "bg-secondary-container", text: "text-on-secondary-container" },
  { bg: "bg-primary-container", text: "text-on-primary-container" },
  { bg: "bg-tertiary-container", text: "text-on-tertiary-container" },
  { bg: "bg-secondary-fixed", text: "text-on-secondary-fixed" },
  { bg: "bg-tertiary-fixed", text: "text-on-tertiary-fixed" },
  { bg: "bg-primary-fixed", text: "text-on-primary-fixed" },
  { bg: "bg-secondary-fixed-dim", text: "text-on-secondary-fixed" },
  { bg: "bg-primary-fixed-dim", text: "text-on-primary-fixed-variant" },
] as const;

function fnv1aHash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function avatarClassesForOrder(o: RestaurantOrderRecord) {
  const seed = `${(o.customerName || "guest").toLowerCase()}|${o.id}`;
  const idx = fnv1aHash(seed) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx]!;
}

function fulfillmentBadge(mode: OrderFulfillmentType) {
  if (mode === "delivery") return <Badge tone="info">Delivery</Badge>;
  return <Badge tone="neutral">Collection</Badge>;
}

function statusBadge(status: OrderStatus) {
  switch (status) {
    case "active":
      return <Badge tone="info">Active</Badge>;
    case "preparing":
      return <Badge tone="warning">Preparing</Badge>;
    case "ready":
      return <Badge tone="success">Ready</Badge>;
    case "draft":
      return <Badge tone="neutral">Draft</Badge>;
    case "completed":
      return <Badge tone="success">Completed</Badge>;
    case "cancelled":
      return <Badge tone="error">Cancelled</Badge>;
    default:
      return <Badge tone="neutral">{status}</Badge>;
  }
}

type Props = {
  orders: RestaurantOrderRecord[];
};

const STATUS_OPTIONS: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "draft", label: "Draft" },
];

type PostcodeSort = "none" | "postcode-asc" | "postcode-desc";

const PAGE_SIZE_OPTIONS = [5, 10, 25] as const;

export function ActiveOrdersClient({ orders }: Props) {
  const router = useRouter();
  const [archiveMap, setArchiveMap] = useState<Record<string, RestaurantOrderRecord>>(() =>
    typeof window !== "undefined" ? readOrderArchivesMap() : {},
  );
  useEffect(() => {
    const sync = () => setArchiveMap(readOrderArchivesMap());
    sync();
    window.addEventListener(ORDER_ARCHIVES_EVENT, sync);
    return () => window.removeEventListener(ORDER_ARCHIVES_EVENT, sync);
  }, []);

  const visibleOrders = useMemo(
    () => filterActiveOrdersWithArchives(orders, archiveMap),
    [orders, archiveMap],
  );

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]["value"]>("all");
  const [postcodeFilter, setPostcodeFilter] = useState<string>("all");
  const [postcodeSort, setPostcodeSort] = useState<PostcodeSort>("none");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);

  const postcodeOptions = useMemo(() => {
    const set = new Set(visibleOrders.map((o) => o.postcode.trim()));
    return [...set].sort((a, b) => normalizeUkPostcode(a).localeCompare(normalizeUkPostcode(b)));
  }, [visibleOrders]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = visibleOrders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (postcodeFilter !== "all" && normalizeUkPostcode(o.postcode) !== normalizeUkPostcode(postcodeFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        o.code.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.venueLabel.toLowerCase().includes(q) ||
        o.postcode.toLowerCase().replace(/\s+/g, "").includes(q.replace(/\s+/g, "")) ||
        o.id.toLowerCase().includes(q) ||
        formatOrderFulfillmentType(o).toLowerCase().includes(q)
      );
    });

    if (postcodeSort === "postcode-asc") {
      list = [...list].sort((a, b) =>
        normalizeUkPostcode(a.postcode).localeCompare(normalizeUkPostcode(b.postcode)),
      );
    } else if (postcodeSort === "postcode-desc") {
      list = [...list].sort((a, b) =>
        normalizeUkPostcode(b.postcode).localeCompare(normalizeUkPostcode(a.postcode)),
      );
    }

    return list;
  }, [visibleOrders, query, status, postcodeFilter, postcodeSort]);

  useEffect(() => {
    setPage(1);
  }, [query, status, postcodeFilter, postcodeSort]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pageOffset = (currentPage - 1) * pageSize;
  const pageRows = rows.slice(pageOffset, pageOffset + pageSize);
  const rangeFrom = rows.length === 0 ? 0 : pageOffset + 1;
  const rangeTo = rows.length === 0 ? 0 : Math.min(rows.length, pageOffset + pageRows.length);

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 p-4 md:flex-row md:flex-wrap md:items-end">
        <div className="min-w-[200px] flex-1 md:max-w-md">
          <Input
            label="Search"
            name="orderSearch"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order, guest, venue, postcode…"
            left={<MaterialIcon name="search" className="text-xl text-secondary" />}
          />
        </div>
        <div className="flex min-w-[160px] flex-col gap-1">
          <span className="ml-1 text-xs font-bold uppercase tracking-widest text-secondary">Postcode</span>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-none bg-surface py-3 pl-4 pr-10 text-sm font-bold text-on-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
              value={postcodeFilter}
              onChange={(e) => setPostcodeFilter(e.target.value)}
            >
              <option value="all">All postcodes</option>
              {postcodeOptions.map((pc) => (
                <option key={pc} value={pc}>
                  {pc}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
            />
          </div>
        </div>
        <div className="flex min-w-[160px] flex-col gap-1">
          <span className="ml-1 text-xs font-bold uppercase tracking-widest text-secondary">Status</span>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-none bg-surface py-3 pl-4 pr-10 text-sm font-bold text-on-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof STATUS_OPTIONS)[number]["value"])}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
            />
          </div>
        </div>
        <div className="flex min-w-[200px] flex-col gap-1">
          <span className="ml-1 text-xs font-bold uppercase tracking-widest text-secondary">Sort by postcode</span>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-none bg-surface py-3 pl-4 pr-10 text-sm font-bold text-on-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
              value={postcodeSort}
              onChange={(e) => setPostcodeSort(e.target.value as PostcodeSort)}
            >
              <option value="none">Default order</option>
              <option value="postcode-asc">Postcode A–Z</option>
              <option value="postcode-desc">Postcode Z–A</option>
            </select>
            <MaterialIcon
              name="expand_more"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
            />
          </div>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="md">
            <MaterialIcon name="download" />
            Export
          </Button>
          <Link
            href="/orders/create"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold shadow-md transition-all active:scale-95",
              "bg-primary text-on-primary shadow-primary-soft hover:bg-primary/90",
            )}
          >
            <MaterialIcon name="add" />
            Manual order
          </Link>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Venue</TableHeaderCell>
              <TableHeaderCell>Postcode</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Time</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-12 text-center text-sm font-medium text-secondary">
                  No orders match these filters.
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((o) => {
                const bill = computeRestaurantBill({
                  lines: o.lines.map((l) => ({
                    quantity: l.quantity,
                    unitPriceExTax: l.unitPriceExTax,
                  })),
                  taxIncluded: o.taxIncluded,
                  discountMode: o.discountMode,
                  discountValue: o.discountValue,
                  fulfillmentType: getOrderFulfillmentType(o),
                });
                const avatar = avatarClassesForOrder(o);
                return (
                  <TableRow
                    key={o.id}
                    className="cursor-pointer hover:bg-surface-container-low/60"
                    tabIndex={0}
                    title={`Open order ${o.code}`}
                    onClick={() => router.push(`/orders/${o.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/orders/${o.id}`);
                      }
                    }}
                  >
                    <TableCell>
                      <span className="font-headline text-sm font-extrabold text-on-surface">#{o.code}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ring-1 ring-outline-variant/15",
                            avatar.bg,
                            avatar.text,
                          )}
                        >
                          {initials(o.customerName || "Guest")}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-on-surface">{o.customerName || "Guest"}</p>
                          <p className="truncate text-xs font-medium text-secondary">{o.customerPhone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate text-sm font-medium text-secondary">{o.venueLabel}</p>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm font-bold tabular-nums tracking-wide text-on-surface">
                        {o.postcode}
                      </span>
                    </TableCell>
                    <TableCell>{fulfillmentBadge(getOrderFulfillmentType(o))}</TableCell>
                    <TableCell>{statusBadge(o.status)}</TableCell>
                    <TableCell className="font-extrabold tabular-nums text-on-surface">
                      {formatGbp(bill.totalPayable)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-secondary">{o.placedAtLabel}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/orders/${o.id}`}
                          className="rounded-full p-2 text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                          aria-label={`View order ${o.code}`}
                        >
                          <MaterialIcon name="visibility" className="text-xl" />
                        </Link>
                        <Link
                          href={`/orders/${o.id}/edit`}
                          className="rounded-full p-2 text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface"
                          aria-label={`Edit order ${o.code}`}
                        >
                          <MaterialIcon name="edit_note" className="text-xl" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {rows.length > 0 ? (
          <div className="flex flex-col gap-4 border-t border-outline-variant/15 bg-surface-container-low/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm font-medium text-secondary sm:text-left">
              Showing{" "}
              <span className="font-bold tabular-nums text-on-surface">
                {rangeFrom}–{rangeTo}
              </span>{" "}
              of <span className="font-bold tabular-nums text-on-surface">{rows.length}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Rows</span>
                <div className="relative">
                  <select
                    className="appearance-none rounded-full border-none bg-surface py-2 pl-4 pr-9 text-xs font-extrabold text-on-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n} / page
                      </option>
                    ))}
                  </select>
                  <MaterialIcon
                    name="expand_more"
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="min-w-[2.5rem] px-3"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <MaterialIcon name="chevron_left" />
                </Button>
                <span className="min-w-[5rem] text-center text-xs font-extrabold tabular-nums text-on-surface">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="min-w-[2.5rem] px-3"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <MaterialIcon name="chevron_right" />
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
