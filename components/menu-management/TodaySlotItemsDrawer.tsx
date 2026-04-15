"use client";

import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FoodCatalogPanel } from "./FoodCatalogPanel";
import { SelectedItemsPanel } from "./SelectedItemsPanel";
import { DEMO_FOOD_ITEMS, patchSelectedLineSlotAvailability, type SelectedLine } from "./model";

export type TodaySlot = "lunch" | "dinner";

const LUNCH_INITIAL: SelectedLine[] = [
  { foodId: 3, quantity: 12 },
  { foodId: 4, quantity: 12 },
  { foodId: 2, quantity: 10 },
];

const DINNER_INITIAL: SelectedLine[] = [
  { foodId: 1, quantity: 10 },
  { foodId: 4, quantity: 10 },
  { foodId: 2, quantity: 10 },
];

function mergeLines(lines: SelectedLine[], foodId: number): SelectedLine[] {
  if (lines.some((l) => l.foodId === foodId)) return lines;
  return [...lines, { foodId, quantity: 12 }];
}

function updateLineQty(lines: SelectedLine[], foodId: number, quantity: number): SelectedLine[] {
  return lines.map((l) => (l.foodId === foodId ? { ...l, quantity } : l));
}

function removeLine(lines: SelectedLine[], foodId: number): SelectedLine[] {
  return lines.filter((l) => l.foodId !== foodId);
}

export type TodaySlotItemsDrawerProps = {
  onClose: () => void;
  slot: TodaySlot;
  /** e.g. "Monday, Apr 13" */
  dayLabel: string;
};

export function TodaySlotItemsDrawer({ onClose, slot, dayLabel }: TodaySlotItemsDrawerProps) {
  const [lines, setLines] = useState<SelectedLine[]>(() =>
    slot === "lunch" ? [...LUNCH_INITIAL] : [...DINNER_INITIAL],
  );

  const slotTitle = useMemo(() => (slot === "lunch" ? "Lunch" : "Dinner"), [slot]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-surface-container-lowest">
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-outline-variant/10 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-10 shrink-0 rounded-full p-0 text-secondary"
            onClick={onClose}
            aria-label="Close"
          >
            <MaterialIcon name="close" className="text-2xl" />
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info">Today only</Badge>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                Does not update Master Menu
              </span>
            </div>
            <h2 className="mt-2 font-headline text-xl font-extrabold tracking-tight text-on-surface sm:text-2xl">
              {dayLabel} · {slotTitle}
            </h2>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">
              Adjust today&apos;s {slotTitle.toLowerCase()} picks for kitchen prep. This is a scratch pad for{" "}
              <span className="font-bold text-on-surface">this day only</span> — nothing here writes back to menus
              on the Master Menu list.
            </p>
          </div>
        </div>
      </div>

      <Card className="mx-5 my-4 shrink-0 border border-outline-variant/15 bg-secondary-container/25 p-4 sm:mx-6">
        <div className="flex gap-3">
          <MaterialIcon name="info" className="shrink-0 text-xl text-on-secondary-container" />
          <p className="text-sm font-semibold leading-relaxed text-on-secondary-container">
            Use this drawer to experiment with dishes for today&apos;s service. Your Master Menu records stay
            unchanged until you edit them from the main table or menu builder.
          </p>
        </div>
      </Card>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 sm:px-6">
        <div className="grid min-h-[320px] gap-6 lg:grid-cols-2">
          <FoodCatalogPanel
            foodItems={DEMO_FOOD_ITEMS}
            lines={lines}
            onAdd={(foodId) => setLines((prev) => mergeLines(prev, foodId))}
          />
          <SelectedItemsPanel
            foodItems={DEMO_FOOD_ITEMS}
            lines={lines}
            title={"Today's picks"}
            onLineSlotAvailabilityChange={(foodId, slot) =>
              setLines((prev) => patchSelectedLineSlotAvailability(prev, foodId, slot))
            }
            onChangeQuantity={(foodId, quantity) =>
              setLines((prev) => updateLineQty(prev, foodId, quantity))
            }
            onRemove={(foodId) => setLines((prev) => removeLine(prev, foodId))}
          />
        </div>
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-outline-variant/10 bg-surface-container-lowest/95 px-5 py-4 backdrop-blur sm:px-6">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
