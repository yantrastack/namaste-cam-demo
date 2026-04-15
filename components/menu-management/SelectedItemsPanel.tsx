"use client";

import Image from "next/image";
import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Switch } from "@/components/ui/Switch";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { ProductLineAvailabilityFields } from "./ProductLineAvailabilityFields";
import {
  foodById,
  mergeSelectedLineSlotAvailability,
  type FoodItem,
  type SelectedLine,
  type SelectedLineSlotAvailability,
} from "./model";

export type SelectedItemsPanelProps = {
  foodItems: FoodItem[];
  lines: SelectedLine[];
  onChangeQuantity: (foodId: number, quantity: number) => void;
  onRemove: (foodId: number) => void;
  /** Food IDs added this session (edit flow): those rows show the main-menu vs today-only switch. */
  mainMenuScopeSessionFoodIds?: readonly number[];
  onIncludeInMainMenuChange?: (foodId: number, includeInMainMenu: boolean) => void;
  /** When set, each row shows an availability control that opens a popup editor. */
  onLineSlotAvailabilityChange?: (foodId: number, slot: SelectedLineSlotAvailability) => void;
  title?: string;
  className?: string;
};

export function SelectedItemsPanel({
  foodItems,
  lines,
  onChangeQuantity,
  onRemove,
  mainMenuScopeSessionFoodIds,
  onIncludeInMainMenuChange,
  onLineSlotAvailabilityChange,
  title = "Selected items",
  className,
}: SelectedItemsPanelProps) {
  const [availabilityFoodId, setAvailabilityFoodId] = useState<number | null>(null);
  const availabilityLine =
    availabilityFoodId != null ? lines.find((l) => l.foodId === availabilityFoodId) : undefined;
  const availabilityItem =
    availabilityFoodId != null ? foodById(foodItems, availabilityFoodId) : undefined;

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
            const showMainMenuScope =
              Boolean(onIncludeInMainMenuChange) &&
              Boolean(mainMenuScopeSessionFoodIds?.includes(line.foodId));
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
                <div className="flex w-full min-w-0 flex-1 flex-wrap items-center justify-between gap-2 sm:justify-end">
                  {showMainMenuScope && onIncludeInMainMenuChange ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <Switch
                        checked={line.includeInMainMenu !== false}
                        onCheckedChange={(checked) =>
                          onIncludeInMainMenuChange(line.foodId, checked)
                        }
                        aria-label={`Add ${item.name} to main menu for every week`}
                      />
                      <span className="text-xs font-semibold text-on-surface">Add to main menu</span>
                      <Tooltip
                        content={
                          <>
                            <span className="font-bold text-on-surface">Main menu</span> dishes repeat on
                            the weekdays you selected.{" "}
                            <span className="font-bold text-on-surface">Today only</span> (switch off) keeps
                            the dish on Today&apos;s menu for planning, but it is not saved as part of the
                            recurring weekly roster.
                          </>
                        }
                      >
                        <button
                          type="button"
                          className="inline-flex size-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface"
                          aria-label="Main menu vs today only"
                        >
                          <MaterialIcon name="error" className="text-lg text-primary" filled />
                        </button>
                      </Tooltip>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2">
                    {onLineSlotAvailabilityChange ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="size-9 shrink-0 rounded-full p-0"
                        onClick={() => setAvailabilityFoodId(line.foodId)}
                        aria-label={`Availability for ${item.name}`}
                      >
                        <MaterialIcon name="event_available" className="text-xl text-primary" />
                      </Button>
                    ) : null}
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
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {onLineSlotAvailabilityChange &&
      availabilityFoodId != null &&
      availabilityLine &&
      availabilityItem ? (
        <Modal
          open
          onClose={() => setAvailabilityFoodId(null)}
          title="Availability"
          description={`Adjust how ${availabilityItem.name} is offered in this menu.`}
          className="max-w-lg"
          frameClassName="z-[960]"
        >
          <ProductLineAvailabilityFields
            value={mergeSelectedLineSlotAvailability(availabilityLine)}
            onChange={(next) => onLineSlotAvailabilityChange(availabilityFoodId, next)}
          />
          <div className="mt-6 flex justify-end">
            <Button type="button" size="sm" onClick={() => setAvailabilityFoodId(null)}>
              Done
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
