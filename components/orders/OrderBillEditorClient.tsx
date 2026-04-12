"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import type { BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { SelectField } from "@/components/ui/SelectField";
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
import {
  COLLECTION_PROMO_PERCENT,
  computeRestaurantBill,
  DELIVERY_FLAT_FEE_GBP,
  formatGbp,
} from "@/lib/order-bill-math";
import type { DiscountMode } from "@/lib/order-bill-math";
import type {
  CatalogProduct,
  CheckoutPaymentSummary,
  OrderBillLine,
  OrderCancellationMeta,
  OrderFulfillmentType,
  PaymentMethod,
  PaymentSplitRow,
  RestaurantOrderRecord,
} from "@/lib/orders-restaurant-data";
import { getCatalogProduct, getOrderFulfillmentType, RESTAURANT_PRODUCT_CATALOG } from "@/lib/orders-restaurant-data";
import { readOrderArchivesMap, writeOrderArchive } from "@/lib/order-session-archives";

function categoryTone(category: string): BadgeTone {
  if (category === "Bar") return "info";
  if (category === "Main Course") return "warning";
  if (category === "Pasta") return "success";
  if (category === "Starter") return "neutral";
  if (category === "Dessert") return "error";
  return "neutral";
}

function newLineId() {
  return `ln-${globalThis.crypto?.randomUUID?.() ?? String(Date.now())}`;
}

function newPaymentId() {
  return `pay-${globalThis.crypto?.randomUUID?.() ?? String(Date.now())}`;
}

function parseAmount(raw: string) {
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function inferCheckoutPaymentSummary(order: RestaurantOrderRecord): CheckoutPaymentSummary {
  const nonzero = order.payments.filter((p) => parseAmount(p.amount) > 0.009);
  if (nonzero.length === 0) return "cash";
  const methods = [...new Set(nonzero.map((p) => p.method))];
  if (methods.length > 1) return "multiple";
  const m = methods[0]!;
  if (m === "card") return "card";
  if (m === "cash") return "cash";
  return "upi";
}

type Props = {
  mode: "create" | "edit";
  initial: RestaurantOrderRecord;
};

export function OrderBillEditorClient({ mode, initial }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<RestaurantOrderRecord>(() => structuredClone(initial));
  const [addOpen, setAddOpen] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [returnPayment, setReturnPayment] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || initial.id === "new") return;
    const archived = readOrderArchivesMap()[initial.id];
    if (archived?.status === "cancelled") {
      router.replace("/orders/history");
    } else if (archived?.status === "completed") {
      router.replace(`/orders/${initial.id}`);
    }
  }, [mode, initial.id, router]);

  useEffect(() => {
    setOrder(structuredClone(initial));
  }, [initial.id]);

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

  const paidSoFar = useMemo(
    () => order.payments.reduce((s, p) => s + parseAmount(p.amount), 0),
    [order.payments],
  );
  const remaining = Math.max(0, bill.totalPayable - paidSoFar);

  const filteredCatalog = useMemo(() => {
    const q = addQuery.trim().toLowerCase();
    if (!q) return RESTAURANT_PRODUCT_CATALOG;
    return RESTAURANT_PRODUCT_CATALOG.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.detail.toLowerCase().includes(q),
    );
  }, [addQuery]);

  const updateLine = (lineId: string, patch: Partial<OrderBillLine>) => {
    setOrder((o) => ({
      ...o,
      lines: o.lines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
    }));
  };

  const removeLine = (lineId: string) => {
    setOrder((o) => ({ ...o, lines: o.lines.filter((l) => l.id !== lineId) }));
  };

  const addProduct = (product: CatalogProduct) => {
    const next: OrderBillLine = {
      id: newLineId(),
      productId: product.id,
      quantity: 1,
      unitPriceExTax: product.unitPriceExTax,
      needsKitchen: product.category !== "Bar",
    };
    setOrder((o) => ({ ...o, lines: [...o.lines, next] }));
    setAddOpen(false);
    setAddQuery("");
  };

  const setDiscountMode = (discountMode: DiscountMode) => {
    setOrder((o) => ({ ...o, discountMode }));
  };

  const updatePayment = (id: string, patch: Partial<PaymentSplitRow>) => {
    setOrder((o) => ({
      ...o,
      payments: o.payments.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  };

  const addPaymentRow = () => {
    setOrder((o) => ({
      ...o,
      payments: [...o.payments, { id: newPaymentId(), method: "cash", amount: "" }],
    }));
  };

  const removePayment = (id: string) => {
    setOrder((o) => ({
      ...o,
      payments: o.payments.filter((p) => p.id !== id),
    }));
  };

  const headerMeta = (
    <p className="text-sm font-semibold text-secondary">
      ORDER #{order.code} • {order.placedAtLabel} • {order.serverName} (Server)
    </p>
  );

  const confirmCancelOrder = () => {
    const reason = cancelReason.trim();
    if (!reason || mode !== "edit" || initial.id === "new") return;
    const cancelledAtLabel = new Date().toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const cancellation: OrderCancellationMeta = {
      reason,
      returnPayment,
      cancelledAtLabel,
    };
    const archived: RestaurantOrderRecord = {
      ...order,
      status: "cancelled",
      cancellation,
    };
    writeOrderArchive(archived);
    setCancelOpen(false);
    setCancelReason("");
    setReturnPayment(false);
    router.push("/orders/history");
  };

  const completeOrder = () => {
    if (order.lines.length === 0 || remaining > 0.009) return;
    const completedAtLabel = new Date().toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const checkoutPaymentSummary = inferCheckoutPaymentSummary(order);
    if (mode === "edit" && initial.id !== "new") {
      writeOrderArchive({
        ...order,
        status: "completed",
        completedAtLabel,
        checkoutPaymentSummary,
      });
      router.push(`/orders/${order.id}`);
      return;
    }
    const id = `ord-local-${globalThis.crypto?.randomUUID?.().replace(/-/g, "").slice(0, 10) ?? String(Date.now())}`;
    const code = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
    writeOrderArchive({
      ...order,
      id,
      code,
      status: "completed",
      completedAtLabel,
      checkoutPaymentSummary,
    });
    router.push("/orders/history");
  };

  const fulfillmentMode = getOrderFulfillmentType(order);
  const canComplete = order.lines.length > 0 && remaining <= 0.009;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              {headerMeta}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
                <div>
                  <Input
                    label="Customer name"
                    name="customerName"
                    value={order.customerName}
                    onChange={(e) => setOrder((o) => ({ ...o, customerName: e.target.value }))}
                    placeholder="Guest name"
                  />
                </div>
                <div>
                  <Input
                    label="Phone"
                    name="customerPhone"
                    value={order.customerPhone}
                    onChange={(e) => setOrder((o) => ({ ...o, customerPhone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setToastOpen(true)}>
                <MaterialIcon name="print" className="text-lg" />
                Print bill
              </Button>
              {mode === "edit" && initial.id !== "new" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-error text-error hover:bg-error-container/30"
                  onClick={() => {
                    setCancelReason("");
                    setReturnPayment(false);
                    setCancelOpen(true);
                  }}
                >
                  <MaterialIcon name="cancel" className="text-lg" />
                  Cancel order
                </Button>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-0">
          <div className="flex flex-col gap-3 border-b border-outline-variant/15 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-headline text-lg font-extrabold text-on-surface">Order summary</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => setAddOpen(true)}>
              <MaterialIcon name="add" className="text-lg" />
              Add item
            </Button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Item details</TableHeaderCell>
                <TableHeaderCell className="hidden md:table-cell">Category</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Qty</TableHeaderCell>
                <TableHeaderCell>Subtotal</TableHeaderCell>
                <TableHeaderCell className="w-14" />
              </TableRow>
            </TableHead>
            <TableBody>
              {order.lines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm font-medium text-secondary">
                    No line items yet. Use &ldquo;Add item&rdquo; to build this bill.
                  </TableCell>
                </TableRow>
              ) : (
                order.lines.map((line) => {
                  const product = getCatalogProduct(line.productId);
                  if (!product) return null;
                  const lineBase = line.quantity * line.unitPriceExTax;
                  const lineDisplay = order.taxIncluded ? lineBase * 1.15 : lineBase;
                  return (
                    <TableRow key={line.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-container-high ring-1 ring-outline-variant/15">
                            <MaterialIcon name="restaurant" className="text-xl text-secondary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-headline font-bold text-on-surface">{product.name}</p>
                            <p className="text-xs font-medium text-secondary">{product.detail}</p>
                            <Badge tone={categoryTone(product.category)} className="mt-2 md:hidden">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge tone={categoryTone(product.category)}>{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold tabular-nums text-on-surface">
                        {formatGbp(order.taxIncluded ? line.unitPriceExTax * 1.15 : line.unitPriceExTax)}
                      </TableCell>
                      <TableCell>
                        <QuantityStepper
                          value={line.quantity}
                          onChange={(q) => updateLine(line.id, { quantity: q })}
                        />
                      </TableCell>
                      <TableCell className="font-extrabold tabular-nums text-on-surface">
                        {formatGbp(lineDisplay)}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          className="rounded-full p-2 text-secondary transition-colors hover:bg-error-container/40 hover:text-error"
                          aria-label={`Remove ${product.name}`}
                          onClick={() => removeLine(line.id)}
                        >
                          <MaterialIcon name="delete" className="text-xl" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <Textarea
            label="Internal notes"
            name="internalNotes"
            value={order.internalNotes}
            onChange={(e) => setOrder((o) => ({ ...o, internalNotes: e.target.value }))}
            placeholder="Allergies, coursing, comp reasons…"
            rows={5}
          />
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-6">
          <div className="mb-4 flex rounded-full bg-surface-container-low p-1 ring-1 ring-outline-variant/15">
            <button
              type="button"
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-extrabold uppercase tracking-widest transition-colors",
                order.taxIncluded ? "bg-primary text-on-primary shadow-primary-soft shadow-md" : "text-secondary",
              )}
              onClick={() => setOrder((o) => ({ ...o, taxIncluded: true }))}
            >
              Tax incl.
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-extrabold uppercase tracking-widest transition-colors",
                !order.taxIncluded ? "bg-primary text-on-primary shadow-primary-soft shadow-md" : "text-secondary",
              )}
              onClick={() => setOrder((o) => ({ ...o, taxIncluded: false }))}
            >
              Excl.
            </button>
          </div>

          <div className="mb-4">
            <SelectField
              label="Fulfillment"
              name="fulfillmentType"
              value={order.fulfillmentType ?? "collection"}
              onChange={(e) =>
                setOrder((o) => ({
                  ...o,
                  fulfillmentType: e.target.value as OrderFulfillmentType,
                }))
              }
            >
              <option value="delivery">Delivery</option>
              <option value="collection">Collection</option>
            </SelectField>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between font-semibold text-on-surface">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatGbp(bill.subtotal)}</span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low/80 p-3 ring-1 ring-outline-variant/10">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-on-surface">Discount</span>
                <div className="flex gap-1 rounded-full bg-surface-container-high p-0.5">
                  <button
                    type="button"
                    className={cn(
                      "rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider",
                      order.discountMode === "percent"
                        ? "bg-primary text-on-primary"
                        : "text-secondary",
                    )}
                    onClick={() => setDiscountMode("percent")}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider",
                      order.discountMode === "flat" ? "bg-primary text-on-primary" : "text-secondary",
                    )}
                    onClick={() => setDiscountMode("flat")}
                  >
                    $
                  </button>
                </div>
              </div>
              <input
                type="number"
                min={0}
                step={order.discountMode === "percent" ? 1 : 0.5}
                className="w-full rounded-xl border-none bg-surface px-3 py-2 text-sm font-bold tabular-nums text-on-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
                value={order.discountValue}
                onChange={(e) =>
                  setOrder((o) => ({ ...o, discountValue: Number.parseFloat(e.target.value) || 0 }))
                }
              />
              <div className="flex justify-between text-xs font-semibold text-secondary">
                <span>Discount applied</span>
                <span className="tabular-nums text-on-surface">−{formatGbp(bill.discountAmount)}</span>
              </div>
            </div>
            {bill.fulfillmentCollectionDiscount > 0 ? (
              <div className="flex justify-between text-secondary">
                <span>Pickup savings ({COLLECTION_PROMO_PERCENT}%)</span>
                <span className="tabular-nums font-semibold text-on-surface">
                  −{formatGbp(bill.fulfillmentCollectionDiscount)}
                </span>
              </div>
            ) : null}
            {bill.deliveryFee > 0 ? (
              <div className="flex justify-between text-secondary">
                <span>Delivery fee</span>
                <span className="tabular-nums font-semibold text-on-surface">{formatGbp(bill.deliveryFee)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-secondary">
              <span>GST 5%</span>
              <span className="tabular-nums font-semibold text-on-surface">{formatGbp(bill.gst)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Service 10%</span>
              <span className="tabular-nums font-semibold text-on-surface">{formatGbp(bill.serviceCharge)}</span>
            </div>
            <div className="flex items-end justify-between border-t border-outline-variant/20 pt-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-secondary">Total payable</span>
              <span className="font-headline text-2xl font-extrabold text-primary tabular-nums">
                {formatGbp(bill.totalPayable)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-sm font-extrabold uppercase tracking-widest text-secondary">
              Split payment
            </h3>
            <Button type="button" variant="ghost" size="sm" className="text-primary" onClick={addPaymentRow}>
              <MaterialIcon name="add" className="text-lg" />
              Add method
            </Button>
          </div>
          <div className="space-y-3">
            {order.payments.map((row) => (
              <div key={row.id} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <SelectField
                    label="Method"
                    name={`pm-${row.id}`}
                    value={row.method}
                    onChange={(e) =>
                      updatePayment(row.id, { method: e.target.value as PaymentMethod })
                    }
                  >
                    <option value="card">Credit card</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                  </SelectField>
                </div>
                <div className="w-full sm:w-36">
                  <Input
                    label="Amount"
                    name={`amt-${row.id}`}
                    inputMode="decimal"
                    value={row.amount}
                    onChange={(e) => updatePayment(row.id, { amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="button"
                  className="mb-1 self-end rounded-full p-2 text-secondary hover:bg-surface-container-low hover:text-error"
                  aria-label="Remove payment row"
                  onClick={() => removePayment(row.id)}
                  disabled={order.payments.length <= 1}
                >
                  <MaterialIcon name="close" className="text-lg" />
                </button>
              </div>
            ))}
          </div>
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-4 ring-1",
              remaining > 0.009
                ? "bg-error-container/40 ring-error/20 text-on-error-container"
                : "bg-green-50 ring-green-100 text-green-800",
            )}
          >
            <MaterialIcon name={remaining > 0.009 ? "error" : "check_circle"} className="text-2xl" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest">Remaining</p>
              <p className="font-headline text-lg font-extrabold tabular-nums">{formatGbp(remaining)}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-3 p-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-headline text-sm font-extrabold uppercase tracking-widest text-secondary">
              Fulfillment pricing
            </h3>
            <Badge tone={fulfillmentMode === "delivery" ? "info" : "neutral"}>
              {fulfillmentMode === "delivery" ? "Delivery" : "Collection"}
            </Badge>
          </div>
          {fulfillmentMode === "delivery" ? (
            <p className="text-sm leading-relaxed text-secondary">
              Delivery adds a flat{" "}
              <span className="font-bold text-on-surface">{formatGbp(DELIVERY_FLAT_FEE_GBP)}</span> courier fee on top
              of the totals above. Switch to collection to remove the fee and apply the pickup promo instead.
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-secondary">
              Collection applies{" "}
              <span className="font-bold text-on-surface">{COLLECTION_PROMO_PERCENT}%</span> off the food subtotal
              (shown as pickup savings).
            </p>
          )}
        </Card>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!canComplete}
          onClick={completeOrder}
        >
          <MaterialIcon name="check_circle" />
          Complete
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="md" className="w-full">
            Save draft
          </Button>
        </div>
        <p className="text-center text-xs font-medium text-secondary">
          {mode === "create" ? "Creating a new in-house ticket." : "Editing live order data (demo dataset)."}
        </p>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add menu item" description="Pick a dish from the catalog. Prices follow the tax toggle on the bill.">
        <div className="space-y-4">
          <Input
            label="Search catalog"
            name="catalogSearch"
            value={addQuery}
            onChange={(e) => setAddQuery(e.target.value)}
            placeholder="Steak, pasta, bar…"
            left={<MaterialIcon name="search" className="text-xl text-secondary" />}
          />
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {filteredCatalog.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => addProduct(p)}
                className="flex w-full items-center gap-3 rounded-xl bg-surface-container-low p-3 text-left ring-1 ring-outline-variant/15 transition-colors hover:bg-surface-container-high"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high">
                  <MaterialIcon name="restaurant_menu" className="text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-headline text-sm font-bold text-on-surface">{p.name}</p>
                  <p className="text-xs text-secondary">{p.detail}</p>
                </div>
                <span className="shrink-0 text-sm font-extrabold tabular-nums text-primary">
                  {formatGbp(order.taxIncluded ? p.unitPriceExTax * 1.15 : p.unitPriceExTax)}
                </span>
              </button>
            ))}
          </div>
          <Button type="button" variant="ghost" className="w-full" onClick={() => setAddOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        title="Sent to printer"
        description="This console is wired to sample data only — nothing was actually printed or charged."
        className="max-w-md"
      >
        <Button type="button" variant="primary" className="w-full" onClick={() => setToastOpen(false)}>
          Got it
        </Button>
      </Modal>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this order"
        description="The ticket moves to order history as cancelled. Tell the floor and kitchen separately if service already started."
        className="!w-full !max-w-2xl sm:!max-w-3xl"
      >
        <div className="space-y-4">
          <Textarea
            label="Reason for cancellation"
            name="cancelReason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={4}
            placeholder="Required — e.g. duplicate ticket, guest walked, cannot fulfil…"
          />
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/15">
            <input
              type="checkbox"
              className="mt-1 size-4 shrink-0 rounded border-outline-variant text-primary focus:ring-2 focus:ring-primary"
              checked={returnPayment}
              onChange={(e) => setReturnPayment(e.target.checked)}
            />
            <span>
              <span className="text-sm font-extrabold text-on-surface">Return payment to guest</span>
              <span className="mt-1 block text-xs font-medium leading-relaxed text-secondary">
                Tick if finance should refund card, cash, or wallet charges for this ticket.
              </span>
            </span>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              type="button"
              variant="primary"
              className="sm:flex-1"
              disabled={!cancelReason.trim()}
              onClick={confirmCancelOrder}
            >
              Confirm cancel
            </Button>
            <Button type="button" variant="ghost" className="sm:flex-1" onClick={() => setCancelOpen(false)}>
              Back to edit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
