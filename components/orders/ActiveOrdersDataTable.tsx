"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
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
import { getOrderFulfillmentType } from "@/lib/orders-restaurant-data";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

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

export type ActiveOrdersDataTableProps = {
  orders: RestaurantOrderRecord[];
  /** Shown when `orders` is empty */
  emptyMessage?: string;
};

export function ActiveOrdersDataTable({
  orders,
  emptyMessage = "No orders match these filters.",
}: ActiveOrdersDataTableProps) {
  const router = useRouter();

  return (
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
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="py-12 text-center text-sm font-medium text-secondary">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          orders.map((o) => {
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
  );
}
