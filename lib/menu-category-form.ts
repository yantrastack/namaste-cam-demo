/** Shared helpers for dashboard category / subcategory creation (local catalog). */

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeCategoryId(raw: string) {
  return raw
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .toUpperCase()
    .slice(0, 48);
}

export function buildMainCategoryId(name: string, customKey: string) {
  const slug = (customKey.trim() || slugify(name) || "category").replace(/-/g, "_");
  return sanitizeCategoryId(`USER_CAT_${slug}`);
}

function sanitizeCategoryIdSegment(raw: string) {
  return raw.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
}

/** Same rules as `CreateProductForm` / new product flow for preset main + sub ids. */
export function buildPresetSubsectionCategoryId(mainCategoryId: string, subCategoryId: string) {
  return `USER_${mainCategoryId}_${subCategoryId}`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .toUpperCase()
    .slice(0, 48);
}

/** Aligns with `CreateProductForm` ids for preset mains; supports local `USER_*` parent ids. */
export function buildSubcategorySectionId(parentCategoryId: string, subName: string) {
  const sub = sanitizeCategoryIdSegment((slugify(subName) || "sub").replace(/-/g, "_")).toUpperCase();
  const core = parentCategoryId.startsWith("USER_")
    ? `${parentCategoryId}_${sub}`
    : `USER_${parentCategoryId}_${sub}`;
  return core.toUpperCase().slice(0, 48);
}
