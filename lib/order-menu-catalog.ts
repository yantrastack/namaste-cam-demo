import type { MenuCategorySection, MenuDocument, MenuProduct } from "@/components/menu/types";
import type { CatalogProduct } from "@/lib/orders-restaurant-data";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Treat menu GBP shelf prices as VAT-inclusive; bill lines store ex-VAT unit. */
export function menuGbpInclusiveToUnitPriceExTax(gbpInclusive: number): number {
  return round2(gbpInclusive / 1.15);
}

function primaryMenuPriceGbp(item: MenuProduct): number {
  return item.variants[0]?.price_gbp ?? item.base_price_gbp;
}

function billCategoryForMenuSection(section: MenuCategorySection): string {
  if (section.category_id === "DRINKS") return "Bar";
  if (section.category_id === "DESSERT" || section.category === "Desserts") return "Dessert";
  if (
    section.category_id === "STARTERS" ||
    section.category_id === "STARTERS_WINGS" ||
    section.category === "Wing Station"
  ) {
    return "Starter";
  }
  return "Main Course";
}

export function buildMenuCatalogByProductId(doc: MenuDocument): Map<string, CatalogProduct> {
  const map = new Map<string, CatalogProduct>();
  for (const cat of doc.menu) {
    for (const item of cat.items) {
      const gbp = primaryMenuPriceGbp(item);
      map.set(item.id, {
        id: item.id,
        name: item.name,
        detail: item.description,
        category: billCategoryForMenuSection(cat),
        unitPriceExTax: menuGbpInclusiveToUnitPriceExTax(gbp),
      });
    }
  }
  return map;
}

/** Hero image URL per menu product id (for POS line previews). */
export function buildMenuImageUrlByProductId(doc: MenuDocument): Map<string, string> {
  const map = new Map<string, string>();
  for (const cat of doc.menu) {
    for (const item of cat.items) {
      const url = item.image_url?.trim();
      if (url) map.set(item.id, url);
    }
  }
  return map;
}
