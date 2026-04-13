"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { MenuProductListRow } from "./MenuProductListRow";
import type { MenuCategorySection, MenuDocument, MenuProduct } from "./types";

export type MenuProductListProps = {
  data: MenuDocument;
  className?: string;
  /** Called after internal cart state updates */
  onCartChange?: (quantities: Record<string, number>) => void;
};

export function MenuProductList({ data, className, onCartChange }: MenuProductListProps) {
  const categories = data.menu;
  const [activeId, setActiveId] = useState(categories[0]?.category_id ?? "");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const activeCategory = useMemo(
    () => categories.find((c) => c.category_id === activeId) ?? categories[0],
    [activeId, categories],
  );

  const setQty = useCallback(
    (id: string, next: number) => {
      setQuantities((prev) => {
        const copy = { ...prev };
        if (next <= 0) delete copy[id];
        else copy[id] = next;
        onCartChange?.(copy);
        return copy;
      });
    },
    [onCartChange],
  );

  const bump = useCallback(
    (item: MenuProduct, delta: number) => {
      const current = quantities[item.id] ?? 0;
      const cap =
        item.available_qty !== undefined ? item.available_qty : Number.POSITIVE_INFINITY;
      const next = Math.max(0, Math.min(cap, current + delta));
      setQty(item.id, next);
    },
    [quantities, setQty],
  );

  const addOne = useCallback(
    (item: MenuProduct) => {
      bump(item, 1);
    },
    [bump],
  );

  if (!activeCategory) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-min gap-2 px-1">
          {categories.map((cat: MenuCategorySection) => {
            const active = cat.category_id === activeCategory.category_id;
            return (
              <Button
                key={cat.category_id}
                type="button"
                size="sm"
                variant={active ? "primary" : "outline"}
                className={cn(
                  "shrink-0 whitespace-nowrap",
                  !active && "border-outline-variant/40 text-on-surface bg-surface-container-lowest",
                )}
                onClick={() => setActiveId(cat.category_id)}
              >
                {cat.category}
              </Button>
            );
          })}
        </div>
      </div>

      <section aria-labelledby={`cat-${activeCategory.category_id}`}>
        <div className="mb-4 flex items-center gap-3">
          <h2
            id={`cat-${activeCategory.category_id}`}
            className="font-headline text-lg font-bold text-on-surface"
          >
            {activeCategory.category}
          </h2>
          <div className="h-px flex-1 bg-outline-variant/40" aria-hidden />
        </div>

        <ul className="space-y-3">
          {activeCategory.items.map((item: MenuProduct) => (
            <li key={item.id}>
              <MenuProductListRow
                item={item}
                quantity={quantities[item.id] ?? 0}
                onAdd={() => addOne(item)}
                onIncrement={() => bump(item, 1)}
                onDecrement={() => bump(item, -1)}
                onRemove={() => setQty(item.id, 0)}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
