"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
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
}: MenuProductListProps) {
  const categories = data.menu;
  const [query, setQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(categories[0]?.category_id ?? "");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const scrollSpySkip = useRef(false);

  const filteredCategories = useMemo(
    () => filterCategories(categories, query),
    [categories, query],
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
    <div className={cn("relative z-0 space-y-6", className)}>
      <div className="sticky -top-2 z-30 isolate border-b border-outline-variant/15 bg-background pt-6 pb-4 shadow-sm shadow-outline-variant/10">
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
            className="relative z-10"
          />

          <div
            className={cn(
              "relative z-0 -mx-1 overflow-x-auto scroll-smooth pb-1 pt-0.5",
              "[scrollbar-width:thin] [scrollbar-color:var(--color-outline-variant)_transparent]",
              "[&::-webkit-scrollbar]:h-1.5",
              "[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-surface-container-high/50",
              "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-outline-variant/45",
              "hover:[&::-webkit-scrollbar-thumb]:bg-outline-variant/70",
            )}
          >
            <div className="flex min-w-min gap-2 px-1" role="tablist" aria-label="Menu categories">
            {filteredCategories.map((cat) => {
              const active = cat.category_id === activeSectionId;
              return (
                <Button
                  key={cat.category_id}
                  type="button"
                  size="sm"
                  variant={active ? "primary" : "outline"}
                  role="tab"
                  aria-selected={active}
                  className={cn(
                    "shrink-0 whitespace-nowrap",
                    !active &&
                      "border-outline-variant/40 text-on-surface bg-surface-container-lowest",
                  )}
                  onClick={() => scrollToSection(cat.category_id)}
                >
                  {cat.category}
                </Button>
              );
            })}
            </div>
          </div>
        </div>
      </div>

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
              className="relative z-0 scroll-mt-44"
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

              <ul className="space-y-3">
                {cat.items.map((item) => (
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
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
