"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import {
  computeDeliveryAreaStats,
  computeDeliveryCollectionSummary,
  listDeliveryAgents,
  outwardUkPostcode,
  type DeliveryOrder,
  type DeliveryRoutePlan,
} from "@/lib/delivery-ops-data";
import type { DriverOrderSummary } from "@/lib/driver-orders-data";
import { computeRestaurantBill, formatGbp } from "@/lib/order-bill-math";
import {
  formatCheckoutPaymentSummary,
  formatOrderFulfillmentType,
  getOrderFulfillmentType,
  type RestaurantOrderRecord,
} from "@/lib/orders-restaurant-data";

type Props = {
  orders: RestaurantOrderRecord[];
  deliveryOrders: DeliveryOrder[];
  driverOrders: DriverOrderSummary[];
  routePlans: DeliveryRoutePlan[];
};

type PaymentBucketKey = "unpaid" | "card" | "cash" | "wallet" | "multiple";

type CheckedInUserRow = {
  id: string;
  name: string;
  role: string;
  station: string;
  status: string;
  time: string;
};

type PaymentMetric = {
  key: PaymentBucketKey;
  label: string;
  caption: string;
  count: number;
  amount: number;
};

type OrdersPopupState =
  | {
      kind: "area";
      id: string;
      title: string;
      description: string;
    }
  | {
      kind: "driver";
      id: string;
      title: string;
      description: string;
    }
  | {
      kind: "collection";
      id: "all" | "awaiting_pickup" | "collected";
      title: string;
      description: string;
    };

const PER_PAGE = 5;

const CHECKED_IN_USERS: CheckedInUserRow[] = [
  {
    id: "cu-1",
    name: "Koteshwararao Battula",
    role: "Cook / Chef",
    station: "Hot section · Stall A",
    status: "Checked in",
    time: "14:17",
  },
  {
    id: "cu-2",
    name: "Sai Ganesh Aavula",
    role: "Kitchen helper",
    station: "Prep bench · Stall B",
    status: "Checked in",
    time: "19:52",
  },
  {
    id: "cu-3",
    name: "Sridhar P",
    role: "Driver",
    station: "Dispatch bay",
    status: "Waiting mode",
    time: "20:21",
  },
  {
    id: "cu-4",
    name: "Ashish Mittal",
    role: "Driver",
    station: "Route desk",
    status: "Waiting mode",
    time: "21:45",
  },
  {
    id: "cu-5",
    name: "Vishnu Sai A S",
    role: "Driver",
    station: "Loading point",
    status: "Waiting mode",
    time: "22:10",
  },
];

function CompactTableCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-outline-variant/10 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-headline text-base font-extrabold text-on-surface">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-xs font-medium text-secondary">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>
      {children}
    </Card>
  );
}

function compactHeadCellClass(extra?: string) {
  return cn(
    "px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant",
    extra,
  );
}

function compactCellClass(extra?: string) {
  return cn("px-3 py-2.5 text-xs text-on-surface", extra);
}

function routeDisplayId(plan: DeliveryRoutePlan) {
  const n = plan.agentId.replace(/\D/g, "").slice(-3).padStart(3, "0");
  return `RD-2026-${n}`;
}

function orderStatusTone(status: RestaurantOrderRecord["status"]): BadgeTone {
  switch (status) {
    case "completed":
    case "ready":
      return "success";
    case "preparing":
      return "warning";
    case "cancelled":
      return "error";
    case "active":
      return "info";
    default:
      return "neutral";
  }
}

function parsePaymentAmount(value: string) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function orderTotal(order: RestaurantOrderRecord) {
  return computeRestaurantBill({
    lines: order.lines.map((line) => ({
      quantity: line.quantity,
      unitPriceExTax: line.unitPriceExTax,
    })),
    taxIncluded: order.taxIncluded,
    discountMode: order.discountMode,
    discountValue: order.discountValue,
    fulfillmentType: getOrderFulfillmentType(order),
  }).totalPayable;
}

function orderSettledAmount(order: RestaurantOrderRecord) {
  return order.payments.reduce((sum, payment) => sum + parsePaymentAmount(payment.amount), 0);
}

function orderPaymentBucket(order: RestaurantOrderRecord): PaymentBucketKey {
  const positiveMethods = [...new Set(order.payments.filter((p) => parsePaymentAmount(p.amount) > 0).map((p) => p.method))];
  if (positiveMethods.length === 0) return "unpaid";
  if (positiveMethods.length > 1) return "multiple";
  return positiveMethods[0]!;
}

function buildPaymentMetrics(orders: RestaurantOrderRecord[]): PaymentMetric[] {
  const seed: PaymentMetric[] = [
    { key: "unpaid", label: "Unpaid / pending", caption: "No settled value yet", count: 0, amount: 0 },
    { key: "card", label: "Card", caption: "Counter + online card", count: 0, amount: 0 },
    { key: "cash", label: "Cash", caption: "Cash taken in venue", count: 0, amount: 0 },
    { key: "wallet", label: "Wallet", caption: "Wallet / account balance", count: 0, amount: 0 },
    { key: "multiple", label: "Split tender", caption: "More than one payment type", count: 0, amount: 0 },
  ];

  const metrics = new Map(seed.map((row) => [row.key, { ...row }]));

  for (const order of orders) {
    const key = orderPaymentBucket(order);
    const current = metrics.get(key);
    if (!current) continue;
    current.count += 1;
    current.amount += orderSettledAmount(order);
  }

  return seed.map((row) => metrics.get(row.key) ?? row);
}

function deliveryStatusLabel(status: DeliveryOrder["dispatchStatus"]) {
  if (status === "unassigned") return "Needs driver";
  if (status === "assigned") return "Assigned";
  if (status === "en_route") return "On route";
  return "Delivered";
}

function deliveryStatusTone(status: DeliveryOrder["dispatchStatus"]): BadgeTone {
  if (status === "unassigned") return "warning";
  if (status === "assigned") return "info";
  if (status === "en_route") return "primary";
  return "success";
}

function paymentStatusForOrder(order: RestaurantOrderRecord | undefined) {
  if (!order) return { label: "Payment not linked", tone: "neutral" as BadgeTone };
  const total = orderTotal(order);
  const settled = orderSettledAmount(order);
  if (settled >= total - 0.009) return { label: "Paid", tone: "success" as BadgeTone };
  if (settled > 0) return { label: "Part paid", tone: "warning" as BadgeTone };
  return { label: "Awaiting payment", tone: "error" as BadgeTone };
}

function buildDriverRows(
  deliveryOrders: DeliveryOrder[],
  agents: ReturnType<typeof listDeliveryAgents>,
  initialRows: DriverOrderSummary[],
): DriverOrderSummary[] {
  const initialByAgent = new Map(initialRows.map((row) => [row.agentId, row]));

  return agents.map((agent) => {
    const mine = deliveryOrders.filter((order) => order.assignedAgentId === agent.id);
    const yetToDeliver = mine.filter(
      (order) => order.dispatchStatus === "assigned" || order.dispatchStatus === "en_route",
    ).length;
    const delivered = mine.filter((order) => order.dispatchStatus === "delivered").length;
    const initial = initialByAgent.get(agent.id);

    return {
      agentId: agent.id,
      name: agent.name,
      email: initial?.email ?? `${agent.name.toLowerCase().replace(/\s+/g, ".")}@namastecam.example`,
      total: mine.length,
      yetToDeliver,
      delivered,
      deliveredDetails:
        initial?.deliveredDetails ??
        (delivered > 0
          ? `${delivered} completed drop${delivered === 1 ? "" : "s"}`
          : null),
    };
  });
}

function OrdersAssignmentPopup({
  open,
  onClose,
  title,
  description,
  orders,
  agents,
  restaurantOrders,
  onAssign,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  orders: DeliveryOrder[];
  agents: ReturnType<typeof listDeliveryAgents>;
  restaurantOrders: Map<string, RestaurantOrderRecord>;
  onAssign: (orderId: string, agentId: string) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      unpadded
      className="max-h-[85dvh] max-w-6xl overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 px-5 py-4">
        <div>
          <h3 className="font-headline text-xl font-extrabold text-on-surface">{title}</h3>
          <p className="mt-1 text-sm font-medium text-secondary">{description}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-secondary transition-colors hover:bg-surface-container-highest hover:text-on-surface"
          aria-label="Close order details popup"
        >
          <MaterialIcon name="close" className="text-xl" />
        </button>
      </div>

      <div className="max-h-[calc(85dvh-8rem)] overflow-y-auto p-4">
        {orders.length === 0 ? (
          <div className="rounded-xl bg-surface p-8 text-center text-sm font-medium text-secondary ring-1 ring-outline-variant/10">
            No orders found for this selection.
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.map((deliveryOrder, index) => {
              const restaurantOrder = deliveryOrder.linkedRestaurantOrderId
                ? restaurantOrders.get(deliveryOrder.linkedRestaurantOrderId)
                : undefined;
              const total = restaurantOrder ? orderTotal(restaurantOrder) : null;
              const assignedAgentId = deliveryOrder.assignedAgentId ?? "";
              const assignedAgent = assignedAgentId
                ? agents.find((agent) => agent.id === assignedAgentId)
                : undefined;
              const canAssign =
                !assignedAgentId &&
                deliveryOrder.dispatchStatus !== "en_route" &&
                deliveryOrder.dispatchStatus !== "delivered";
              const completedLabel =
                deliveryOrder.dispatchStatus === "delivered" ||
                deliveryOrder.collectionPickup?.status === "collected"
                  ? "Completed"
                  : "Not complete";
              const paymentStatus = paymentStatusForOrder(restaurantOrder);
              const viewHref =
                deliveryOrder.linkedRestaurantOrderId
                  ? `/orders/${deliveryOrder.linkedRestaurantOrderId}`
                  : `/delivery/assign?pin=${encodeURIComponent(outwardUkPostcode(deliveryOrder.postcode))}`;

              return (
                <div
                  key={deliveryOrder.id}
                  className="rounded-lg bg-surface px-2.5 py-2 ring-1 ring-outline-variant/10"
                >
                  <div className="grid gap-2 lg:grid-cols-[1.5rem_minmax(10rem,1fr)_7rem_minmax(15rem,1.2fr)_minmax(10rem,0.8fr)_7.5rem] lg:items-center">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-extrabold text-primary">
                      {index + 1}
                    </span>

                    <div className="flex min-w-0 items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-headline text-sm font-extrabold text-on-surface">
                          {deliveryOrder.customerName}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] font-semibold text-secondary">
                          {deliveryOrder.code} · {deliveryOrder.placedAtLabel}
                        </p>
                      </div>
                    </div>

                    <Badge
                      tone={deliveryStatusTone(deliveryOrder.dispatchStatus)}
                      className="min-h-5 justify-self-start px-2 py-0 text-[9px] normal-case tracking-normal lg:justify-self-center"
                    >
                      {deliveryStatusLabel(deliveryOrder.dispatchStatus)}
                    </Badge>

                    <div className="min-w-0 text-xs">
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-secondary">Address</p>
                      <p className="mt-0.5 truncate font-semibold text-on-surface">
                        {deliveryOrder.postcode} · {deliveryOrder.addressLine}
                      </p>
                    </div>

                    <div className="min-w-0 text-xs">
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-secondary">Bill</p>
                      <p className="mt-0.5 truncate font-semibold text-on-surface">
                        {total == null ? "Not linked" : formatGbp(total)}
                        <span className="font-medium text-secondary">
                          {" "}
                          ·{" "}
                          {restaurantOrder
                            ? `${restaurantOrder.lines.reduce((sum, line) => sum + line.quantity, 0)} packs`
                            : "Delivery only"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                      <Badge
                        tone={paymentStatus.tone}
                        className="min-h-4 px-1.5 py-0 text-[9px] normal-case tracking-normal"
                      >
                        {paymentStatus.label}
                      </Badge>
                      <Badge
                        tone={completedLabel === "Completed" ? "success" : "neutral"}
                        className="min-h-4 px-1.5 py-0 text-[9px] normal-case tracking-normal"
                      >
                        {completedLabel}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-1.5 grid gap-1.5 rounded-md bg-surface-container-low/35 px-2 py-1.5 lg:grid-cols-[1.5rem_minmax(10rem,1fr)_7rem_minmax(15rem,1.2fr)_minmax(10rem,0.8fr)_7.5rem] lg:items-center">
                    <span className="hidden lg:block" aria-hidden />

                    <div className="flex min-w-0 items-center gap-1.5 lg:col-span-2">
                      <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-widest text-secondary">
                        Assign
                      </span>
                      {canAssign ? (
                        <select
                          value={assignedAgentId}
                          onChange={(event) => onAssign(deliveryOrder.id, event.target.value)}
                          className="min-h-6 w-full min-w-0 rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-on-surface outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary sm:max-w-[200px] sm:min-h-7 sm:px-2 sm:py-1 sm:text-[11px]"
                        >
                          <option value="">No driver assigned</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name} · {agent.vehicle}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Badge tone={deliveryOrder.dispatchStatus === "delivered" ? "success" : "info"} className="min-h-4 px-1.5 py-0 text-[9px] normal-case tracking-normal">
                          {assignedAgent
                            ? `${assignedAgent.name} · ${assignedAgent.vehicle}`
                            : "Assignment locked"}
                        </Badge>
                      )}
                    </div>

                    <p className="min-w-0 truncate text-[10px] font-medium text-primary sm:text-[11px] lg:col-span-2">
                      {restaurantOrder
                        ? `${restaurantOrder.customerPhone} · ${restaurantOrder.internalNotes || "No packing notes"}`
                        : "Delivery-only ticket"}
                    </p>

                    <div className="flex shrink-0 flex-wrap items-center gap-1 lg:justify-end">
                      <Link href={viewHref}>
                        <Button type="button" size="sm" variant="secondary" className="min-h-6 gap-0.5 px-1.5 py-0 text-[9px] sm:min-h-7 sm:gap-1 sm:px-2 sm:py-0.5 sm:text-[10px]">
                          <MaterialIcon name="visibility" className="text-[11px] sm:text-xs" />
                          View
                        </Button>
                      </Link>
                      {canAssign ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          className="min-h-6 gap-0.5 px-1.5 py-0 text-[9px] sm:min-h-7 sm:gap-1 sm:px-2 sm:py-0.5 sm:text-[10px]"
                          onClick={() => {
                            const firstAgent = agents[0]?.id ?? "";
                            if (firstAgent) onAssign(deliveryOrder.id, firstAgent);
                          }}
                        >
                          <MaterialIcon name="assignment_ind" className="text-[11px] sm:text-xs" />
                          Assign
                        </Button>
                      ) : null}
                      {deliveryOrder.collectionPickup ? (
                        <Badge tone="neutral" className="min-h-4 px-1.5 py-0 text-[9px] normal-case tracking-normal">
                          {deliveryOrder.collectionPickup.status === "collected"
                            ? "Collected"
                            : "Awaiting pickup"}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-outline-variant/10 px-5 py-4">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

function PackingOrderCard({
  order,
  index,
}: {
  order: RestaurantOrderRecord;
  index: number;
}) {
  const total = orderTotal(order);
  const settled = orderSettledAmount(order);
  const paymentSummary = formatCheckoutPaymentSummary(order);
  const remaining = Math.max(total - settled, 0);
  const packCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-outline-variant/10 bg-surface-container-low/30 px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                {index}
              </span>
              <h3 className="font-headline text-lg font-extrabold text-on-surface">
                {order.customerName}
              </h3>
              <Badge tone={orderStatusTone(order.status)} className="normal-case tracking-normal">
                {order.status}
              </Badge>
              <Badge tone="neutral" className="normal-case tracking-normal">
                {formatOrderFulfillmentType(order)}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-secondary">
              #{order.code} · {order.placedAtLabel} · {order.venueLabel} · {packCount} packs/items
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/orders/${order.id}`}>
              <Button variant="secondary" size="sm" type="button">
                <MaterialIcon name="open_in_new" className="text-lg" />
                Open order
              </Button>
            </Link>
            <Link href={`/orders/${order.id}/edit`}>
              <Button variant="primary" size="sm" type="button">
                <MaterialIcon name="edit_note" className="text-lg" />
                Action
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4 py-4 xl:grid-cols-[1.4fr_0.85fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-lg bg-surface p-3 ring-1 ring-outline-variant/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                Service / area
              </p>
              <p className="mt-1 text-sm font-semibold text-on-surface">
                {order.serviceLocation ?? order.postcode}
              </p>
            </div>
            <div className="rounded-lg bg-surface p-3 ring-1 ring-outline-variant/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                Server
              </p>
              <p className="mt-1 text-sm font-semibold text-on-surface">{order.serverName}</p>
            </div>
            <div className="rounded-lg bg-surface p-3 ring-1 ring-outline-variant/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                Payment
              </p>
              <p className="mt-1 text-sm font-semibold text-on-surface">{paymentSummary}</p>
            </div>
            <div className="rounded-lg bg-surface p-3 ring-1 ring-outline-variant/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                Remaining
              </p>
              <p className="mt-1 text-sm font-semibold text-on-surface">
                {formatGbp(remaining)}
              </p>
            </div>
            <div className="rounded-lg bg-surface p-3 ring-1 ring-outline-variant/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                Packs
              </p>
              <p className="mt-1 text-sm font-semibold text-on-surface">
                {packCount}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-surface ring-1 ring-outline-variant/10">
            <div className="border-b border-outline-variant/10 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-on-surface">Packing items</p>
                <p className="text-[11px] font-medium text-secondary">
                  Index, item name, quantity, and prep cue for packers.
                </p>
              </div>
            </div>
            <Table>
              <TableHead className="bg-surface-container-low/40">
                <TableRow className="hover:bg-transparent">
                  <TableHeaderCell className={compactHeadCellClass("w-14")}>#</TableHeaderCell>
                  <TableHeaderCell className={compactHeadCellClass()}>Item</TableHeaderCell>
                  <TableHeaderCell className={compactHeadCellClass("text-right w-20")}>Qty</TableHeaderCell>
                  <TableHeaderCell className={compactHeadCellClass("hidden md:table-cell")}>
                    Prep
                  </TableHeaderCell>
                  <TableHeaderCell className={compactHeadCellClass("hidden xl:table-cell text-right")}>
                    Value
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.lines.map((line, lineIndex) => (
                  <TableRow key={line.id}>
                    <TableCell className={compactCellClass("font-bold text-secondary")}>
                      {lineIndex + 1}
                    </TableCell>
                    <TableCell className={compactCellClass()}>
                      <div className="min-w-0">
                        <p className="font-semibold text-on-surface">
                          {line.productId.replace(/^prd-/, "").replace(/-/g, " ")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-secondary">
                          Unit {formatGbp(line.unitPriceExTax)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className={compactCellClass("text-right text-sm font-extrabold text-on-surface")}>
                      {line.quantity}
                    </TableCell>
                    <TableCell className={compactCellClass("hidden md:table-cell")}>
                      <Badge
                        tone={line.needsKitchen === false ? "neutral" : "warning"}
                        className="normal-case tracking-normal"
                      >
                        {line.needsKitchen === false ? "Ready packed" : "Kitchen pack"}
                      </Badge>
                    </TableCell>
                    <TableCell className={compactCellClass("hidden xl:table-cell text-right font-semibold text-on-surface")}>
                      {formatGbp(line.quantity * line.unitPriceExTax)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/10">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
              Customer
            </p>
            <p className="mt-2 text-sm font-semibold text-on-surface">{order.customerName}</p>
            <p className="mt-1 text-sm text-secondary">{order.customerPhone}</p>
            {order.customerEmail ? (
              <p className="mt-1 text-sm text-secondary">{order.customerEmail}</p>
            ) : null}
            <div className="mt-3 space-y-1 text-xs font-medium text-secondary">
              <p>Postcode {order.postcode}</p>
              <p>{order.serviceLocation ?? "No service location set"}</p>
            </div>
          </div>

          <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/10">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
              Packing / dispatch notes
            </p>
            <p className="mt-2 text-sm text-on-surface">
              {order.internalNotes || "No internal notes added yet."}
            </p>
            {order.priorityNote ? (
              <p className="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-sm font-medium text-primary">
                Priority: {order.priorityNote}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/10">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
              Payment snapshot
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-container-low/40 px-3 py-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                  To pay
                </p>
                <p className="mt-1 text-base font-extrabold text-on-surface">{formatGbp(total)}</p>
              </div>
              <div className="rounded-lg bg-surface-container-low/40 px-3 py-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                  Settled
                </p>
                <p className="mt-1 text-base font-extrabold text-on-surface">{formatGbp(settled)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-secondary">
              Payment mode: {paymentSummary}
            </p>
          </div>

          <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/10">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
              Quick actions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={`/orders/${order.id}`}>
                <Button variant="secondary" size="sm" type="button">
                  <MaterialIcon name="visibility" className="text-lg" />
                  View
                </Button>
              </Link>
              <Link href={`/orders/${order.id}/edit`}>
                <Button variant="primary" size="sm" type="button">
                  <MaterialIcon name="inventory" className="text-lg" />
                  Pack / manage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function OrderViewActionClient({
  orders,
  deliveryOrders,
  driverOrders,
  routePlans,
}: Props) {
  const [query, setQuery] = useState("");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentBucketKey | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedRouteAgentId, setSelectedRouteAgentId] = useState(routePlans[0]?.agentId ?? "");
  const [ordersPopup, setOrdersPopup] = useState<OrdersPopupState | null>(null);
  const [assignmentOverrides, setAssignmentOverrides] = useState<Record<string, string>>({});

  const checkedInCount = CHECKED_IN_USERS.length;
  const deliveryAgentsList = useMemo(() => listDeliveryAgents(), []);
  const deliveryAgents = useMemo(() => {
    return new Map(deliveryAgentsList.map((agent) => [agent.id, agent.name]));
  }, [deliveryAgentsList]);
  const restaurantOrders = useMemo(() => {
    return new Map(orders.map((order) => [order.id, order]));
  }, [orders]);
  const localDeliveryOrders = useMemo(() => {
    return deliveryOrders.map((order) => {
      const overriddenAgentId = assignmentOverrides[order.id];
      if (overriddenAgentId === undefined) return order;
      return {
        ...order,
        assignedAgentId: overriddenAgentId || undefined,
        dispatchStatus:
          overriddenAgentId && order.dispatchStatus === "unassigned"
            ? ("assigned" as const)
            : order.dispatchStatus,
      };
    });
  }, [assignmentOverrides, deliveryOrders]);
  const areaStats = useMemo(() => computeDeliveryAreaStats(localDeliveryOrders), [localDeliveryOrders]);
  const collectionSummary = useMemo(
    () => computeDeliveryCollectionSummary(localDeliveryOrders),
    [localDeliveryOrders],
  );
  const paymentMetrics = useMemo(() => buildPaymentMetrics(orders), [orders]);
  const localDriverOrders = useMemo(
    () => buildDriverRows(localDeliveryOrders, deliveryAgentsList, driverOrders),
    [deliveryAgentsList, driverOrders, localDeliveryOrders],
  );

  const totalOrderValue = useMemo(() => {
    return orders.reduce((sum, order) => sum + orderTotal(order), 0);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery =
        trimmed.length === 0 ||
        order.code.toLowerCase().includes(trimmed) ||
        order.customerName.toLowerCase().includes(trimmed) ||
        order.postcode.toLowerCase().includes(trimmed) ||
        order.serverName.toLowerCase().includes(trimmed);

      const matchesFulfillment =
        fulfillmentFilter === "all" || getOrderFulfillmentType(order) === fulfillmentFilter;

      const matchesPayment =
        paymentFilter === "all" || orderPaymentBucket(order) === paymentFilter;

      return matchesQuery && matchesFulfillment && matchesPayment;
    });
  }, [fulfillmentFilter, orders, paymentFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredOrders.slice(start, start + PER_PAGE);
  }, [currentPage, filteredOrders]);

  const selectedRoute = useMemo(() => {
    return routePlans.find((plan) => plan.agentId === selectedRouteAgentId) ?? routePlans[0] ?? null;
  }, [routePlans, selectedRouteAgentId]);

  const areaOwners = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const order of localDeliveryOrders) {
      const outcode = outwardUkPostcode(order.postcode);
      const assignedName = order.assignedAgentId ? deliveryAgents.get(order.assignedAgentId) : null;
      const current = map.get(outcode) ?? [];
      if (assignedName && !current.includes(assignedName)) current.push(assignedName);
      map.set(outcode, current);
    }
    return map;
  }, [deliveryAgents, localDeliveryOrders]);

  const popupOrders = useMemo(() => {
    if (!ordersPopup) return [];
    if (ordersPopup.kind === "area") {
      return localDeliveryOrders.filter((order) => outwardUkPostcode(order.postcode) === ordersPopup.id);
    }
    if (ordersPopup.kind === "driver") {
      return localDeliveryOrders.filter((order) => order.assignedAgentId === ordersPopup.id);
    }
    return localDeliveryOrders.filter((order) => {
      if (!order.collectionPickup) return false;
      return ordersPopup.id === "all" || order.collectionPickup.status === ordersPopup.id;
    });
  }, [localDeliveryOrders, ordersPopup]);

  const assignDeliveryOrder = (orderId: string, agentId: string) => {
    setAssignmentOverrides((prev) => ({ ...prev, [orderId]: agentId }));
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
            Checked in staff
          </p>
          <p className="mt-2 font-headline text-3xl font-extrabold text-on-surface">{checkedInCount}</p>
          <p className="mt-1 text-xs font-medium text-secondary">
            Kitchen, dispatch, and driver queue on shift now.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
            Live operational orders
          </p>
          <p className="mt-2 font-headline text-3xl font-extrabold text-on-surface">{orders.length}</p>
          <p className="mt-1 text-xs font-medium text-secondary">
            Actionable orders with detail, payment, and handoff controls.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
            Collections waiting
          </p>
          <p className="mt-2 font-headline text-3xl font-extrabold text-primary">
            {collectionSummary.yetToCollect}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">
            {collectionSummary.collected} already collected from counter handoff.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
            Order value in play
          </p>
          <p className="mt-2 font-headline text-3xl font-extrabold text-on-surface">
            {formatGbp(totalOrderValue)}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">
            Gross payable across the current operational stack.
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="font-headline text-lg font-extrabold text-on-surface">
              Order cockpit filters
            </h2>
            <p className="mt-1 text-sm font-medium text-secondary">
              Search and narrow the detailed order stack below. This page keeps five orders per page for easier actioning.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3 xl:min-w-[52rem]">
            <Input
              label="Search"
              placeholder="Order code, customer, postcode, server…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              left={<MaterialIcon name="search" className="text-lg" />}
              controlSize="sm"
            />
            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-secondary">
                Fulfillment
              </label>
              <select
                value={fulfillmentFilter}
                onChange={(e) => {
                  setFulfillmentFilter(e.target.value);
                  setPage(1);
                }}
                className="min-h-9 w-full rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
              >
                <option value="all">All types</option>
                <option value="collection">Collections</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-secondary">
                Payment bucket
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value as PaymentBucketKey | "all");
                  setPage(1);
                }}
                className="min-h-9 w-full rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary"
              >
                <option value="all">All payment states</option>
                <option value="unpaid">Unpaid / pending</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="wallet">Wallet</option>
                <option value="multiple">Split tender</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6">
        <CompactTableCard
          title="Checked in users"
          subtitle="Compact stall and dispatch staffing view for the current service."
        >
          <Table>
            <TableHead className="bg-surface-container-low/50">
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell className={compactHeadCellClass()}>Staff</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("hidden md:table-cell")}>
                  Stall / station
                </TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("hidden lg:table-cell")}>
                  Status
                </TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Time</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CHECKED_IN_USERS.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className={compactCellClass()}>
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface">{user.name}</p>
                      <p className="mt-0.5 text-[11px] text-secondary">{user.role}</p>
                    </div>
                  </TableCell>
                  <TableCell className={compactCellClass("hidden md:table-cell text-secondary")}>
                    {user.station}
                  </TableCell>
                  <TableCell className={compactCellClass("hidden lg:table-cell")}>
                    <Badge tone={user.status === "Checked in" ? "success" : "warning"} className="normal-case tracking-normal">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={compactCellClass("text-right font-semibold text-on-surface")}>
                    {user.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CompactTableCard>

        <CompactTableCard
          title="Area wise orders"
          subtitle="Grouped by outward postcode with driver ownership and handoff progress."
        >
          <Table>
            <TableHead className="bg-surface-container-low/50">
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell className={compactHeadCellClass()}>Area</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Total</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right hidden md:table-cell")}>
                  Need driver
                </TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right hidden lg:table-cell")}>
                  Out now
                </TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Done</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {areaStats.map((row) => (
                <TableRow key={row.outcode}>
                  <TableCell className={compactCellClass()}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-on-surface">{row.outcode}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setOrdersPopup({
                              kind: "area",
                              id: row.outcode,
                              title: `${row.outcode} orders`,
                              description: `${row.areaLabel} · assign and inspect delivery tickets.`,
                            })
                          }
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          Show
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-secondary">{row.areaLabel}</p>
                      <p className="mt-0.5 text-[11px] text-secondary">
                        {areaOwners.get(row.outcode)?.join(", ") || "No driver assigned yet"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className={compactCellClass("text-right font-semibold text-on-surface")}>
                    <button
                      type="button"
                      onClick={() =>
                        setOrdersPopup({
                          kind: "area",
                          id: row.outcode,
                          title: `${row.outcode} orders`,
                          description: `${row.areaLabel} · ${row.total} total orders.`,
                        })
                      }
                      className="font-semibold tabular-nums text-on-surface hover:text-primary hover:underline"
                    >
                      {row.total}
                    </button>
                  </TableCell>
                  <TableCell className={compactCellClass("hidden md:table-cell text-right font-semibold text-primary")}>
                    <button
                      type="button"
                      onClick={() =>
                        setOrdersPopup({
                          kind: "area",
                          id: row.outcode,
                          title: `${row.outcode} orders needing attention`,
                          description: `${row.areaLabel} · assign unowned orders from this list.`,
                        })
                      }
                      className="font-semibold tabular-nums text-primary hover:underline"
                    >
                      {row.unassigned}
                    </button>
                  </TableCell>
                  <TableCell className={compactCellClass("hidden lg:table-cell text-right font-semibold text-on-surface")}>
                    {row.assigned + row.enRoute}
                  </TableCell>
                  <TableCell className={compactCellClass("text-right font-semibold text-on-surface")}>
                    {row.delivered}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CompactTableCard>
      </div>

      <div className="grid gap-6">
        <CompactTableCard
          title="Collections"
          subtitle="Counter pickup demand routed through the kitchen hub."
        >
          <Table>
            <TableHead className="bg-surface-container-low/50">
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell className={compactHeadCellClass()}>Place</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Total</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Yet to collect</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Collected</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={compactCellClass()}>
                  <p className="font-semibold text-on-surface">43 Clifton Road</p>
                  <p className="mt-0.5 text-[11px] text-secondary">Main pickup desk and collection handoff</p>
                </TableCell>
                <TableCell className={compactCellClass("text-right font-semibold text-on-surface")}>
                  <button
                    type="button"
                    onClick={() =>
                      setOrdersPopup({
                        kind: "collection",
                        id: "all",
                        title: "Collection orders",
                        description: "All counter pickup orders for the main handoff desk.",
                      })
                    }
                    className="font-semibold tabular-nums text-on-surface hover:text-primary hover:underline"
                  >
                    {collectionSummary.total}
                  </button>
                </TableCell>
                <TableCell className={compactCellClass("text-right font-semibold text-primary")}>
                  <button
                    type="button"
                    onClick={() =>
                      setOrdersPopup({
                        kind: "collection",
                        id: "awaiting_pickup",
                        title: "Yet to collect",
                        description: "Pickup orders still waiting for handoff.",
                      })
                    }
                    className="font-semibold tabular-nums text-primary hover:underline"
                  >
                    {collectionSummary.yetToCollect}
                  </button>
                </TableCell>
                <TableCell className={compactCellClass("text-right font-semibold text-on-surface")}>
                  <button
                    type="button"
                    onClick={() =>
                      setOrdersPopup({
                        kind: "collection",
                        id: "collected",
                        title: "Collected orders",
                        description: "Pickup orders already collected from counter handoff.",
                      })
                    }
                    className="font-semibold tabular-nums text-on-surface hover:text-primary hover:underline"
                  >
                    {collectionSummary.collected}
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CompactTableCard>

        <CompactTableCard
          title="Driver orders"
          subtitle="Delivery workload split by active driver."
        >
          <Table>
            <TableHead className="bg-surface-container-low/50">
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell className={compactHeadCellClass()}>Driver</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Total</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Yet</TableHeaderCell>
                <TableHeaderCell className={compactHeadCellClass("text-right")}>Done</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localDriverOrders.map((driver) => (
                <TableRow key={driver.agentId}>
                  <TableCell className={compactCellClass()}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-on-surface">{driver.name}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setOrdersPopup({
                              kind: "driver",
                              id: driver.agentId,
                              title: `${driver.name} orders`,
                              description: `${driver.total} assigned orders · reassign tickets from this popup.`,
                            })
                          }
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          Show
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-secondary">{driver.email}</p>
                      <p className="mt-0.5 text-[11px] text-secondary">
                        {driver.deliveredDetails ?? "No delivered drops yet"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className={compactCellClass("text-right font-semibold text-on-surface")}>
                    <button
                      type="button"
                      onClick={() =>
                        setOrdersPopup({
                          kind: "driver",
                          id: driver.agentId,
                          title: `${driver.name} orders`,
                          description: `${driver.total} assigned orders · reassign tickets from this popup.`,
                        })
                      }
                      className="font-semibold tabular-nums text-on-surface hover:text-primary hover:underline"
                    >
                      {driver.total}
                    </button>
                  </TableCell>
                  <TableCell className={compactCellClass("text-right font-semibold text-primary")}>
                    <button
                      type="button"
                      onClick={() =>
                        setOrdersPopup({
                          kind: "driver",
                          id: driver.agentId,
                          title: `${driver.name} active orders`,
                          description: `${driver.yetToDeliver} orders still to deliver.`,
                        })
                      }
                      className="font-semibold tabular-nums text-primary hover:underline"
                    >
                      {driver.yetToDeliver}
                    </button>
                  </TableCell>
                  <TableCell className={compactCellClass("text-right font-semibold text-on-surface")}>
                    {driver.delivered}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CompactTableCard>

        <Card className="p-4">
          <div>
            <h2 className="font-headline text-base font-extrabold text-on-surface">
              Order count based on payment types
            </h2>
            <p className="mt-1 text-xs font-medium text-secondary">
              Count plus settled value for the current operational order set.
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {paymentMetrics.map((metric) => (
              <div
                key={metric.key}
                className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/10"
              >
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                  {metric.label}
                </p>
                <p className="mt-2 font-headline text-2xl font-extrabold text-on-surface">
                  {metric.count}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {formatGbp(metric.amount)}
                </p>
                <p className="mt-1 text-[11px] text-secondary">{metric.caption}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-headline text-lg font-extrabold text-on-surface">Planned route</h2>
            <p className="mt-1 text-sm font-medium text-secondary">
              Compact route planner showing hub-to-stop sequence for drivers already carrying orders.
            </p>
          </div>
          {routePlans.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {routePlans.map((plan) => (
                <button
                  key={plan.agentId}
                  type="button"
                  onClick={() => setSelectedRouteAgentId(plan.agentId)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                    selectedRoute?.agentId === plan.agentId
                      ? "bg-primary text-on-primary shadow-md shadow-primary-soft"
                      : "bg-surface text-secondary ring-1 ring-outline-variant/15 hover:bg-surface-container-high",
                  )}
                >
                  {plan.agentName}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {selectedRoute ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    Active route
                  </p>
                  <p className="mt-1 font-headline text-xl font-extrabold text-on-surface">
                    {routeDisplayId(selectedRoute)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-secondary">
                    {selectedRoute.agentName} · {selectedRoute.vehicle}
                  </p>
                </div>
                <Link
                  href={`/delivery/routes?highlight=${encodeURIComponent(selectedRoute.agentId)}`}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Open full route
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="rounded-lg bg-surface-container-low/40 px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    Stops
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-on-surface">
                    {selectedRoute.stops.length}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low/40 px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    ETA
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-on-surface">
                    ~{selectedRoute.estimatedMinutes} min
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low/40 px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    First stop
                  </p>
                  <p className="mt-1 text-sm font-semibold text-on-surface">
                    {selectedRoute.stops[0]?.postcode ?? "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low/40 px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    Last stop
                  </p>
                  <p className="mt-1 text-sm font-semibold text-on-surface">
                    {selectedRoute.stops[selectedRoute.stops.length - 1]?.postcode ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                Planned sequence
              </p>
              <div className="mt-3 space-y-3">
                {selectedRoute.stops.map((stop) => (
                  <div
                    key={stop.orderId}
                    className="flex items-start gap-3 rounded-lg bg-surface-container-low/40 px-3 py-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                      {stop.sequence}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-on-surface">{stop.code}</p>
                        {stop.linkedRestaurantOrderId ? (
                          <Link
                            href={`/orders/${stop.linkedRestaurantOrderId}`}
                            className="text-[11px] font-bold text-primary hover:underline"
                          >
                            View order
                          </Link>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-on-surface">{stop.customerName}</p>
                      <p className="mt-1 text-[11px] text-secondary">
                        {stop.shortAddress} · {stop.postcode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-surface p-6 text-sm font-medium text-secondary ring-1 ring-outline-variant/10">
            No active route plans right now.
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-headline text-lg font-extrabold text-on-surface">
              Order details stack
            </h2>
            <p className="mt-1 text-sm font-medium text-secondary">
              Up to five orders per page with packing items, quantities, payment status, notes, and quick actions.
            </p>
          </div>
          <div className="rounded-full bg-surface px-4 py-2 text-sm font-semibold text-secondary ring-1 ring-outline-variant/15">
            Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1}
            {" - "}
            {Math.min(currentPage * PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
          </div>
        </div>

        <div className="mt-5">
          {paginatedOrders.length === 0 ? (
            <Card className="p-8 text-center text-sm font-medium text-secondary">
              No orders match the current filters.
            </Card>
          ) : (
            <div className="space-y-4">
              {paginatedOrders.map((order, index) => (
                <PackingOrderCard
                  key={order.id}
                  order={order}
                  index={(currentPage - 1) * PER_PAGE + index + 1}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-secondary">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
            >
              <MaterialIcon name="chevron_left" className="text-lg" />
              Previous
            </Button>
            {pages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={cn(
                  "flex min-w-9 items-center justify-center rounded-full px-3 py-2 text-sm font-bold transition-colors",
                  pageNumber === currentPage
                    ? "bg-primary text-on-primary shadow-md shadow-primary-soft"
                    : "bg-surface text-secondary ring-1 ring-outline-variant/15 hover:bg-surface-container-high",
                )}
              >
                {pageNumber}
              </button>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <MaterialIcon name="chevron_right" className="text-lg" />
            </Button>
          </div>
        </div>
      </Card>

      <OrdersAssignmentPopup
        open={ordersPopup !== null}
        onClose={() => setOrdersPopup(null)}
        title={ordersPopup?.title ?? "Orders"}
        description={ordersPopup?.description ?? ""}
        orders={popupOrders}
        agents={deliveryAgentsList}
        restaurantOrders={restaurantOrders}
        onAssign={assignDeliveryOrder}
      />
    </div>
  );
}
