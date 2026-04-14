"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { MenuProductListRow } from "./MenuProductListRow";
import type { MenuCategorySection, MenuDocument, MenuProduct } from "./types";

export type MenuProductListProps = {
  data: MenuDocument;
  className?: string;
  /** Called after internal cart state updates */
  onCartChange?: (quantities: Record<string, number>) => void;
  /** When set, rows link to this path + item id (e.g. base `/menu/item-list` → `/menu/item-list/WINGS_001`). */
  itemDetailBasePath?: string;
  /**
   * When false, hides add-to-cart controls and shows an Edit action instead (requires `productEditBasePath`).
   * Use on admin catalog screens such as `/menu/item-list`.
   */
  showCartControls?: boolean;
  /** Base path for “edit in create form”, e.g. `/menu/new` → `/menu/new?itemId=WINGS_001`. */
  productEditBasePath?: string;
  /** When false, hides the row info icon (e.g. order “Add menu items” picker). */
  showItemInfo?: boolean;
  /** When true, enables stock editing mode where edit button updates available_qty instead of cart quantity. */
  enableStockEdit?: boolean;
  /** Called when stock quantity is updated in stock editing mode. */
  onStockUpdate?: (itemId: string, newStock: number) => void;
};

function filterCategories(
  categories: MenuCategorySection[],
  query: string,
): MenuCategorySection[] {
  const q = query.trim().toLowerCase();
  if (!q) return categories;
  return categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          cat.category.toLowerCase().includes(q),
      ),
    }))
    .filter((c) => c.items.length > 0);
}

export function MenuProductList({
  data,
  className,
  onCartChange,
  itemDetailBasePath,
  showCartControls = true,
  productEditBasePath,
  showItemInfo = true,
  enableStockEdit = false,
  onStockUpdate,
}: MenuProductListProps) {
  const categories = data.menu;
  const [query, setQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(categories[0]?.category_id ?? "");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});
  const scrollSpySkip = useRef(false);

  const filteredCategories = useMemo(
    () => {
      const filtered = filterCategories(categories, query);
      // Apply stock overrides to items for immediate UI updates
      return filtered.map(cat => ({
        ...cat,
        items: cat.items.map(item => ({
          ...item,
          available_qty: stockOverrides[item.id] ?? item.available_qty,
        }))
      }));
    },
    [categories, query, stockOverrides],
  );

  const setQty = useCallback(
    (id: string, next: number) => {
      setQuantities((prev) => {
        const copy = { ...prev };
        if (next <= 0) delete copy[id];
        else copy[id] = next;
        return copy;
      });
    },
    [],
  );

  useEffect(() => {
    onCartChange?.(quantities);
  }, [quantities, onCartChange]);

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

  const commitQuantity = useCallback(
    (item: MenuProduct, raw: number) => {
      if (!item.available) {
        setQty(item.id, 0);
        return;
      }
      const cap =
        item.available_qty !== undefined ? item.available_qty : Number.POSITIVE_INFINITY;
      const n = Number.isFinite(raw) ? Math.trunc(raw) : 0;
      const clamped = Math.max(0, Math.min(cap, n));
      setQty(item.id, clamped);
    },
    [setQty],
  );

  const handleStockUpdate = useCallback(
    (itemId: string, newStock: number) => {
      setStockOverrides(prev => ({
        ...prev,
        [itemId]: newStock,
      }));
      onStockUpdate?.(itemId, newStock);
    },
    [onStockUpdate],
  );

  const scrollToSection = useCallback((categoryId: string) => {
    scrollSpySkip.current = true;
    setActiveSectionId(categoryId);
    const el = document.getElementById(`menu-section-${categoryId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      scrollSpySkip.current = false;
    }, 900);
  }, []);

  useEffect(() => {
    if (!filteredCategories.length) return;

    const sections = filteredCategories
      .map((c) => document.getElementById(`menu-section-${c.category_id}`))
      .filter((n): n is HTMLElement => n !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollSpySkip.current) return;
        const intersecting = entries
          .filter((e) => e.isIntersecting && e.target instanceof HTMLElement)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = intersecting[0]?.target as HTMLElement | undefined;
        const sectionId = top?.dataset.menuSection;
        if (sectionId) setActiveSectionId(sectionId);
      },
      {
        root: null,
        rootMargin: "-12% 0px -55% 0px",
        threshold: [0, 0.08, 0.15, 0.25, 0.4],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [filteredCategories]);

  useEffect(() => {
    if (
      filteredCategories.length &&
      !filteredCategories.some((c) => c.category_id === activeSectionId)
    ) {
      setActiveSectionId(filteredCategories[0].category_id);
    }
  }, [filteredCategories, activeSectionId]);

  const detailHrefFor = useCallback(
    (itemId: string) =>
      itemDetailBasePath ? `${itemDetailBasePath.replace(/\/$/, "")}/${itemId}` : undefined,
    [itemDetailBasePath],
  );

  const editHrefFor = useCallback(
    (itemId: string) => {
      if (!productEditBasePath || showCartControls) return undefined;
      const base = productEditBasePath.replace(/\/$/, "");
      return `${base}?itemId=${encodeURIComponent(itemId)}`;
    },
    [productEditBasePath, showCartControls],
  );

  return (
    <div className={cn("relative z-0", className)}>
      <div className="sticky top-0 z-50 bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative z-20 space-y-4">
          <Input
            id="menu-item-search"
            name="menu-item-search"
            placeholder="Search dishes, descriptions, or IDs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search menu items"
            autoComplete="off"
            left={<MaterialIcon name="search" className="!text-xl text-secondary" />}
            className="relative z-10 bg-white border border-gray-200 rounded-lg shadow-sm"
          />

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Menu categories">
            {filteredCategories.map((cat) => {
              const active = cat.category_id === activeSectionId;
              return (
                <Badge
                  key={cat.category_id}
                  role="tab"
                  aria-selected={active}
                  className={cn(
                    "cursor-pointer transition-all duration-200 px-3 py-1.5 rounded-full text-sm font-medium",
                    active
                      ? "!bg-red-500 !text-white !border-red-500 shadow-sm hover:!bg-red-600"
                      : "!bg-white !text-gray-700 !border !border-gray-300 hover:!bg-gray-50 hover:!border-gray-400",
                  )}
                  onClick={() => scrollToSection(cat.category_id)}
                >
                  {cat.category}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredCategories.length === 0 ? (
          <p className="rounded-xl bg-surface-container-low px-4 py-6 text-center text-sm text-secondary ring-1 ring-outline-variant/15">
            No items match your search. Try a different term.
          </p>
        ) : (
          <div className="relative z-0 space-y-10">
            {filteredCategories.map((cat) => (
              <section
                key={cat.category_id}
                id={`menu-section-${cat.category_id}`}
                data-menu-section={cat.category_id}
                aria-labelledby={`menu-heading-${cat.category_id}`}
                className="relative z-0 scroll-mt-32"
              >
                <div className="mb-4 flex items-center gap-3">
                  <h2
                    id={`menu-heading-${cat.category_id}`}
                    className="font-headline text-lg font-bold text-on-surface"
                  >
                    {cat.category}
                  </h2>
                  <div className="h-px flex-1 bg-outline-variant/40" aria-hidden />
                </div>

                <ul className="flex flex-col gap-4">
                  {cat.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <MenuProductListRow
                          item={item}
                          quantity={quantities[item.id] ?? 0}
                          onAdd={() => addOne(item)}
                          onIncrement={() => bump(item, 1)}
                          onDecrement={() => bump(item, -1)}
                          onRemove={() => setQty(item.id, 0)}
                          detailHref={detailHrefFor(item.id)}
                          showCartControls={showCartControls}
                          productEditHref={editHrefFor(item.id)}
                          showItemInfo={showItemInfo}
                          onQuantityCommit={
                            showCartControls ? (n) => commitQuantity(item, n) : undefined
                          }
                          enableStockEdit={enableStockEdit}
                          onStockUpdate={handleStockUpdate}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
