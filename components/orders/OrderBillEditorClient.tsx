"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MenuProductList } from "@/components/menu";
import type { MenuDocument } from "@/components/menu/types";
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
import { MENU_CATALOG_EVENT, mergeMenuWithLocal } from "@/lib/menu-local-catalog";
import { buildMenuCatalogByProductId, buildMenuImageUrlByProductId } from "@/lib/order-menu-catalog";
import {
  COLLECTION_PROMO_PERCENT,
  computeRestaurantBill,
  DELIVERY_FLAT_FEE_GBP,
  formatGbp,
} from "@/lib/order-bill-math";
import type { DiscountMode } from "@/lib/order-bill-math";
import type {
  CheckoutPaymentSummary,
  OrderBillLine,
  OrderCancellationMeta,
  OrderFulfillmentType,
  PaymentMethod,
  PaymentSplitRow,
  RestaurantOrderRecord,
} from "@/lib/orders-restaurant-data";
import { getCatalogProduct, getOrderFulfillmentType } from "@/lib/orders-restaurant-data";
import { readOrderArchivesMap, writeOrderArchive } from "@/lib/order-session-archives";
import menuDemo from "@/sandbox/menu-demo/menu-data.json";

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

function OrderLineItemThumbnail({
  imageUrl,
  label,
}: {
  imageUrl?: string | null;
  label: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!imageUrl || failed) {
    return (
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-container-high ring-1 ring-outline-variant/15"
        aria-hidden
      >
        <MaterialIcon name="restaurant" className="text-xl text-secondary" />
      </div>
    );
  }
  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-container-high ring-1 ring-outline-variant/15">
      <Image
        src={imageUrl}
        alt={label}
        fill
        className="object-cover"
        sizes="48px"
        onError={() => setFailed(true)}
        unoptimized={imageUrl.startsWith("data:")}
      />
    </div>
  );
}

function inferCheckoutPaymentSummary(order: RestaurantOrderRecord): CheckoutPaymentSummary {
  const nonzero = order.payments.filter((p) => parseAmount(p.amount) > 0.009);
  if (nonzero.length === 0) return "cash";
  const methods = [...new Set(nonzero.map((p) => p.method))];
  if (methods.length > 1) return "multiple";
  const m = methods[0]!;
  if (m === "card") return "card";
  if (m === "cash") return "cash";
  if (m === "wallet") return "wallet";
  return "card";
}

type Props = {
  mode: "create" | "edit";
  initial: RestaurantOrderRecord;
};

export function OrderBillEditorClient({ mode, initial }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<RestaurantOrderRecord>(() => structuredClone(initial));
  const [addOpen, setAddOpen] = useState(false);
  const [menuPickerKey, setMenuPickerKey] = useState(0);
  const [pickQuantities, setPickQuantities] = useState<Record<string, number>>({});
  const [menuRevision, setMenuRevision] = useState(0);
  const [newUserFormOpen, setNewUserFormOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    email: "",
    firstName: "",
    lastName: "",
    postcode: "",
  });
  const [profileSavedFlash, setProfileSavedFlash] = useState(false);
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

  useEffect(() => {
    if (!order.customerName.trim()) setNewUserFormOpen(false);
  }, [order.customerName]);

  const openNewUserForm = () => {
    setProfileDraft({
      email: order.customerEmail ?? "",
      firstName: order.customerFirstName ?? "",
      lastName: order.customerLastName ?? "",
      postcode: order.postcode ?? "",
    });
    setNewUserFormOpen(true);
  };

  const saveCustomerProfileDetails = () => {
    setOrder((o) => ({
      ...o,
      customerEmail: profileDraft.email.trim() || undefined,
      customerFirstName: profileDraft.firstName.trim() || undefined,
      customerLastName: profileDraft.lastName.trim() || undefined,
      postcode: profileDraft.postcode.trim() || o.postcode,
    }));
    setProfileSavedFlash(true);
    window.setTimeout(() => setProfileSavedFlash(false), 2200);
  };

  const menuDoc = useMemo(
    () => mergeMenuWithLocal(menuDemo as MenuDocument),
    [menuRevision],
  );

  useEffect(() => {
    const bump = () => setMenuRevision((n) => n + 1);
    window.addEventListener(MENU_CATALOG_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(MENU_CATALOG_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const menuCatalogById = useMemo(() => buildMenuCatalogByProductId(menuDoc), [menuDoc]);
  const menuImageByProductId = useMemo(() => buildMenuImageUrlByProductId(menuDoc), [menuDoc]);

  const resolveBillProduct = (productId: string) =>
    getCatalogProduct(productId) ?? menuCatalogById.get(productId);

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

  const updateLine = (lineId: string, patch: Partial<OrderBillLine>) => {
    setOrder((o) => ({
      ...o,
      lines: o.lines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
    }));
  };

  const removeLine = (lineId: string) => {
    setOrder((o) => ({ ...o, lines: o.lines.filter((l) => l.id !== lineId) }));
  };

  const applyMenuSelectionsToBill = () => {
    const entries = Object.entries(pickQuantities).filter(([, q]) => q > 0);
    if (entries.length === 0) {
      setAddOpen(false);
      return;
    }
    setOrder((o) => {
      let lines = [...o.lines];
      for (const [productId, qty] of entries) {
        const product = resolveBillProduct(productId);
        if (!product) continue;
        const existing = lines.find((l) => l.productId === productId);
        if (existing) {
          lines = lines.map((l) =>
            l.id === existing.id ? { ...l, quantity: l.quantity + qty } : l,
          );
        } else {
          lines.push({
            id: newLineId(),
            productId: product.id,
            quantity: qty,
            unitPriceExTax: product.unitPriceExTax,
            needsKitchen: product.category !== "Bar",
          });
        }
      }
      return { ...o, lines };
    });
    setAddOpen(false);
    setPickQuantities({});
  };

  const pickTotalCount = useMemo(
    () => Object.values(pickQuantities).reduce((s, q) => s + Math.max(0, q), 0),
    [pickQuantities],
  );

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

  const customerNameEntered = order.customerName.trim().length > 0;

  const customerDetailsCard = (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
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
          {customerNameEntered ? (
            <div className="flex flex-col gap-3">
              {!newUserFormOpen ? (
                <Button type="button" variant="outline" size="sm" className="w-fit" onClick={openNewUserForm}>
                  <MaterialIcon name="person_add" className="text-lg" />
                  Create new user
                </Button>
              ) : (
                <div className="space-y-4 rounded-xl bg-surface-container-low/80 p-4 ring-1 ring-outline-variant/15">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">
                    Guest profile
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Email"
                      name="customerEmailDraft"
                      type="email"
                      autoComplete="email"
                      value={profileDraft.email}
                      onChange={(e) => setProfileDraft((d) => ({ ...d, email: e.target.value }))}
                      placeholder="name@example.com"
                    />
                    <Input
                      label="Postcode"
                      name="customerPostcodeDraft"
                      autoComplete="postal-code"
                      value={profileDraft.postcode}
                      onChange={(e) => setProfileDraft((d) => ({ ...d, postcode: e.target.value }))}
                      placeholder="CB2 1TP"
                    />
                    <Input
                      label="First name"
                      name="customerFirstNameDraft"
                      autoComplete="given-name"
                      value={profileDraft.firstName}
                      onChange={(e) => setProfileDraft((d) => ({ ...d, firstName: e.target.value }))}
                      placeholder="First name"
                    />
                    <Input
                      label="Last name"
                      name="customerLastNameDraft"
                      autoComplete="family-name"
                      value={profileDraft.lastName}
                      onChange={(e) => setProfileDraft((d) => ({ ...d, lastName: e.target.value }))}
                      placeholder="Last name"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="primary" size="sm" onClick={saveCustomerProfileDetails}>
                      <MaterialIcon name="save" className="text-lg" />
                      Save details
                    </Button>
                    {profileSavedFlash ? (
                      <span className="text-xs font-semibold text-primary">Saved to ticket</span>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
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
  );

  const orderSummaryCard = (
    <Card className="p-0">
          <div className="flex flex-col gap-3 border-b border-outline-variant/15 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-headline text-lg font-extrabold text-on-surface">Order summary</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setPickQuantities({});
                setMenuPickerKey((k) => k + 1);
                setAddOpen(true);
              }}
            >
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
                  const product = resolveBillProduct(line.productId);
                  if (!product) return null;
                  const lineBase = line.quantity * line.unitPriceExTax;
                  const lineDisplay = order.taxIncluded ? lineBase * 1.15 : lineBase;
                  return (
                    <TableRow key={line.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <OrderLineItemThumbnail
                            imageUrl={menuImageByProductId.get(line.productId)}
                            label={product.name}
                          />
                          <div className="min-w-0">
                            <p className="font-headline font-bold text-on-surface">{product.name}</p>
                            <p className="line-clamp-2 text-xs font-medium leading-relaxed text-secondary">
                              {product.detail}
                            </p>
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
  );

  const internalNotesCard = (
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
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        {mode === "create" ? (
          <>
            {orderSummaryCard}
            {internalNotesCard}
            {customerDetailsCard}
          </>
        ) : (
          <>
            {customerDetailsCard}
            {orderSummaryCard}
            {internalNotesCard}
          </>
        )}
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
                    <option value="wallet">Apple Pay / Google Pay</option>
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
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        className="flex max-h-[92dvh] min-h-0 w-full max-w-7xl flex-col overflow-hidden rounded-xl p-0"
        unpadded
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-outline-variant/15 px-6 py-5">
            <h3 className="font-headline text-xl font-extrabold text-on-surface">Add menu items</h3>
            <p className="mt-1 text-sm leading-relaxed text-secondary">
              Search the menu, set quantities with the row controls, then add everything to the bill in one go.
              Prices follow the tax toggle on the bill.
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-2">
            <div className="mx-auto w-full max-w-6xl pb-4">
              <MenuProductList
                key={menuPickerKey}
                data={menuDoc}
                onCartChange={setPickQuantities}
                className="space-y-4"
                showItemInfo={false}
              />
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 border-t border-outline-variant/15 bg-surface-container-lowest px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-secondary">
              {pickTotalCount > 0 ? (
                <>
                  <span className="font-extrabold text-on-surface">{pickTotalCount}</span> portion
                  {pickTotalCount === 1 ? "" : "s"} selected
                </>
              ) : (
                "Select items above, then add to the bill."
              )}
            </p>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Button type="button" variant="ghost" size="md" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={pickTotalCount === 0}
                onClick={applyMenuSelectionsToBill}
              >
                <MaterialIcon name="add_shopping_cart" className="text-lg" />
                Add to bill
              </Button>
            </div>
          </div>
        </div>
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
