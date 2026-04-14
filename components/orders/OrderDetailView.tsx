"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";
import { COLLECTION_PROMO_PERCENT, computeRestaurantBill, formatGbp } from "@/lib/order-bill-math";
import type { BadgeTone } from "@/components/ui/Badge";
import {
  buildInitialSnapshot,
  fulfillmentProgressToStatus,
  readFulfillmentSnapshot,
  writeFulfillmentSnapshot,
  type FulfillmentSnapshot,
} from "@/lib/order-fulfillment";
import type { OrderStatus, RestaurantOrderRecord } from "@/lib/orders-restaurant-data";
import {
  formatCheckoutPaymentSummary,
  formatDeliveryTimePerformance,
  getCatalogProduct,
  getOrderFulfillmentType,
  resolveLineNeedsKitchen,
} from "@/lib/orders-restaurant-data";
import { ORDER_ARCHIVES_EVENT, readOrderArchivesMap } from "@/lib/order-session-archives";
import { OrderFulfillmentTimeline } from "@/components/orders/OrderFulfillmentTimeline";
import { OrderStatusDropdown } from "@/components/orders/OrderStatusDropdown";

function categoryTone(category: string): BadgeTone {
  if (category === "Bar") return "info";
  if (category === "Main Course") return "warning";
  if (category === "Pasta") return "success";
  if (category === "Starter") return "neutral";
  if (category === "Dessert") return "error";
  return "neutral";
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

function notesStorageKey(orderId: string) {
  return `nc-order-notes:${orderId}`;
}

function readNotesAppend(orderId: string) {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(notesStorageKey(orderId)) ?? "";
  } catch {
    return "";
  }
}

function writeNotesAppend(orderId: string, value: string) {
  try {
    window.sessionStorage.setItem(notesStorageKey(orderId), value);
  } catch {
    /* ignore */
  }
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

/** Per-star state for a 1–5 rating (supports half star on the boundary bucket). */
function orderRatingStarStates(rating: number): ("full" | "half" | "empty")[] {
  const r = Math.min(5, Math.max(0, rating));
  const full = Math.floor(r);
  const frac = r - full;
  return Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "full";
    if (i > full) return "empty";
    if (frac >= 0.75) return "full";
    if (frac >= 0.25) return "half";
    return "empty";
  });
}

type Props = {
  order: RestaurantOrderRecord;
};

export function OrderDetailView({ order: serverOrder }: Props) {
  const [archiveMap, setArchiveMap] = useState<Record<string, RestaurantOrderRecord>>(() =>
    typeof window !== "undefined" ? readOrderArchivesMap() : {},
  );
  useEffect(() => {
    const sync = () => setArchiveMap(readOrderArchivesMap());
    sync();
    window.addEventListener(ORDER_ARCHIVES_EVENT, sync);
    return () => window.removeEventListener(ORDER_ARCHIVES_EVENT, sync);
  }, []);

  const order = archiveMap[serverOrder.id] ?? serverOrder;

  const readOnly = order.status === "completed" || order.status === "cancelled";
  const seedSnapshot = useMemo(
    () => buildInitialSnapshot(order.id, order.status, order.placedAtLabel),
    [order.id, order.status, order.placedAtLabel],
  );

  const [snapshot, setSnapshot] = useState<FulfillmentSnapshot>(seedSnapshot);
  const [printOpen, setPrintOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [notesAppend, setNotesAppend] = useState("");

  useEffect(() => {
    const stored = readFulfillmentSnapshot(order.id);
    if (stored) setSnapshot(stored);
    else setSnapshot(seedSnapshot);
    setNotesAppend(readNotesAppend(order.id));
  }, [order.id, seedSnapshot]);

  const derivedStatus = fulfillmentProgressToStatus(snapshot.progress);
  const displayStatus: OrderStatus = readOnly ? order.status : derivedStatus;

  const bill = useMemo(
    () =>
      computeRestaurantBill({
        lines: order.lines.map((l) => ({
          quantity: l.quantity,
          unitPriceExTax: l.unitPriceExTax,
        })),
        taxIncluded: order.taxIncluded,
        discountMode: order.discountMode,
        discountValue: order.discountValue,
        fulfillmentType: getOrderFulfillmentType(order),
      }),
    [order.lines, order.taxIncluded, order.discountMode, order.discountValue, order.fulfillmentType],
  );

  const paid = useMemo(
    () =>
      order.payments.reduce((s, p) => {
        const n = Number.parseFloat(p.amount);
        return s + (Number.isFinite(n) ? n : 0);
      }, 0),
    [order.payments],
  );
  const remaining = Math.max(0, bill.totalPayable - paid);
  const isPaid = remaining <= 0.009;

  const saveNote = () => {
    const line = noteDraft.trim();
    if (!line) {
      setNoteOpen(false);
      return;
    }
    const stamp = new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    const block = `[${stamp}] ${line}`;
    const merged = notesAppend ? `${notesAppend}\n${block}` : block;
    setNotesAppend(merged);
    writeNotesAppend(order.id, merged);
    setNoteDraft("");
    setNoteOpen(false);
  };

  const lineCount = order.lines.length;
  const fulfillment = getOrderFulfillmentType(order);

  const deliveryTimeSummary =
    order.deliveryPromisedMinutes != null && order.deliveryActualMinutes != null
      ? formatDeliveryTimePerformance(order.deliveryPromisedMinutes, order.deliveryActualMinutes)
      : null;
  const showCompletedDeliveryHandoff =
    order.status === "completed" &&
    fulfillment === "delivery" &&
    Boolean(order.deliveryDriverName || deliveryTimeSummary);

  const hasGuestFeedback =
    order.customerOrderRating != null || Boolean(order.customerOrderReview?.trim());
  const ratingStars = order.customerOrderRating != null ? orderRatingStarStates(order.customerOrderRating) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-2 sm:mr-auto">
          {statusBadge(displayStatus)}
          <span className="text-xs font-extrabold uppercase tracking-widest text-secondary">
            {order.taxIncluded ? "Tax incl." : "Tax excl."}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="md" onClick={() => setPrintOpen(true)}>
            <MaterialIcon name="print" className="text-lg" />
            Print invoice
          </Button>
          {readOnly ? null : (
            <>
              <OrderStatusDropdown
                placedAtLabel={order.placedAtLabel}
                snapshot={snapshot}
                onCommit={(next) => {
                  setSnapshot(next);
                  writeFulfillmentSnapshot(order.id, next);
                }}
              />
              <Link
                href={`/orders/${order.id}/edit`}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-md transition-all active:scale-95",
                  "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/85",
                )}
              >
                <MaterialIcon name="edit_note" className="text-lg" />
                Edit order
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-8 lg:col-span-8">
          <Card className="overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/15 px-6 py-4">
              <h3 className="font-headline text-lg font-extrabold text-on-surface">Order items</h3>
              <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-on-tertiary-fixed">
                {lineCount} items
              </span>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Product</TableHeaderCell>
                  <TableHeaderCell className="text-center">Kitchen</TableHeaderCell>
                  <TableHeaderCell className="text-center">Quantity</TableHeaderCell>
                  <TableHeaderCell className="text-right">Price</TableHeaderCell>
                  <TableHeaderCell className="text-right">Subtotal</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.lines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-secondary">
                      No items on this ticket.
                    </TableCell>
                  </TableRow>
                ) : (
                  order.lines.map((line) => {
                    const product = getCatalogProduct(line.productId);
                    if (!product) return null;
                    const unit = order.taxIncluded ? line.unitPriceExTax * 1.15 : line.unitPriceExTax;
                    const sub = unit * line.quantity;
                    const cook = resolveLineNeedsKitchen(line, product.category);
                    return (
                      <TableRow key={line.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface-container-high ring-1 ring-outline-variant/15">
                              <MaterialIcon name="restaurant" className="text-2xl text-secondary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-headline font-bold text-on-surface">{product.name}</p>
                              <p className="text-xs text-secondary">{product.detail}</p>
                              <Badge tone={categoryTone(product.category)} className="mt-2 sm:hidden">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {cook ? (
                            <Badge tone="warning">Cook</Badge>
                          ) : (
                            <span className="text-xs font-bold text-secondary">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-bold tabular-nums text-on-surface">{line.quantity}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums text-on-surface">{formatGbp(unit)}</TableCell>
                        <TableCell className="text-right font-extrabold tabular-nums text-on-surface">{formatGbp(sub)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-lg font-extrabold text-on-surface">Customer details</h3>
                <MaterialIcon name="person" className="text-2xl text-primary/40" />
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                    "bg-secondary-container text-on-secondary-container",
                  )}
                >
                  {initials(order.customerName || "Guest")}
                </div>
                <div className="min-w-0">
                  <p className="font-headline font-bold text-on-surface">{order.customerName || "Guest"}</p>
                </div>
              </div>
              <div className="space-y-3 border-t border-outline-variant/15 pt-3">
                <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
                  <MaterialIcon name="call" className="shrink-0 text-secondary" />
                  <span className="min-w-0">{order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MaterialIcon name="mail" className="shrink-0 text-secondary" />
                  {order.customerEmail ? (
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="min-w-0 break-all font-medium text-primary underline-offset-2 hover:underline"
                    >
                      {order.customerEmail}
                    </a>
                  ) : (
                    <span className="font-medium text-secondary">Not on file</span>
                  )}
                </div>
              </div>
              {hasGuestFeedback ? (
                <div className="space-y-3 border-t border-outline-variant/15 pt-3">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Guest feedback</p>
                  {order.customerOrderRating != null && ratingStars ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className="flex items-center gap-0.5"
                        role="img"
                        aria-label={`${order.customerOrderRating} out of 5 stars`}
                      >
                        {ratingStars.map((state, i) =>
                          state === "full" ? (
                            <MaterialIcon key={i} name="star" filled className="text-lg text-tertiary-container" />
                          ) : state === "half" ? (
                            <MaterialIcon key={i} name="star_half" className="text-lg text-tertiary-container" />
                          ) : (
                            <MaterialIcon key={i} name="star" className="text-lg text-outline-variant/45" />
                          ),
                        )}
                      </div>
                      <span className="font-headline text-sm font-bold tabular-nums text-on-surface">
                        {Number.isInteger(order.customerOrderRating)
                          ? `${order.customerOrderRating} / 5`
                          : `${order.customerOrderRating.toFixed(1)} / 5`}
                      </span>
                    </div>
                  ) : null}
                  {order.customerOrderReview?.trim() ? (
                    <div className="flex gap-2 rounded-xl bg-surface-container-low/80 p-3 ring-1 ring-outline-variant/10">
                      <MaterialIcon name="rate_review" className="mt-0.5 shrink-0 text-secondary" />
                      <p className="text-sm font-medium leading-relaxed text-on-surface">{order.customerOrderReview.trim()}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Card>

            <Card className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-lg font-extrabold text-on-surface">
                  {fulfillment === "collection" ? "Pickup" : "Service location"}
                </h3>
                <MaterialIcon name="location_on" className="text-2xl text-primary/40" />
              </div>
              {fulfillment === "collection" ? (
                <p className="text-sm font-bold text-on-surface">Collection</p>
              ) : (
                <>
                  <div className="relative h-24 w-full overflow-hidden rounded-xl bg-surface-container ring-1 ring-outline-variant/15">
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low opacity-90" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary-soft">
                        <MaterialIcon
                          name="location_on"
                          className="text-lg text-on-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-on-surface">
                    {order.serviceLocation ?? order.venueLabel}
                    {order.serviceLocationNote ? (
                      <>
                        <br />
                        <span className="text-xs font-normal italic text-secondary">{order.serviceLocationNote}</span>
                      </>
                    ) : null}
                  </p>
                  <p className="mt-3 border-t border-outline-variant/15 pt-3 text-xs font-extrabold uppercase tracking-widest text-secondary">
                    Postcode{" "}
                    <span className="font-headline text-sm font-bold tabular-nums tracking-normal text-on-surface">
                      {order.postcode}
                    </span>
                  </p>
                  {showCompletedDeliveryHandoff ? (
                    <div className="mt-3 space-y-3 border-t border-outline-variant/15 pt-3">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">
                        Delivery handoff
                      </p>
                      {order.deliveryDriverName ? (
                        <div className="flex gap-3">
                          <MaterialIcon name="delivery_dining" className="mt-0.5 shrink-0 text-lg text-secondary" />
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Driver</p>
                            <p className="mt-0.5 font-headline font-bold text-on-surface">{order.deliveryDriverName}</p>
                          </div>
                        </div>
                      ) : null}
                      {deliveryTimeSummary ? (
                        <div className="flex gap-3">
                          <MaterialIcon name="schedule" className="mt-0.5 shrink-0 text-lg text-secondary" />
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">
                              Door time
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-on-surface">{deliveryTimeSummary}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </Card>
          </div>

          {order.status === "cancelled" ? (
            <Card className="space-y-4 border-error/20 bg-error-container/10 p-6 sm:p-8 ring-1 ring-error/15">
              <div className="flex items-center gap-2">
                <MaterialIcon name="cancel" className="text-2xl text-error" />
                <h3 className="font-headline text-lg font-extrabold text-on-surface">Cancelled order</h3>
              </div>
              {order.cancellation ? (
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-extrabold uppercase tracking-widest text-secondary">Closed</dt>
                    <dd className="mt-1 font-bold text-on-surface">{order.cancellation.cancelledAtLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-extrabold uppercase tracking-widest text-secondary">Reason</dt>
                    <dd className="mt-1 font-medium leading-relaxed text-on-surface">{order.cancellation.reason}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-surface-container-low/80 px-4 py-3 ring-1 ring-outline-variant/15">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-secondary">
                      Return payment
                    </span>
                    <span className="font-extrabold text-on-surface">
                      {order.cancellation.returnPayment ? "Yes — flagged for finance" : "No"}
                    </span>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-secondary">No cancellation notes on file.</p>
              )}
            </Card>
          ) : (
            <Card className="p-6 sm:p-8">
              <h3 className="mb-6 font-headline text-lg font-extrabold text-on-surface">Order status timeline</h3>
              <OrderFulfillmentTimeline snapshot={snapshot} />
            </Card>
          )}
        </div>

        <div className="space-y-6 lg:col-span-4 lg:sticky lg:top-6">
          <Card className="p-6 sm:p-8">
            <h3 className="mb-6 border-b border-outline-variant/15 pb-4 font-headline text-lg font-extrabold text-on-surface">
              Summary
            </h3>
            <div className="space-y-4 text-sm">
              {readOnly ? (
                <>
                  {order.status === "completed" && order.completedAtLabel ? (
                    <div className="flex justify-between text-secondary">
                      <span>Completed</span>
                      <span className="max-w-[60%] text-right text-xs font-bold text-on-surface">
                        {order.completedAtLabel}
                      </span>
                    </div>
                  ) : null}
                  {order.status === "cancelled" && order.cancellation ? (
                    <>
                      <div className="flex justify-between text-secondary">
                        <span>Cancelled</span>
                        <span className="max-w-[60%] text-right text-xs font-bold text-on-surface">
                          {order.cancellation.cancelledAtLabel}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-secondary">
                        <span>Reason</span>
                        <span className="text-xs font-medium leading-relaxed text-on-surface">
                          {order.cancellation.reason}
                        </span>
                      </div>
                      <div className="flex justify-between text-secondary">
                        <span>Return payment</span>
                        <span className="font-bold text-on-surface">
                          {order.cancellation.returnPayment ? "Yes" : "No"}
                        </span>
                      </div>
                    </>
                  ) : null}
                  <div className="flex justify-between text-secondary">
                    <span>Payment</span>
                    <span className="font-bold text-on-surface">{formatCheckoutPaymentSummary(order)}</span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums text-on-surface">{formatGbp(bill.subtotal)}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Discount</span>
                <span className="font-semibold tabular-nums text-on-surface">−{formatGbp(bill.discountAmount)}</span>
              </div>
              {bill.fulfillmentCollectionDiscount > 0 ? (
                <div className="flex justify-between text-secondary">
                  <span>Pickup savings ({COLLECTION_PROMO_PERCENT}%)</span>
                  <span className="font-semibold tabular-nums text-on-surface">
                    −{formatGbp(bill.fulfillmentCollectionDiscount)}
                  </span>
                </div>
              ) : null}
              {bill.deliveryFee > 0 ? (
                <div className="flex justify-between text-secondary">
                  <span>Delivery fee</span>
                  <span className="font-semibold tabular-nums text-on-surface">{formatGbp(bill.deliveryFee)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-secondary">
                <span>GST (5%)</span>
                <span className="font-semibold tabular-nums text-on-surface">{formatGbp(bill.gst)}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Service (10%)</span>
                <span className="font-semibold tabular-nums text-on-surface">{formatGbp(bill.serviceCharge)}</span>
              </div>
              <div className="mt-4 flex items-end justify-between border-t-2 border-dashed border-outline-variant/25 pt-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Total amount</p>
                  <p className="font-headline text-3xl font-extrabold tabular-nums text-on-surface">
                    {formatGbp(bill.totalPayable)}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider",
                    isPaid ? "bg-green-50 text-green-700 ring-1 ring-green-100" : "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
                  )}
                >
                  {isPaid ? "Paid" : "Balance due"}
                </span>
              </div>
            </div>

            {readOnly ? null : (
              <div className="mt-8 space-y-3">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-secondary">Quick actions</p>
                <Link
                  href={`/orders/${order.id}/edit`}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-surface-container-high py-4 font-bold text-on-surface transition-colors hover:bg-surface-container-highest"
                >
                  <MaterialIcon name="edit" className="text-lg" />
                  Edit order items
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-error-container/25 py-4 font-bold text-error transition-colors hover:bg-error-container/40"
                >
                  <MaterialIcon name="cancel" className="text-lg" />
                  Cancel order
                </button>
              </div>
            )}

            {order.priorityNote ? (
              <div className="mt-8 rounded-xl border border-tertiary-fixed/30 bg-tertiary-fixed/10 p-4">
                <div className="flex gap-3">
                  <MaterialIcon name="info" className="text-tertiary" />
                  <div>
                    <p className="text-sm font-bold text-on-tertiary-fixed-variant">Service note</p>
                    <p className="mt-1 text-xs leading-relaxed text-on-tertiary-fixed-variant opacity-90">
                      {order.priorityNote}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </Card>

          <Card className="space-y-3 border border-outline-variant/15 bg-surface-container-low p-6">
            <h4 className="flex items-center gap-2 font-headline text-sm font-extrabold text-on-surface">
              <MaterialIcon name="sticky_note_2" className="text-lg" />
              Internal notes
            </h4>
            {order.internalNotes ? (
              <p className="text-xs leading-relaxed text-secondary">{order.internalNotes}</p>
            ) : (
              <p className="text-xs italic text-secondary">No baseline notes from the floor.</p>
            )}
            {notesAppend ? (
              <p className="whitespace-pre-wrap text-xs font-medium leading-relaxed text-on-surface">{notesAppend}</p>
            ) : null}
            {readOnly ? null : (
              <Button type="button" variant="ghost" size="sm" className="px-0 text-xs font-extrabold text-primary" onClick={() => setNoteOpen(true)}>
                Add note
              </Button>
            )}
          </Card>
        </div>
      </div>

      <Modal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        title="Print invoice"
        description="Demo only — connect a printer service to generate PDFs or kitchen chits."
        className="max-w-md"
      >
        <Button type="button" variant="primary" className="w-full" onClick={() => setPrintOpen(false)}>
          Close
        </Button>
      </Modal>

      <Modal open={noteOpen} onClose={() => setNoteOpen(false)} title="Add internal note" description="Saved for this browser session.">
        <div className="space-y-4">
          <Textarea
            label="Note"
            name="staffNote"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={4}
            placeholder="Runner instructions, allergy follow-up, comp approval…"
          />
          <div className="flex gap-2">
            <Button type="button" variant="primary" className="flex-1" onClick={saveNote}>
              Save note
            </Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setNoteOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
