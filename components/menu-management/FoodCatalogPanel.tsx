"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import {
  type FoodItem,
  type ItemCategory,
  ITEM_FILTER_LABELS,
  type SelectedLine,
} from "./model";

export type FoodCatalogPanelProps = {
  foodItems: FoodItem[];
  lines: SelectedLine[];
  onAdd: (foodId: number) => void;
  className?: string;
};

function DietTag({ diet }: { diet: FoodItem["diet"] }) {
  const isVeg = diet === "veg";
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest",
        isVeg
          ? "bg-green-50 text-green-700 ring-1 ring-green-100"
          : "bg-red-50 text-red-700 ring-1 ring-red-100",
      )}
    >
      {isVeg ? "Veg" : "Non-veg"}
    </span>
  );
}

export function FoodCatalogPanel({
  foodItems,
  lines,
  onAdd,
  className,
}: FoodCatalogPanelProps) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<ItemCategory>("all");

  const selectedIds = useMemo(() => new Set(lines.map((l) => l.foodId)), [lines]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foodItems.filter((item) => {
      if (cat !== "all" && item.category !== cat) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q);
    });
  }, [cat, foodItems, query]);

  return (
    <div className={cn("flex min-h-0 flex-col gap-4", className)}>
      <Input
        label="Search"
        placeholder="Search available items…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        left={<MaterialIcon name="search" className="text-xl" />}
      />

      <div className="flex flex-wrap gap-2">
        {ITEM_FILTER_LABELS.map((chip) => {
          const active = cat === chip.id;
          return (
            <Button
              key={chip.id}
              type="button"
              size="sm"
              variant={active ? "primary" : "outline"}
              className={cn(!active && "border-outline-variant/30 text-secondary")}
              onClick={() => setCat(chip.id)}
            >
              {chip.label}
            </Button>
          );
        })}
      </div>

      <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
        Available items ({filtered.length})
      </p>

      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {filtered.map((item) => {
          const already = selectedIds.has(item.id);
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-3 ring-1 ring-outline-variant/15"
            >
              <Image
                src={item.imageUrl}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-full object-cover ring-1 ring-outline-variant/20"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-on-surface">{item.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <DietTag diet={item.diet} />
                  <span className="text-sm font-bold text-primary">₹{item.price}</span>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant={already ? "outline" : "primary"}
                className="size-10 shrink-0 rounded-full p-0"
                onClick={() => onAdd(item.id)}
                disabled={already}
                aria-label={already ? `${item.name} already added` : `Add ${item.name}`}
              >
                <MaterialIcon name="add" className="text-xl" />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
