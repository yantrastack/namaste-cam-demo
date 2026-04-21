"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MenuItemDetail } from "@/components/menu/MenuItemDetail";
import type { FoundMenuProduct } from "@/components/menu/find-menu-product";
import type { MenuDocument, MenuProduct } from "@/components/menu/types";
import menuDemo from "@/sandbox/menu-demo/menu-data.json";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  MENU_CATALOG_EVENT,
  mergeMenuWithLocal,
  upsertLocalMenuItem,
} from "@/lib/menu-local-catalog";
import {
  productCurrencySymbol,
  productDeclaredAllergenOptions,
  productDietaryFlags,
  productDiscountTypes,
  productInitialAddons,
  productInitialVariants,
  productMainCategories,
  type NamedPriceRow,
  type ProductMainCategory,
} from "@/lib/data/product-catalog";
import { buildPresetSubsectionCategoryId } from "@/lib/menu-category-form";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-xl border-none bg-surface px-4 py-3.5 font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary";

const controlSm =
  "w-full rounded-xl border-none bg-surface px-3 py-2.5 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary";

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";

/** Single image for now; increase when multi-file + gallery UX is ready. */
const MAX_PRODUCT_IMAGES = 1;

function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Invalid read result"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

type ProductImageRow = { id: string; dataUrl: string };

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseMoney(raw: string) {
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(amount: number) {
  return `${productCurrencySymbol}${amount.toFixed(2)}`;
}

function calcFinalPrice(
  base: number,
  discountType: string,
  discountValue: number,
): number {
  if (discountType === "percent") {
    return Math.max(0, base * (1 - discountValue / 100));
  }
  if (discountType === "fixed") {
    return Math.max(0, base - discountValue);
  }
  return Math.max(0, base);
}

function SectionTitle({
  icon,
  title,
  className,
}: {
  icon: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-center gap-3", className)}>
      <MaterialIcon name={icon} className="text-2xl text-primary" />
      <h2 className="font-headline text-lg font-bold tracking-tight text-on-surface">{title}</h2>
    </div>
  );
}

function FieldLabel({
  children,
  requiredMark,
}: {
  children: React.ReactNode;
  requiredMark?: boolean;
}) {
  return (
    <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-secondary">
      {children}
      {requiredMark ? <span className="text-primary"> *</span> : null}
    </span>
  );
}

function findMenuProduct(doc: MenuDocument, itemId: string): MenuProduct | null {
  for (const cat of doc.menu) {
    const hit = cat.items.find((i) => i.id === itemId);
    if (hit) return hit;
  }
  return null;
}

type CatalogPick = { id: string; name: string; category: string };

function flattenCatalog(doc: MenuDocument): CatalogPick[] {
  const out: CatalogPick[] = [];
  for (const sec of doc.menu) {
    for (const it of sec.items) {
      out.push({ id: it.id, name: it.name, category: sec.category });
    }
  }
  return out;
}

function defaultAllergenSelections(): Record<string, boolean> {
  const initial: Record<string, boolean> = {};
  for (const o of productDeclaredAllergenOptions) {
    initial[o.id] = false;
  }
  return initial;
}

function allergenSelectionsFromProduct(p: MenuProduct): Record<string, boolean> {
  const next = defaultAllergenSelections();
  const declared = new Set((p.allergens ?? []).map((a) => a.trim().toLowerCase()));
  for (const opt of productDeclaredAllergenOptions) {
    if (declared.has(opt.id.toLowerCase())) {
      next[opt.id] = true;
    }
  }
  return next;
}

type LinkedCatalogRow = { id: string; catalogItemId: string };

function defaultDietaryFlags(): Record<string, boolean> {
  const initial: Record<string, boolean> = {};
  for (const f of productDietaryFlags) {
    initial[f.id] = Boolean(f.defaultChecked);
  }
  return initial;
}

export function CreateProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editItemId = searchParams.get("itemId");
  const isEditingFromCatalog = Boolean(editItemId);

  const firstMain = productMainCategories[0];
  const [mainCategoryId, setMainCategoryId] = useState<string>(firstMain?.id ?? "");
  const mainCategory: ProductMainCategory | undefined = useMemo(
    () => productMainCategories.find((c) => c.id === mainCategoryId),
    [mainCategoryId],
  );

  const [subCategoryId, setSubCategoryId] = useState(
    () => firstMain?.subcategories[0]?.id ?? "",
  );

  const syncSubcategory = (catId: string) => {
    const cat = productMainCategories.find((c) => c.id === catId);
    const first = cat?.subcategories[0]?.id ?? "";
    setSubCategoryId(first);
  };

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [sku, setSku] = useState("");
  const [basePrice, setBasePrice] = useState("12.99");
  const [discountType, setDiscountType] = useState(productDiscountTypes[0]?.id ?? "none");
  const [discountValue, setDiscountValue] = useState("");
  const [variants, setVariants] = useState<NamedPriceRow[]>(() => [...productInitialVariants]);
  const [addons, setAddons] = useState<NamedPriceRow[]>(() => [...productInitialAddons]);
  const [ingredients, setIngredients] = useState("");
  const [keywords, setKeywords] = useState("");
  const [foodType, setFoodType] = useState<"veg" | "nonveg">("veg");
  const [available, setAvailable] = useState(true);
  const [timeFrom, setTimeFrom] = useState("12:00");
  const [timeTo, setTimeTo] = useState("23:00");
  const [deliverable, setDeliverable] = useState(true);
  const [pickup, setPickup] = useState(true);
  const [prepMins, setPrepMins] = useState("25");

  const [flags, setFlags] = useState<Record<string, boolean>>(defaultDietaryFlags);

  const [allergenSelections, setAllergenSelections] = useState<Record<string, boolean>>(
    defaultAllergenSelections,
  );
  const [allergenKitchenNotes, setAllergenKitchenNotes] = useState("");
  const [recommendedWith, setRecommendedWith] = useState<LinkedCatalogRow[]>([]);
  const [isCombo, setIsCombo] = useState(false);
  const [comboComponents, setComboComponents] = useState<LinkedCatalogRow[]>([]);

  const [productImages, setProductImages] = useState<ProductImageRow[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuBase = menuDemo as MenuDocument;
  const [catalogRev, setCatalogRev] = useState(0);
  const mergedCatalog = useMemo(() => mergeMenuWithLocal(menuBase), [menuBase, catalogRev]);
  const catalogFlat = useMemo(() => flattenCatalog(mergedCatalog), [mergedCatalog]);

  useEffect(() => {
    const bump = () => setCatalogRev((n) => n + 1);
    window.addEventListener(MENU_CATALOG_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(MENU_CATALOG_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const excludedCatalogIds = useMemo(() => {
    const ids = new Set<string>();
    if (editItemId) ids.add(editItemId);
    return ids;
  }, [editItemId]);

  const slugPreview = useMemo(() => {
    const fromName = slugify(name);
    return fromName || "auto-from-product-name";
  }, [name]);

  const finalPrice = useMemo(() => {
    const base = parseMoney(basePrice);
    const disc = parseMoney(discountValue);
    return calcFinalPrice(base, discountType, disc);
  }, [basePrice, discountType, discountValue]);

  const recommendedPickOptions = useMemo(
    () =>
      catalogFlat.filter(
        (c) =>
          !excludedCatalogIds.has(c.id) &&
          !recommendedWith.some((r) => r.catalogItemId === c.id),
      ),
    [catalogFlat, excludedCatalogIds, recommendedWith],
  );

  const comboPickOptions = useMemo(
    () =>
      catalogFlat.filter(
        (c) =>
          !excludedCatalogIds.has(c.id) &&
          !comboComponents.some((r) => r.catalogItemId === c.id),
      ),
    [catalogFlat, excludedCatalogIds, comboComponents],
  );

  const addRow = (setter: React.Dispatch<React.SetStateAction<NamedPriceRow[]>>) => {
    setter((rows) => [
      ...rows,
      { id: crypto.randomUUID(), name: "", price: "" },
    ]);
  };

  const updateRow = (
    setter: React.Dispatch<React.SetStateAction<NamedPriceRow[]>>,
    id: string,
    patch: Partial<Pick<NamedPriceRow, "name" | "price">>,
  ) => {
    setter((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (setter: React.Dispatch<React.SetStateAction<NamedPriceRow[]>>, id: string) => {
    setter((rows) => rows.filter((r) => r.id !== id));
  };

  const toggleFlag = (id: string) => {
    setFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllergen = (id: string) => {
    setAllergenSelections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addLinkedRow = (
    setter: React.Dispatch<React.SetStateAction<LinkedCatalogRow[]>>,
    catalogItemId: string,
    existingIds: Set<string>,
  ) => {
    if (!catalogItemId || existingIds.has(catalogItemId)) return;
    setter((rows) => [...rows, { id: crypto.randomUUID(), catalogItemId }]);
  };

  const removeLinkedRow = (
    setter: React.Dispatch<React.SetStateAction<LinkedCatalogRow[]>>,
    rowId: string,
  ) => {
    setter((rows) => rows.filter((r) => r.id !== rowId));
  };

  const catalogLabel = (itemId: string) =>
    catalogFlat.find((c) => c.id === itemId)?.name ?? itemId;

  useEffect(() => {
    const doc = mergeMenuWithLocal(menuDemo as MenuDocument);
    const reset = () => {
      const first = productMainCategories[0];
      setMainCategoryId(first?.id ?? "");
      setSubCategoryId(first?.subcategories[0]?.id ?? "");
      setName("");
      setShortDescription("");
      setLongDescription("");
      setSku("");
      setBasePrice("12.99");
      setDiscountType(productDiscountTypes[0]?.id ?? "none");
      setDiscountValue("");
      setVariants([...productInitialVariants]);
      setAddons([...productInitialAddons]);
      setIngredients("");
      setKeywords("");
      setFoodType("veg");
      setAvailable(true);
      setTimeFrom("12:00");
      setTimeTo("23:00");
      setDeliverable(true);
      setPickup(true);
      setPrepMins("25");
      setFlags(defaultDietaryFlags());
      setAllergenSelections(defaultAllergenSelections());
      setAllergenKitchenNotes("");
      setRecommendedWith([]);
      setIsCombo(false);
      setComboComponents([]);
      setProductImages([]);
    };

    if (!editItemId) {
      reset();
      return;
    }

    const p = findMenuProduct(doc, editItemId);
    if (!p) {
      reset();
      return;
    }

    setName(p.name);
    const desc = p.description;
    setShortDescription(desc.length > 120 ? desc.slice(0, 120) : desc);
    setLongDescription(desc);
    setSku(p.id);
    const unit = p.variants[0]?.price_gbp ?? p.base_price_gbp;
    setBasePrice(unit.toFixed(2));
    setDiscountType(productDiscountTypes[0]?.id ?? "none");
    setDiscountValue("");
    setVariants(
      p.variants.length > 0
        ? p.variants.map((v) => ({
            id: crypto.randomUUID(),
            name: v.size?.trim() ? v.size : "Standard",
            price: (v.price_gbp ?? p.base_price_gbp).toFixed(2),
          }))
        : [
            {
              id: crypto.randomUUID(),
              name: "Standard",
              price: p.base_price_gbp.toFixed(2),
            },
          ],
    );
    setAddons([...productInitialAddons]);
    setIngredients("");
    const kwParts = [...(p.allergens ?? []), ...(p.customisation ?? [])];
    setKeywords(kwParts.join(", "));
    setFoodType(p.type === "veg" ? "veg" : "nonveg");
    setAvailable(p.available);
    setTimeFrom("12:00");
    setTimeTo("23:00");
    setDeliverable(!p.collection_only);
    setPickup(true);
    setPrepMins("25");
    setFlags(defaultDietaryFlags());
    setAllergenSelections(allergenSelectionsFromProduct(p));
    setAllergenKitchenNotes("");
    setRecommendedWith([]);
    setIsCombo(false);
    setComboComponents([]);
    {
      const extra = p.gallery_image_urls ?? [];
      const urls = [p.image_url, ...extra]
        .filter((u, i, arr) => Boolean(u?.trim()) && arr.indexOf(u) === i)
        .slice(0, MAX_PRODUCT_IMAGES);
      setProductImages(urls.map((dataUrl) => ({ id: crypto.randomUUID(), dataUrl })));
    }
  }, [editItemId]);

  function pickCategoryMeta() {
    const mc = productMainCategories.find((c) => c.id === mainCategoryId);
    const sub = mc?.subcategories.find((s) => s.id === subCategoryId);
    const categoryLabel = sub
      ? `${mc?.label ?? "Menu"} — ${sub.label}`
      : (mc?.label ?? "Your menu items");
    const categoryId = buildPresetSubsectionCategoryId(mainCategoryId, subCategoryId);
    return { categoryId, categoryLabel };
  }

  function buildMenuProduct(): MenuProduct {
    const id = sku.trim() || `local-${Date.now()}`;
    const baseNum = parseMoney(basePrice);
    const discNum = parseMoney(discountValue);
    const sold = calcFinalPrice(baseNum, discountType, discNum);

    let vRows: MenuProduct["variants"] = variants
      .filter((v) => v.name.trim() || parseMoney(v.price) > 0)
      .map((v) => ({
        size: v.name.trim() || "Regular",
        price_gbp: parseMoney(v.price) > 0 ? parseMoney(v.price) : baseNum,
        currency: "GBP" as const,
      }));
    if (vRows.length === 0) {
      vRows = [{ size: "Regular", price_gbp: discountType !== "none" ? sold : baseNum, currency: "GBP" }];
    } else if (discountType !== "none" && discNum > 0) {
      vRows = vRows.map((v, idx) => (idx === 0 ? { ...v, price_gbp: sold } : v));
    }

    const declared = productDeclaredAllergenOptions
      .filter((o) => allergenSelections[o.id])
      .map((o) => o.id);

    const addonRows = addons
      .filter((a) => a.name.trim())
      .map((a) => ({
        name: a.name.trim(),
        price_gbp: parseMoney(a.price),
      }));

    const tags = keywords
      .split(/[\n,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (isCombo && comboComponents.length) {
      tags.push(`Combo: ${comboComponents.map((r) => catalogLabel(r.catalogItemId)).join(" · ")}`);
    }
    if (recommendedWith.length) {
      tags.push(`Pairs with: ${recommendedWith.map((r) => catalogLabel(r.catalogItemId)).join(" · ")}`);
    }

    const imageUrls = productImages.map((r) => r.dataUrl.trim()).filter(Boolean);
    const primaryImage = imageUrls[0]?.trim() || DEFAULT_PRODUCT_IMAGE;
    const galleryRest = imageUrls.slice(1);

    const product: MenuProduct = {
      id,
      name: name.trim() || "Untitled dish",
      description: longDescription.trim() || shortDescription.trim() || "—",
      type: foodType === "veg" ? "veg" : "non-veg",
      image_url: primaryImage,
      ...(galleryRest.length > 0 ? { gallery_image_urls: galleryRest } : {}),
      variants: vRows,
      base_price_gbp: baseNum,
      available,
      collection_only: !deliverable,
      allergens: declared.length ? declared : undefined,
      stock_note:
        allergenKitchenNotes.trim() ||
        `Prep about ${prepMins} min. Available ${timeFrom}–${timeTo}.`,
      addons: addonRows.length ? addonRows : undefined,
      tags: tags.length ? tags : undefined,
    };

    if (discountType === "percent" && discNum > 0) {
      product.discount_percent = Math.round(discNum);
      product.compare_at_price_gbp = baseNum;
    } else if (discountType === "fixed" && discNum > 0) {
      product.compare_at_price_gbp = baseNum;
    }

    return product;
  }

  function buildPreviewFound(): FoundMenuProduct {
    const item = buildMenuProduct();
    const { categoryId, categoryLabel } = pickCategoryMeta();
    return {
      item,
      category: { category: categoryLabel, category_id: categoryId, items: [item] },
    };
  }

  return (
    <PageContainer
      title={isEditingFromCatalog ? "Edit product" : "New product"}
      description={
        <span className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
          <Link href="/menu" className="transition-colors hover:text-primary">
            Menu
          </Link>
          <span aria-hidden>/</span>
          <span className="text-primary">
            {isEditingFromCatalog ? "Edit dish" : "New dish"}
          </span>
        </span>
      }
      actions={
        <>
          <Button type="button" variant="outline" size="md" onClick={() => router.push("/menu")}>
            Discard
          </Button>
          <Button type="button" variant="outline" size="md" onClick={() => setPreviewOpen(true)}>
            <MaterialIcon name="chrome_reader_mode" className="text-xl" />
            Preview
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => {
              const declaredAllergens = productDeclaredAllergenOptions
                .filter((o) => allergenSelections[o.id])
                .map((o) => o.id);
              const product = buildMenuProduct();
              const { categoryId, categoryLabel } = pickCategoryMeta();
              upsertLocalMenuItem({ category_id: categoryId, category: categoryLabel, product });
              console.info(isEditingFromCatalog ? "save product" : "publish product", {
                itemId: editItemId,
                name,
                shortDescription,
                longDescription,
                sku,
                basePrice: parseMoney(basePrice),
                discountType,
                discountValue: parseMoney(discountValue),
                finalPrice,
                variants,
                addons,
                ingredients,
                keywords,
                slug: slugPreview,
                foodType,
                mainCategoryId,
                subCategoryId,
                available,
                timeFrom,
                timeTo,
                deliverable,
                pickup,
                prepMins: Number.parseInt(prepMins, 10),
                flags,
                declaredAllergens,
                allergenKitchenNotes,
                recommendedCatalogItemIds: recommendedWith.map((r) => r.catalogItemId),
                isCombo,
                comboCatalogItemIds: comboComponents.map((r) => r.catalogItemId),
                storedProductId: product.id,
              });
              router.push(`/menu/item-list/${encodeURIComponent(product.id)}`);
            }}
          >
            <MaterialIcon name="save" className="text-xl" />
            Save product
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 space-y-8 lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <Card className="p-6 md:p-8">
            <SectionTitle icon="info" title="Basic information" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Product name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Paneer butter masala"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel requiredMark>Short description (max 120 chars)</FieldLabel>
                <input
                  className={control}
                  maxLength={120}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Classic creamy tomato curry with cottage cheese cubes."
                  aria-label="Short description"
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Detailed description</FieldLabel>
                <textarea
                  className={cn(control, "min-h-[7rem] resize-y")}
                  rows={4}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Describe the dish, heritage, and ingredients…"
                  aria-label="Detailed description"
                />
              </div>
              <div>
                <Input label="SKU" name="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="CUR-PAN-001" />
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <SectionTitle icon="fastfood" title="Combo / meal bundle" />
            <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-4 transition-colors hover:bg-surface-container-low">
              <input
                type="checkbox"
                checked={isCombo}
                onChange={(e) => {
                  const on = e.target.checked;
                  setIsCombo(on);
                  if (!on) setComboComponents([]);
                }}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <span>
                <span className="block text-sm font-bold text-on-surface">
                  This product is a combo (multiple existing dishes)
                </span>
                <span className="mt-1 block text-sm font-medium leading-relaxed text-on-surface-variant">
                  One menu listing that bundles existing catalog items. You are not creating new
                  underlying products — set the bundle price above and list each included dish
                  below. Checkout logic can expand the bundle when you wire the API.
                </span>
              </span>
            </label>
            {isCombo ? (
              <div className="space-y-4">
                <div>
                  <FieldLabel>Add dish to bundle</FieldLabel>
                  <select
                    className={control}
                    value=""
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!v) return;
                      addLinkedRow(
                        setComboComponents,
                        v,
                        new Set(comboComponents.map((r) => r.catalogItemId)),
                      );
                      e.target.value = "";
                    }}
                    aria-label="Add dish to combo bundle"
                  >
                    <option value="">Choose a dish to include…</option>
                    {comboPickOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.category}
                      </option>
                    ))}
                  </select>
                </div>
                {comboComponents.length < 2 ? (
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Add at least two dishes for a meaningful combo.
                  </p>
                ) : null}
                {comboComponents.length === 0 ? (
                  <p className="rounded-xl bg-surface-container-low/60 px-4 py-3 text-sm text-secondary ring-1 ring-outline-variant/10">
                    No dishes in this bundle yet.
                  </p>
                ) : (
                  <ol className="list-decimal space-y-2 pl-5 marker:font-bold marker:text-primary">
                    {comboComponents.map((row, index) => {
                      const meta = catalogFlat.find((c) => c.id === row.catalogItemId);
                      return (
                        <li
                          key={row.id}
                          className="rounded-xl bg-surface-container-low py-2 pl-2 pr-2 ring-1 ring-outline-variant/15"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-secondary">
                                Part {index + 1}
                              </p>
                              <p className="truncate text-sm font-bold text-on-surface">
                                {catalogLabel(row.catalogItemId)}
                              </p>
                              {meta ? (
                                <p className="text-xs font-medium text-secondary">{meta.category}</p>
                              ) : null}
                            </div>
                            <button
                              type="button"
                              className="shrink-0 rounded-full p-2 text-outline-variant transition-colors hover:bg-error-container/40 hover:text-primary"
                              aria-label="Remove from combo"
                              onClick={() => removeLinkedRow(setComboComponents, row.id)}
                            >
                              <MaterialIcon name="close" className="text-xl" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            ) : null}
          </Card>

          <Card className="p-6 md:p-8">
            <SectionTitle icon="payments" title="Pricing & discounts" />
            <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-3">
              <div>
                <Input
                  label="Base price"
                  name="basePrice"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  left={<span className="font-bold text-secondary">{productCurrencySymbol}</span>}
                />
              </div>
              <div>
                <FieldLabel>Discount type</FieldLabel>
                <select
                  className={control}
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  aria-label="Discount type"
                >
                  {productDiscountTypes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  label="Discount value"
                  name="discountValue"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low/80 p-5 sm:col-span-3">
                <span className="text-sm font-bold text-secondary">Calculated final price</span>
                <span className="font-headline text-2xl font-black text-primary">{formatMoney(finalPrice)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-8 lg:col-span-12 lg:col-start-1 lg:row-start-2 md:grid-cols-2">
          <Card className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
              <div className="flex items-center gap-2">
                <MaterialIcon name="layers" className="text-xl text-primary" />
                <h3 className="font-headline text-base font-bold text-on-surface">Variants</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addRow(setVariants)}>
                <MaterialIcon name="add" className="text-lg" />
                Add new
              </Button>
            </div>
            <div className="space-y-3">
              {variants.map((row) => (
                <div key={row.id} className="flex items-center gap-2">
                  <input
                    className={cn(controlSm, "min-w-0 flex-1")}
                    value={row.name}
                    onChange={(e) => updateRow(setVariants, row.id, { name: e.target.value })}
                    placeholder="Portion or size"
                    aria-label="Variant name"
                  />
                  <div className="relative w-32 shrink-0 sm:w-36">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">
                      {productCurrencySymbol}
                    </span>
                    <input
                      className={cn(controlSm, "pl-8")}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={row.price}
                      onChange={(e) => updateRow(setVariants, row.id, { price: e.target.value })}
                      placeholder="0.00"
                      aria-label="Variant price"
                    />
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-full p-2 text-outline-variant transition-colors hover:bg-error-container/40 hover:text-primary"
                    aria-label="Remove variant"
                    onClick={() => removeRow(setVariants, row.id)}
                  >
                    <MaterialIcon name="delete" className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
              <div className="flex items-center gap-2">
                <MaterialIcon name="extension" className="text-xl text-primary" />
                <h3 className="font-headline text-base font-bold text-on-surface">Add-ons</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addRow(setAddons)}>
                <MaterialIcon name="add" className="text-lg" />
                Add new
              </Button>
            </div>
            <div className="space-y-3">
              {addons.map((row) => (
                <div key={row.id} className="flex items-center gap-2">
                  <input
                    className={cn(controlSm, "min-w-0 flex-1")}
                    value={row.name}
                    onChange={(e) => updateRow(setAddons, row.id, { name: e.target.value })}
                    placeholder="Extra cheese"
                    aria-label="Add-on name"
                  />
                  <div className="relative w-32 shrink-0 sm:w-36">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">
                      {productCurrencySymbol}
                    </span>
                    <input
                      className={cn(controlSm, "pl-8")}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={row.price}
                      onChange={(e) => updateRow(setAddons, row.id, { price: e.target.value })}
                      placeholder="0.00"
                      aria-label="Add-on price"
                    />
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-full p-2 text-outline-variant transition-colors hover:bg-error-container/40 hover:text-primary"
                    aria-label="Remove add-on"
                    onClick={() => removeRow(setAddons, row.id)}
                  >
                    <MaterialIcon name="delete" className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="min-w-0 space-y-8 lg:col-span-12 lg:col-start-1 lg:row-start-3">
          <Card className="p-6 md:p-8">
            <SectionTitle icon="science" title="Ingredients & search" />
            <div className="space-y-6">
              <div>
                <FieldLabel>Ingredients list</FieldLabel>
                <textarea
                  className={cn(control, "min-h-[5rem] resize-y")}
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Paneer, tomato, butter, spices, cream…"
                  aria-label="Ingredients"
                />
                <p className="mt-2 text-[11px] italic text-secondary">Separate ingredients with commas.</p>
              </div>
              <div>
                <FieldLabel>Search keywords</FieldLabel>
                <textarea
                  className={cn(control, "min-h-[5rem] resize-y")}
                  rows={2}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Curry, mild, authentic, Indian — one phrase per line or comma-separated."
                  aria-label="Search keywords"
                />
                <p className="mt-2 text-[11px] italic text-secondary">
                  Same style as ingredients; use commas or new lines between phrases.
                </p>
              </div>
              <div>
                <FieldLabel>Slug (URL)</FieldLabel>
                <input
                  className={cn(control, "cursor-not-allowed bg-surface-container-high italic text-secondary")}
                  disabled
                  readOnly
                  value={slugPreview}
                  aria-label="URL slug preview"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="min-w-0 space-y-8 lg:col-span-5 lg:col-start-8 lg:row-span-1 lg:row-start-1 lg:self-start">
          <Card className="p-6">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Categorization</h3>
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-bold text-on-surface">
                  Food type <span className="text-primary">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/15 p-3 transition-colors hover:bg-surface-container-low",
                      foodType === "veg" && "bg-primary/5 ring-2 ring-primary/25",
                    )}
                  >
                    <input
                      type="radio"
                      name="food_type"
                      checked={foodType === "veg"}
                      onChange={() => setFoodType("veg")}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="flex items-center gap-2 text-xs font-bold text-on-surface">
                      <span className="h-2 w-2 rounded-full bg-green-600" aria-hidden />
                      Veg
                    </span>
                  </label>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/15 p-3 transition-colors hover:bg-surface-container-low",
                      foodType === "nonveg" && "bg-primary/5 ring-2 ring-primary/25",
                    )}
                  >
                    <input
                      type="radio"
                      name="food_type"
                      checked={foodType === "nonveg"}
                      onChange={() => setFoodType("nonveg")}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="flex items-center gap-2 text-xs font-bold text-on-surface">
                      <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                      Non-veg
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <FieldLabel requiredMark>Main category</FieldLabel>
                <select
                  className={controlSm}
                  value={mainCategoryId}
                  onChange={(e) => {
                    const v = e.target.value;
                    setMainCategoryId(v);
                    syncSubcategory(v);
                  }}
                  aria-label="Main category"
                >
                  {productMainCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Sub-category</FieldLabel>
                <select
                  className={controlSm}
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                  aria-label="Sub-category"
                >
                  {(mainCategory?.subcategories ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Product media</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const input = e.target;
                const file = input.files?.[0];
                input.value = "";
                if (!file || !file.type.startsWith("image/")) return;
                void (async () => {
                  try {
                    const dataUrl = await readImageFileAsDataUrl(file);
                    setProductImages((prev) => {
                      const row = { id: crypto.randomUUID(), dataUrl };
                      if (MAX_PRODUCT_IMAGES <= 1) return [row];
                      const remaining = MAX_PRODUCT_IMAGES - prev.length;
                      if (remaining <= 0) return prev;
                      return [...prev, row];
                    });
                  } catch {
                    /* ignore read errors */
                  }
                })();
              }}
            />
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group w-full cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low/30 p-8 text-center transition-colors hover:bg-surface-container-low"
              >
                <MaterialIcon
                  name="add_photo_alternate"
                  className="text-4xl text-outline-variant transition-colors group-hover:text-primary"
                />
                <p className="mt-2 text-xs font-bold text-secondary">
                  {productImages.length > 0 ? "Replace image" : "Add image"}
                </p>
                <p className="mt-1 text-[10px] text-secondary">
                  One image per product for now. Stored locally until you connect an API.
                </p>
              </button>
              {productImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {productImages.map((row) => (
                    <div
                      key={row.id}
                      className="relative aspect-square overflow-hidden rounded-xl bg-surface-container-high ring-1 ring-outline-variant/15"
                    >
                      <Image
                        src={row.dataUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="120px"
                        unoptimized
                      />
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() =>
                          setProductImages((prev) => prev.filter((r) => r.id !== row.id))
                        }
                        className="absolute end-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface shadow-sm ring-1 ring-outline-variant/20 transition-colors hover:bg-error-container/35 hover:text-primary"
                      >
                        <MaterialIcon name="close" className="!text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:col-span-12 lg:col-start-1 lg:row-start-4 lg:grid-cols-2">
          <Card className="p-6 md:p-8">
            <SectionTitle icon="shield_with_heart" title="Allergen & kitchen detail" />
            <p className="mb-6 text-sm font-medium leading-relaxed text-on-surface-variant">
              Declare what guests with allergies must know. Combine with the marketing flags
              section below for a complete picture.
            </p>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {productDeclaredAllergenOptions.map((opt) => (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/15 bg-surface-container-low/40 p-3 transition-colors hover:bg-surface-container-low"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(allergenSelections[opt.id])}
                    onChange={() => toggleAllergen(opt.id)}
                    className="h-4 w-4 shrink-0 accent-primary"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            <div>
              <FieldLabel>Extra allergy / cross-contamination notes</FieldLabel>
              <textarea
                className={cn(control, "min-h-[5rem] resize-y")}
                rows={3}
                value={allergenKitchenNotes}
                onChange={(e) => setAllergenKitchenNotes(e.target.value)}
                placeholder="e.g. Fried in shared oil, may contain traces of shellfish, kitchen handles nuts…"
                aria-label="Extra allergy notes"
              />
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <SectionTitle icon="restaurant_menu" title="Kitchen — recommend with this dish" />
            <p className="mb-6 text-sm font-medium leading-relaxed text-on-surface-variant">
              Link other menu items the kitchen suggests serving alongside this product (for
              example naan with a curry). This does not change those items&apos; recipes or prices.
            </p>
            <div className="mb-4">
              <FieldLabel>Add from catalog</FieldLabel>
              <select
                className={control}
                value=""
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) return;
                  addLinkedRow(
                    setRecommendedWith,
                    v,
                    new Set(recommendedWith.map((r) => r.catalogItemId)),
                  );
                  e.target.value = "";
                }}
                aria-label="Add recommended dish"
              >
                <option value="">Choose a dish to recommend…</option>
                {recommendedPickOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.category}
                  </option>
                ))}
              </select>
            </div>
            {recommendedWith.length === 0 ? (
              <p className="rounded-xl bg-surface-container-low/60 px-4 py-3 text-sm text-secondary ring-1 ring-outline-variant/10">
                No linked recommendations yet.
              </p>
            ) : (
              <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {recommendedWith.map((row) => {
                  const meta = catalogFlat.find((c) => c.id === row.catalogItemId);
                  return (
                    <li
                      key={row.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low px-4 py-3 ring-1 ring-outline-variant/15"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-on-surface">
                          {catalogLabel(row.catalogItemId)}
                        </p>
                        {meta ? (
                          <p className="text-xs font-medium text-secondary">{meta.category}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-full p-2 text-outline-variant transition-colors hover:bg-error-container/40 hover:text-primary"
                        aria-label="Remove recommendation"
                        onClick={() => removeLinkedRow(setRecommendedWith, row.id)}
                      >
                        <MaterialIcon name="close" className="text-xl" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <div className="lg:col-span-12 lg:col-start-1 lg:row-start-5">
          <Card className="p-6 md:p-8">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-secondary">
              Flags &amp; dietary
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {productDietaryFlags.map((f) => (
                <label
                  key={f.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-outline-variant/20 hover:bg-surface-container-low"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <MaterialIcon name={f.icon} className={cn("shrink-0 text-2xl", f.iconClassName)} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      {f.label}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(flags[f.id])}
                    onChange={() => toggleFlag(f.id)}
                    className="h-4 w-4 shrink-0 accent-primary"
                  />
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="border-t border-outline-variant/15 pt-8 lg:col-span-12 lg:col-start-1 lg:row-start-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-headline text-sm font-bold text-on-surface">Review before publishing</p>
              <p className="mt-1 text-sm text-secondary">
                Opens the same item detail layout guests see. Data stays in this browser until an
                API is wired.
              </p>
            </div>
            <Button type="button" variant="outline" size="md" onClick={() => setPreviewOpen(true)}>
              <MaterialIcon name="chrome_reader_mode" className="text-xl" />
              Preview item detail
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullscreen
        unpadded
        className="flex max-h-[100dvh] flex-col shadow-2xl"
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-outline-variant/15 px-4 py-3 md:px-6">
            <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>
              Close preview
            </Button>
            <p className="font-headline text-sm font-bold text-on-surface">Guest view — item detail</p>
            <Button type="button" variant="primary" size="sm" onClick={() => setPreviewOpen(false)}>
              Looks good
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto max-w-6xl">
              <MenuItemDetail
                key={`${sku}-${productImages.map((r) => r.id).join("-")}`}
                found={buildPreviewFound()}
                allergyNotice={menuBase.restaurant.allergy_notice}
              />
            </div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
