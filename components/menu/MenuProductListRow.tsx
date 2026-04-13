"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
  className?: string;
};

function primaryPrice(item: MenuProduct): number {
  const v = item.variants[0];
  return v?.price_gbp ?? item.base_price_gbp;
}

function stockLabel(item: MenuProduct): string | null {
  if (!item.available) return null;
  if (typeof item.available_qty === "number") {
    return `${item.available_qty} available`;
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
  className,
}: MenuProductListRowProps) {
  const [imgSrc, setImgSrc] = useState(item.image_url);
  const price = primaryPrice(item);
  const label = stockLabel(item);
  const inCart = quantity > 0;
  const canAdd =
    item.available &&
    (item.available_qty === undefined || item.available_qty > quantity);

  return (
    <Card
      className={cn(
        "flex gap-4 p-4 shadow-md ring-outline-variant/15",
        !item.available && "opacity-75",
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
          <h3 className="font-headline text-base font-bold leading-snug text-on-surface">
            {item.name}
          </h3>
          <button
            type="button"
            className="text-on-surface-variant hover:text-on-surface shrink-0 rounded-full p-1 transition-colors"
            aria-label={`More about ${item.name}`}
          >
            <MaterialIcon name="info" className="!text-xl text-secondary" />
          </button>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-secondary">
          {item.description}
        </p>

        {item.collection_only ? (
          <Badge tone="info" className="mt-1 w-fit normal-case tracking-normal">
            Collection only
          </Badge>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-headline text-lg font-bold text-primary">
              {formatGbp(price)}
            </span>
            {label ? (
              <span className="text-xs text-secondary">{label}</span>
            ) : (
              <Badge tone="neutral" className="w-fit">
                Unavailable
              </Badge>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {inCart ? (
              <>
                <div className="flex items-center rounded-full bg-surface-container-high px-1 py-1 ring-1 ring-outline-variant/30">
                  <button
                    type="button"
                    onClick={onDecrement}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container"
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
                    disabled={!canAdd}
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
                    className="flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-surface-container-high hover:text-on-surface"
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
                disabled={!item.available || !canAdd}
                onClick={onAdd}
                className="min-w-20 uppercase tracking-wide"
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
