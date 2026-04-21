import type { MenuCategorySection, MenuDocument, MenuProduct } from "@/components/menu/types";

export const LOCAL_MENU_STORAGE_KEY = "namaste-cam-local-menu-items";

/** Fired on same tab after writes; item list merges again. */
export const MENU_CATALOG_EVENT = "namaste-menu-catalog-updated";

export type LocalStoredMenuItem = {
  category_id: string;
  category: string;
  product: MenuProduct;
};

/** Empty menu section (no products yet) or placeholder for hierarchy. */
export type LocalStoredCategoryShell = {
  category_id: string;
  category: string;
  /** Top-level category created from the “New category” screen. */
  kind?: "main";
};

type LocalMenuFileV2 = {
  version: 2;
  items: LocalStoredMenuItem[];
  categoryShells: LocalStoredCategoryShell[];
};

function emptyFileV2(): LocalMenuFileV2 {
  return { version: 2, items: [], categoryShells: [] };
}

function normalizeCategoryShells(raw: unknown): LocalStoredCategoryShell[] {
  if (!Array.isArray(raw)) return [];
  const out: LocalStoredCategoryShell[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    if (typeof o.category_id !== "string" || typeof o.category !== "string") continue;
    const shell: LocalStoredCategoryShell = {
      category_id: o.category_id,
      category: o.category,
    };
    if (o.kind === "main") shell.kind = "main";
    out.push(shell);
  }
  return out;
}

function readLocalMenuFile(): LocalMenuFileV2 {
  if (typeof window === "undefined") return emptyFileV2();
  try {
    const raw = window.localStorage.getItem(LOCAL_MENU_STORAGE_KEY);
    if (!raw) return emptyFileV2();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return emptyFileV2();
    const obj = parsed as Record<string, unknown>;
    if (obj.version === 2 && Array.isArray(obj.items)) {
      return {
        version: 2,
        items: obj.items as LocalStoredMenuItem[],
        categoryShells: normalizeCategoryShells(obj.categoryShells),
      };
    }
    if (obj.version === 1 && Array.isArray(obj.items)) {
      return { version: 2, items: obj.items as LocalStoredMenuItem[], categoryShells: [] };
    }
    return emptyFileV2();
  } catch {
    return emptyFileV2();
  }
}

function writeLocalMenuFile(file: LocalMenuFileV2): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_MENU_STORAGE_KEY, JSON.stringify(file));
}

export function loadLocalMenuItems(): LocalStoredMenuItem[] {
  return readLocalMenuFile().items;
}

export function loadLocalCategoryShells(): LocalStoredCategoryShell[] {
  return readLocalMenuFile().categoryShells;
}

export function notifyMenuCatalogUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MENU_CATALOG_EVENT));
}

export function upsertLocalMenuItem(entry: LocalStoredMenuItem): void {
  if (typeof window === "undefined") return;
  const file = readLocalMenuFile();
  const prev = file.items.filter((i) => i.product.id !== entry.product.id);
  prev.push(entry);
  writeLocalMenuFile({ ...file, items: prev });
  notifyMenuCatalogUpdated();
}

export function upsertLocalCategoryShell(shell: LocalStoredCategoryShell): void {
  if (typeof window === "undefined") return;
  const file = readLocalMenuFile();
  const rest = file.categoryShells.filter((s) => s.category_id !== shell.category_id);
  rest.push(shell);
  writeLocalMenuFile({ ...file, categoryShells: rest });
  notifyMenuCatalogUpdated();
}

export function removeLocalCategoryShell(categoryId: string): void {
  if (typeof window === "undefined") return;
  const file = readLocalMenuFile();
  const shells = file.categoryShells.filter((s) => s.category_id !== categoryId);
  writeLocalMenuFile({ ...file, categoryShells: shells });
  notifyMenuCatalogUpdated();
}

/** Removes a custom main shell and any stored shells whose ids are nested under it (`{id}_…`). */
export function removeLocalCategoryShellTree(mainCategoryId: string): void {
  if (typeof window === "undefined") return;
  const file = readLocalMenuFile();
  const shells = file.categoryShells.filter(
    (s) =>
      s.category_id !== mainCategoryId && !s.category_id.startsWith(`${mainCategoryId}_`),
  );
  writeLocalMenuFile({ ...file, categoryShells: shells });
  notifyMenuCatalogUpdated();
}

/** Merge demo JSON with locally stored products (dedupe by `product.id`). */
export function mergeMenuWithLocal(base: MenuDocument): MenuDocument {
  const file = readLocalMenuFile();
  const localItems = file.items;
  const shells = file.categoryShells;

  if (localItems.length === 0 && shells.length === 0) return base;

  const menu: MenuCategorySection[] = structuredClone(base.menu);

  for (const shell of shells) {
    const existing = menu.find((s) => s.category_id === shell.category_id);
    if (!existing) {
      menu.push({ category: shell.category, category_id: shell.category_id, items: [] });
    } else {
      existing.category = shell.category;
    }
  }

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
