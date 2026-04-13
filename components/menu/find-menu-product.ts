import type { MenuCategorySection, MenuDocument, MenuProduct } from "./types";

export type FoundMenuProduct = {
  item: MenuProduct;
  category: MenuCategorySection;
};

export function findMenuProduct(
  data: MenuDocument,
  itemId: string,
): FoundMenuProduct | null {
  for (const category of data.menu) {
    const item = category.items.find((i) => i.id === itemId);
    if (item) return { item, category };
  }
  return null;
}
