import type { MenuCategorySection, MenuDocument, MenuProduct } from "@/components/menu/types";

export const LOCAL_MENU_STORAGE_KEY = "namaste-cam-local-menu-items";

/** Fired on same tab after writes; item list merges again. */
export const MENU_CATALOG_EVENT = "namaste-menu-catalog-updated";

export type LocalStoredMenuItem = {
  category_id: string;
  category: string;
  product: MenuProduct;
};

type LocalMenuFile = {
  version: 1;
  items: LocalStoredMenuItem[];
};

function emptyFile(): LocalMenuFile {
  return { version: 1, items: [] };
}

export function loadLocalMenuItems(): LocalStoredMenuItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_MENU_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalMenuFile;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.items)) return [];
    return parsed.items;
  } catch {
    return [];
  }
}

export function notifyMenuCatalogUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MENU_CATALOG_EVENT));
}

export function upsertLocalMenuItem(entry: LocalStoredMenuItem): void {
  if (typeof window === "undefined") return;
  const prev = loadLocalMenuItems().filter((i) => i.product.id !== entry.product.id);
  prev.push(entry);
  const next: LocalMenuFile = { version: 1, items: prev };
  window.localStorage.setItem(LOCAL_MENU_STORAGE_KEY, JSON.stringify(next));
  notifyMenuCatalogUpdated();
}

/** Merge demo JSON with locally stored products (dedupe by `product.id`). */
export function mergeMenuWithLocal(base: MenuDocument): MenuDocument {
  const localItems = loadLocalMenuItems();
  if (localItems.length === 0) return base;

  const menu: MenuCategorySection[] = structuredClone(base.menu);

  for (const { category_id, category, product } of localItems) {
    for (const sec of menu) {
      sec.items = sec.items.filter((i) => i.id !== product.id);
    }
    let section = menu.find((s) => s.category_id === category_id);
    if (!section) {
      section = { category, category_id, items: [] };
      menu.push(section);
    }
    section.items = [...section.items, product];
  }

  return { ...base, menu };
}
