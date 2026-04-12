"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  productCurrencySymbol,
  productDietaryFlags,
  productDiscountTypes,
  productInitialAddons,
  productInitialVariants,
  productMainCategories,
  type NamedPriceRow,
  type ProductMainCategory,
} from "@/lib/data/product-catalog";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-xl border-none bg-surface px-4 py-3.5 font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary";

const controlSm =
  "w-full rounded-xl border-none bg-surface px-3 py-2.5 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary";

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

export function CreateProductForm() {
  const router = useRouter();
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

  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const f of productDietaryFlags) {
      initial[f.id] = Boolean(f.defaultChecked);
    }
    return initial;
  });

  const slugPreview = useMemo(() => {
    const fromName = slugify(name);
    return fromName || "auto-from-product-name";
  }, [name]);

  const finalPrice = useMemo(() => {
    const base = parseMoney(basePrice);
    const disc = parseMoney(discountValue);
    return calcFinalPrice(base, discountType, disc);
  }, [basePrice, discountType, discountValue]);

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

  return (
    <PageContainer
      title="Add product"
      description={
        <span className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
          <Link href="/menu" className="transition-colors hover:text-primary">
            Menu
          </Link>
          <span aria-hidden>/</span>
          <span className="text-primary">New dish</span>
        </span>
      }
      actions={
        <>
          <Button type="button" variant="outline" size="md" onClick={() => router.push("/menu")}>
            Discard
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => {
              // Wire to API when available
              console.info("publish product", {
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
              });
            }}
          >
            <MaterialIcon name="save" className="text-xl" />
            Publish product
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                    <div className="relative w-28 shrink-0">
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
                    <div className="relative w-28 shrink-0">
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Input
                    label="Search keywords"
                    name="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Curry, mild, authentic, Indian"
                  />
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
            </div>
          </Card>
        </div>

        <div className="space-y-8 lg:col-span-4">
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
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Availability</h3>
              <label className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                />
                <span className="pointer-events-none absolute inset-0 rounded-full bg-surface-container-high transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-container-lowest" />
                <span className="pointer-events-none absolute start-[2px] top-1/2 z-10 h-4 w-4 -translate-y-1/2 rounded-full border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-transform peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5" />
              </label>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="min-w-0 flex-1">
                  <FieldLabel>From</FieldLabel>
                  <input
                    type="time"
                    className={controlSm}
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    aria-label="Available from"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <FieldLabel>To</FieldLabel>
                  <input
                    type="time"
                    className={controlSm}
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    aria-label="Available until"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/15 bg-surface-container-low/50 p-3">
                  <input
                    type="checkbox"
                    checked={deliverable}
                    onChange={(e) => setDeliverable(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-[11px] font-bold text-on-surface">Deliverable</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/15 bg-surface-container-low/50 p-3">
                  <input
                    type="checkbox"
                    checked={pickup}
                    onChange={(e) => setPickup(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-[11px] font-bold text-on-surface">Pickup</span>
                </label>
              </div>
              <div>
                <Input
                  label="Prep time (mins)"
                  name="prepMins"
                  type="number"
                  min={0}
                  value={prepMins}
                  onChange={(e) => setPrepMins(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Product media</h3>
            <div className="space-y-4">
              <button
                type="button"
                className="group w-full cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low/30 p-8 text-center transition-colors hover:bg-surface-container-low"
              >
                <MaterialIcon
                  name="add_photo_alternate"
                  className="text-4xl text-outline-variant transition-colors group-hover:text-primary"
                />
                <p className="mt-2 text-xs font-bold text-secondary">Upload main image</p>
                <p className="mt-1 text-[10px] text-secondary">Recommended 1080×1080px</p>
              </button>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container-low"
                  >
                    <MaterialIcon name="image" className="text-3xl text-outline-variant/60" />
                  </div>
                ))}
                <button
                  type="button"
                  className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low/50 transition-colors hover:bg-surface-container-high"
                  aria-label="Add gallery image"
                >
                  <MaterialIcon name="add" className="text-2xl text-secondary" />
                </button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Flags & dietary</h3>
            <div className="space-y-2">
              {productDietaryFlags.map((f) => (
                <label
                  key={f.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-outline-variant/20 hover:bg-surface-container-low"
                >
                  <span className="flex items-center gap-3">
                    <MaterialIcon name={f.icon} className={cn("text-2xl", f.iconClassName)} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      {f.label}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(flags[f.id])}
                    onChange={() => toggleFlag(f.id)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
