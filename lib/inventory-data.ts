/**
 * Inventory v1 uses two explicit tracks (see plan):
 * - Sellable / menu-linked stock: driven from {@link MenuDocument} (`available_qty`, `available`, `stock_note`).
 * - Kitchen ingredients: demo rows for back-of-house (not tied to menu JSON until a BOM exists).
 */

import type { MenuCategorySection, MenuDocument, MenuProduct } from "@/components/menu/types";

export const SELLABLE_LOW_QTY_THRESHOLD = 20;

export type SellableStockRow = {
  id: string;
  name: string;
  category: string;
  available: boolean;
  availableQty: number | null;
  stockNote: string | null;
  /** When quantity is known and below threshold */
  isLow: boolean;
};

export type KitchenIngredientRow = {
  id: string;
  name: string;
  category: string;
  status: "in_stock" | "low" | "out";
  /** 0–100 for progress bar */
  levelPct: number;
  batchLabel?: string;
};

function productToRow(section: MenuCategorySection, product: MenuProduct): SellableStockRow {
  const qty = product.available_qty;
  const availableQty = typeof qty === "number" && Number.isFinite(qty) ? qty : null;
  const isLow =
    product.available &&
    availableQty !== null &&
    availableQty < SELLABLE_LOW_QTY_THRESHOLD;
  return {
    id: product.id,
    name: product.name,
    category: section.category,
    available: product.available,
    availableQty,
    stockNote: product.stock_note?.trim() ? product.stock_note.trim() : null,
    isLow,
  };
}

export function listSellableStockRows(doc: MenuDocument): SellableStockRow[] {
  const rows: SellableStockRow[] = [];
  for (const section of doc.menu) {
    for (const item of section.items) {
      rows.push(productToRow(section, item));
    }
  }
  return rows;
}

export function listLowSellableRows(doc: MenuDocument): SellableStockRow[] {
  return listSellableStockRows(doc).filter((r) => r.isLow || !r.available);
}

/** Demo kitchen stock — replace with API / ledger when available. */
export function listKitchenIngredientRows(): KitchenIngredientRow[] {
  return [
    {
      id: "ing-saffron",
      name: "Iranian Saffron",
      category: "Premium spices",
      status: "in_stock",
      levelPct: 78,
      batchLabel: "Batch #4421",
    },
    {
      id: "ing-truffle",
      name: "White truffle oil",
      category: "Oils",
      status: "low",
      levelPct: 22,
      batchLabel: "Batch #9012",
    },
    {
      id: "ing-naan-flour",
      name: "Bread flour (00)",
      category: "Dry goods",
      status: "in_stock",
      levelPct: 64,
    },
    {
      id: "ing-paneer",
      name: "Paneer (fresh)",
      category: "Dairy",
      status: "low",
      levelPct: 18,
    },
    {
      id: "ing-mango",
      name: "Alphonso mango pulp",
      category: "Frozen",
      status: "out",
      levelPct: 0,
    },
  ];
}

export function countIngredientAlerts(rows: KitchenIngredientRow[]): {
  low: number;
  out: number;
} {
  return {
    low: rows.filter((r) => r.status === "low").length,
    out: rows.filter((r) => r.status === "out").length,
  };
}
