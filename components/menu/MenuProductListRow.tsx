"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";
import { formatGbp } from "./format-gbp";
import type { MenuProduct } from "./types";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

export type MenuProductListRowProps = {
  item: MenuProduct;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove?: () => void;
  /** Full URL to item detail screen */
  detailHref?: string;
  /** When false, cart UI is hidden and `productEditHref` is shown instead (catalog / admin mode). */
  showCartControls?: boolean;
  /** Opens add-product screen with this item prefilled (`/menu/new?itemId=…`). */
  productEditHref?: string;
  /** When false, the header info icon is omitted (compact pickers). */
  showItemInfo?: boolean;
  /** Direct quantity entry (clamped by parent). Shown before Add / before the +/- stepper when in cart. */
  onQuantityCommit?: (next: number) => void;
  className?: string;
};

function primaryPrice(item: MenuProduct): number {
  const v = item.variants[0];
  return v?.price_gbp ?? item.base_price_gbp;
}

/** Remaining count shown under price; subtracts lines already on this picker. */
function stockLabel(item: MenuProduct, pickedQty: number): string | null {
  if (!item.available) return null;
  if (typeof item.available_qty === "number") {
    if (item.available_qty <= 0) return null;
    const remaining = Math.max(0, item.available_qty - pickedQty);
    return `${remaining} available`;
  }
  if (item.stock_note) return item.stock_note;
  return "In stock";
}

export function MenuProductListRow({
  item,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  onRemove,
  detailHref,
  showCartControls = true,
  productEditHref,
  showItemInfo = true,
  onQuantityCommit,
  className,
}: MenuProductListRowProps) {
  const [imgSrc, setImgSrc] = useState(item.image_url);
  const [editingQty, setEditingQty] = useState(false);
  const [draft, setDraft] = useState("");
  const qtyInputId = useId();

  const commitDraft = useCallback(() => {
    if (!onQuantityCommit) return;
    const t = draft.trim();
    const parsed = t === "" ? 0 : Number.parseInt(t, 10);
    onQuantityCommit(Number.isNaN(parsed) ? 0 : parsed);
    setEditingQty(false);
    setDraft("");
  }, [draft, onQuantityCommit]);

  useEffect(() => {
    if (!editingQty) return;
    window.setTimeout(() => {
      document.getElementById(qtyInputId)?.focus();
    }, 0);
  }, [editingQty, qtyInputId]);

  const price = primaryPrice(item);
  const label = stockLabel(item, quantity);
  const inCart = quantity > 0;
  const shelfEmpty = typeof item.available_qty === "number" && item.available_qty <= 0;
  const outOfStock = item.available && shelfEmpty;
  const canAdd =
    item.available &&
    !shelfEmpty &&
    (item.available_qty === undefined || item.available_qty > quantity);

  const directQtyControl =
    showCartControls && onQuantityCommit ? (
      editingQty ? (
        <div className="flex shrink-0 items-center gap-1">
          <Input
            id={qtyInputId}
            name={`menu-qty-${item.id}`}
            type="number"
            inputMode="numeric"
            min={0}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitDraft();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setEditingQty(false);
                setDraft("");
              }
            }}
            aria-label={`Quantity for ${item.name}`}
            className="!min-h-10 w-[4.25rem] shrink-0 !px-2 !py-2 text-center tabular-nums"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={commitDraft}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary hover:bg-primary/10"
            aria-label={`Apply quantity for ${item.name}`}
          >
            <MaterialIcon name="check" className="!text-xl" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setEditingQty(true);
            setDraft(quantity > 0 ? String(quantity) : "");
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-secondary hover:bg-surface-container-high hover:text-on-surface"
          aria-label={`Set quantity for ${item.name}`}
        >
          <MaterialIcon name="edit_note" className="!text-xl" />
        </button>
      )
    ) : null;

  return (
    <Card
      className={cn(
        "relative z-0 flex gap-4 p-4 shadow-md ring-outline-variant/15",
        (!item.available || outOfStock) && "opacity-80",
        className,
      )}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
          unoptimized={imgSrc.startsWith("data:")}
          onError={() => setImgSrc(PLACEHOLDER)}
        />
        <span
          className={cn(
            "absolute left-1 top-1 h-3 w-3 rounded-sm ring-1 ring-white/80",
            item.type === "veg"
              ? "bg-tertiary-container"
              : item.type === "non-veg"
                ? "bg-primary"
                : "bg-secondary",
          )}
          title={
            item.type === "veg"
              ? "Vegetarian"
              : item.type === "non-veg"
                ? "Non-vegetarian"
                : item.type
          }
          aria-hidden
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          {detailHref ? (
            <Link
              href={detailHref}
              className="min-w-0 font-headline text-base font-bold leading-snug text-on-surface hover:text-primary hover:underline"
            >
              {item.name}
            </Link>
          ) : (
            <h3 className="font-headline text-base font-bold leading-snug text-on-surface">
              {item.name}
            </h3>
          )}
          {showItemInfo ? (
            detailHref ? (
              <Link
                href={detailHref}
                className="text-on-surface-variant hover:text-primary shrink-0 rounded-full p-1 transition-colors"
                aria-label={`Full details for ${item.name}`}
              >
                <MaterialIcon name="info" className="!text-xl text-secondary" />
              </Link>
            ) : (
              <span
                className="text-on-surface-variant shrink-0 rounded-full p-1 opacity-50"
                aria-hidden
              >
                <MaterialIcon name="info" className="!text-xl text-secondary" />
              </span>
            )
          ) : null}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-secondary">
          {item.description}
        </p>

        {item.collection_only || (item.allergens && item.allergens.length > 0) ? (
          <div
            className="mt-2 max-h-16 overflow-hidden"
            aria-label="Product tags"
          >
            <div className="flex flex-wrap gap-1">
              {item.collection_only ? (
                <Badge tone="info" className="normal-case tracking-normal">
                  Collection only
                </Badge>
              ) : null}
              {(item.allergens ?? []).map((a) => (
                <Badge
                  key={a}
                  tone="warning"
                  className="normal-case tracking-normal"
                >
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-headline text-lg font-bold text-primary">
              {formatGbp(price)}
            </span>
            {!item.available ? (
              <Badge tone="neutral" className="w-fit">
                Unavailable
              </Badge>
            ) : outOfStock ? (
              <Badge tone="error" className="w-fit normal-case tracking-normal">
                Out of stock
              </Badge>
            ) : label ? (
              <span className="text-xs text-secondary">{label}</span>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!showCartControls && productEditHref ? (
              <Link
                href={productEditHref}
                aria-label={`Edit ${item.name}`}
                className={cn(
                  "inline-flex items-center justify-center gap-1 rounded-full border-2 border-primary bg-transparent px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/5 active:scale-95",
                )}
              >
                <MaterialIcon name="edit" className="!text-base" />
                Edit
              </Link>
            ) : showCartControls ? (
              <>
                {directQtyControl}
                {inCart ? (
                  <>
                    <div
                      className={cn(
                        "flex items-center rounded-full bg-surface-container-high px-1 py-1 ring-1 ring-outline-variant/30",
                        editingQty && "pointer-events-none opacity-50",
                      )}
                    >
                      <button
                        type="button"
                        onClick={onDecrement}
                        disabled={editingQty}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <MaterialIcon name="remove" className="!text-xl" />
                      </button>
                      <span className="min-w-9 text-center font-headline text-sm font-bold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={onIncrement}
                        disabled={editingQty || !canAdd}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <MaterialIcon name="add" className="!text-xl" />
                      </button>
                    </div>
                    {onRemove ? (
                      <button
                        type="button"
                        onClick={onRemove}
                        disabled={editingQty}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-surface-container-high hover:text-on-surface disabled:opacity-40"
                        aria-label={`Remove ${item.name}`}
                      >
                        <MaterialIcon name="delete" className="!text-xl" />
                      </button>
                    ) : null}
                  </>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    disabled={(!item.available || !canAdd) || editingQty}
                    onClick={onAdd}
                    className="min-w-20 uppercase tracking-wide"
                  >
                    Add
                  </Button>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
