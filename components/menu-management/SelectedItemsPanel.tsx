"use client";

import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/cn";
import { foodById, type FoodItem, type SelectedLine } from "./model";

export type SelectedItemsPanelProps = {
  foodItems: FoodItem[];
  lines: SelectedLine[];
  onChangeQuantity: (foodId: number, quantity: number) => void;
  onRemove: (foodId: number) => void;
  title?: string;
  className?: string;
};

export function SelectedItemsPanel({
  foodItems,
  lines,
  onChangeQuantity,
  onRemove,
  title = "Selected items",
  className,
}: SelectedItemsPanelProps) {
  return (
    <div className={cn("flex min-h-0 flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-extrabold uppercase tracking-widest text-secondary">
          {title}
        </p>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/15">
          {lines.length}
        </span>
      </div>

      {lines.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low/80 p-6 text-center text-sm font-medium text-secondary ring-1 ring-outline-variant/10">
          Add dishes from the library. Quantities default to 15 for quick planning.
        </div>
      ) : (
        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {lines.map((line) => {
            const item = foodById(foodItems, line.foodId);
            if (!item) return null;
            return (
              <li
                key={line.foodId}
                className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-3 ring-1 ring-outline-variant/15 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-full object-cover ring-1 ring-outline-variant/20"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-on-surface">{item.name}</p>
                    <p className="text-sm font-bold text-primary">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <QuantityStepper
                    value={line.quantity}
                    min={1}
                    max={999}
                    onChange={(n) => onChangeQuantity(line.foodId, n)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-secondary hover:text-error"
                    onClick={() => onRemove(line.foodId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <MaterialIcon name="delete" className="text-xl" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
