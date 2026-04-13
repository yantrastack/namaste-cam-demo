"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";
import { formatGbp } from "./format-gbp";
import type { FoundMenuProduct } from "./find-menu-product";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

export type MenuItemDetailProps = {
  found: FoundMenuProduct;
  /** Restaurant-wide disclaimer from menu JSON */
  allergyNotice?: string;
};

function typeLabel(type: string): string {
  if (type === "veg") return "Vegetarian";
  if (type === "non-veg") return "Non-vegetarian";
  return type;
}

/** Labels in parentheses from the dish title, e.g. "(Spicy)" */
function nameSuffixLabels(name: string): string[] {
  const out: string[] = [];
  const re = /\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(name)) !== null) {
    const t = m[1]?.trim();
    if (t) out.push(t);
  }
  return out;
}

/** Split editor/catalog tag lines into pairings, combo bundle text, and plain keyword phrases. */
function partitionCatalogTags(tags: string[] | undefined): {
  pairsWithDetail: string | undefined;
  comboDetail: string | undefined;
  keywordTags: string[];
} {
  let pairsWithDetail: string | undefined;
  let comboDetail: string | undefined;
  const keywordTags: string[] = [];
  for (const raw of tags ?? []) {
    const t = raw.trim();
    if (!t) continue;
    const pairsM = t.match(/^pairs with:\s*(.*)$/i);
    if (pairsM) {
      pairsWithDetail = pairsM[1]?.trim();
      continue;
    }
    const comboM = t.match(/^combo:\s*(.*)$/i);
    if (comboM) {
      comboDetail = comboM[1]?.trim();
      continue;
    }
    keywordTags.push(t);
  }
  const uniqueKeywords = [...new Set(keywordTags)];
  return { pairsWithDetail, comboDetail, keywordTags: uniqueKeywords };
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="font-headline text-xs font-bold uppercase tracking-widest text-secondary">
      {children}
    </h2>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-outline-variant/15 py-3 last:border-b-0">
      <dt className="text-xs font-bold uppercase tracking-wider text-secondary">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-on-surface">{children}</dd>
    </div>
  );
}

function SpicyMeter({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Spice level ${level} of 5`}>
      {([1, 2, 3, 4, 5] as const).map((n) => (
        <MaterialIcon
          key={n}
          name="local_fire_department"
          filled={n <= level}
          className={cn(
            "!text-lg",
            n <= level ? "text-primary" : "text-outline-variant/40",
          )}
        />
      ))}
    </div>
  );
}

export function MenuItemDetail({ found, allergyNotice }: MenuItemDetailProps) {
  const { item, category } = found;
  const primary = item.variants[0]?.price_gbp ?? item.base_price_gbp;
  const galleryKey = (item.gallery_image_urls ?? []).join("|");
  const allImages = useMemo(() => {
    const extra = item.gallery_image_urls ?? [];
    const raw = [item.image_url, ...extra];
    return raw.filter((u, i, a) => Boolean(u?.trim()) && a.indexOf(u) === i);
  }, [item.image_url, item.gallery_image_urls]);
  const [thumbIdx, setThumbIdx] = useState(0);
  useEffect(() => {
    setThumbIdx(0);
  }, [item.image_url, galleryKey]);
  const imgSrc = allImages[thumbIdx] ?? allImages[0] ?? PLACEHOLDER;
  const [heroSrc, setHeroSrc] = useState(imgSrc);
  useEffect(() => {
    setHeroSrc(imgSrc);
  }, [imgSrc]);
  const nameLabels = useMemo(() => nameSuffixLabels(item.name), [item.name]);
  const { pairsWithDetail, comboDetail, keywordTags } = useMemo(
    () => partitionCatalogTags(item.tags),
    [item.tags],
  );
  const showDetailBottomCard =
    nameLabels.length > 0 ||
    keywordTags.length > 0 ||
    Boolean(pairsWithDetail) ||
    Boolean(comboDetail);

  const hasCompare =
    typeof item.compare_at_price_gbp === "number" &&
    item.compare_at_price_gbp > primary;
  const showVariantTable =
    item.variants.length > 1 ||
    (item.variants.length === 1 && item.variants[0].size !== "Regular");

  const stockSummary = (() => {
    if (!item.available) return "Not available to order";
    if (typeof item.available_qty === "number") return `${item.available_qty} in stock`;
    if (item.stock_note) return item.stock_note;
    return "In stock";
  })();

  const showAllergenSection =
    (item.allergens && item.allergens.length > 0) ||
    Boolean(allergyNotice?.trim()) ||
    item.type === "non-veg";

  return (
    <div className="space-y-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] xl:grid-cols-[minmax(0,26rem)_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card className="overflow-hidden p-0 shadow-md ring-outline-variant/15">
            <div className="relative aspect-square w-full bg-surface-container-high sm:aspect-[4/3] lg:aspect-square">
              <Image
                src={heroSrc}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 26rem"
                priority
                unoptimized={heroSrc.startsWith("data:")}
                onError={() => setHeroSrc(PLACEHOLDER)}
              />
            </div>
            {allImages.length > 1 ? (
              <div
                className="flex gap-2 overflow-x-auto border-t border-outline-variant/15 p-2"
                role="tablist"
                aria-label="Product photos"
              >
                {allImages.map((url, i) => (
                  <button
                    key={`${i}-${url.slice(0, 24)}`}
                    type="button"
                    role="tab"
                    aria-selected={i === thumbIdx}
                    onClick={() => setThumbIdx(i)}
                    className={cn(
                      "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 transition-shadow",
                      i === thumbIdx ? "ring-primary" : "ring-transparent hover:ring-outline-variant/40",
                    )}
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                      unoptimized={url.startsWith("data:")}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Card className="space-y-4 p-6 shadow-md ring-outline-variant/15 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    tone={
                      item.type === "veg"
                        ? "success"
                        : item.type === "non-veg"
                          ? "error"
                          : "neutral"
                    }
                    className="normal-case tracking-normal"
                  >
                    {typeLabel(item.type)}
                  </Badge>
                  {item.available ? (
                    <Badge tone="success" className="normal-case tracking-normal">
                      Available
                    </Badge>
                  ) : (
                    <Badge tone="error" className="normal-case tracking-normal">
                      Unavailable
                    </Badge>
                  )}
                  {item.collection_only ? (
                    <Badge tone="info" className="normal-case tracking-normal">
                      Collection only
                    </Badge>
                  ) : null}
                  {typeof item.discount_percent === "number" && item.discount_percent > 0 ? (
                    <Badge tone="warning" className="normal-case tracking-normal">
                      {item.discount_percent}% off
                    </Badge>
                  ) : null}
                </div>
              </div>
              <div className="shrink-0 text-right">
                {hasCompare ? (
                  <p className="text-sm text-secondary line-through">
                    {formatGbp(item.compare_at_price_gbp!)}
                  </p>
                ) : null}
                <p className="font-headline text-3xl font-extrabold text-primary md:text-4xl">
                  {formatGbp(primary)}
                </p>
                <p className="mt-1 text-xs font-medium text-secondary">
                  {item.variants.length > 1 ? "From (UK)" : "Price (UK)"}
                </p>
              </div>
            </div>

            <p className="text-base leading-relaxed text-on-surface-variant">{item.description}</p>

            {typeof item.spicy_level === "number" ? (
              <div className="rounded-xl bg-surface-container-low px-4 py-3 ring-1 ring-outline-variant/15">
                <SectionTitle>Spice level</SectionTitle>
                <div className="mt-2">
                  <SpicyMeter level={item.spicy_level} />
                </div>
              </div>
            ) : null}
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5 shadow-md ring-outline-variant/15 md:p-6">
              <SectionTitle>Pricing</SectionTitle>
              <dl className="mt-3">
                <DetailRow label="Base list (GBP)">{formatGbp(item.base_price_gbp)}</DetailRow>
                {showVariantTable ? (
                  <div className="border-t border-outline-variant/15 pt-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">
                      Sizes
                    </p>
                    <ul className="divide-y divide-outline-variant/15 rounded-xl bg-surface-container-low px-3 ring-1 ring-outline-variant/10">
                      {item.variants.map((v) => (
                        <li
                          key={`${v.size}-${v.price_gbp}`}
                          className="flex items-center justify-between gap-3 py-2.5 text-sm"
                        >
                          <span className="font-medium text-on-surface">{v.size}</span>
                          <span className="font-headline font-bold text-primary">
                            {formatGbp(v.price_gbp)}
                            {v.currency && v.currency !== "GBP" ? (
                              <span className="ml-1 text-xs font-normal text-secondary">
                                {v.currency}
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <DetailRow label="Default size">{item.variants[0]?.size ?? "—"}</DetailRow>
                )}
              </dl>
            </Card>

            <Card className="p-5 shadow-md ring-outline-variant/15 md:p-6">
              <SectionTitle>Stock &amp; fulfilment</SectionTitle>
              <dl className="mt-3">
                <DetailRow label="Status">{stockSummary}</DetailRow>
                {item.stock_note && typeof item.available_qty === "number" ? (
                  <DetailRow label="Kitchen note">{item.stock_note}</DetailRow>
                ) : null}
                <DetailRow label="Orderable">{item.available ? "Yes" : "No"}</DetailRow>
                <DetailRow label="Collection only">
                  {item.collection_only ? "Yes" : "No"}
                </DetailRow>
              </dl>
            </Card>
          </div>

          {(item.volume_ml != null || item.quantity) && (
            <Card className="p-5 shadow-md ring-outline-variant/15 md:p-6">
              <SectionTitle>Serving &amp; pack</SectionTitle>
              <dl className="mt-3">
                {item.quantity ? <DetailRow label="Portion">{item.quantity}</DetailRow> : null}
                {item.volume_ml != null ? (
                  <DetailRow label="Volume">{item.volume_ml} ml</DetailRow>
                ) : null}
              </dl>
            </Card>
          )}

          {item.addons && item.addons.length > 0 ? (
            <Card className="p-5 shadow-md ring-outline-variant/15 md:p-6">
              <SectionTitle>Add-ons</SectionTitle>
              <ul className="mt-3 divide-y divide-outline-variant/15">
                {item.addons.map((a, i) => (
                  <li
                    key={`${a.name}-${i}`}
                    className="flex items-center justify-between gap-3 py-3 text-sm first:pt-0"
                  >
                    <span className="font-medium text-on-surface">{a.name}</span>
                    <span className="font-headline font-bold text-primary">
                      {typeof a.price_gbp === "number" ? formatGbp(a.price_gbp) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {item.customisation && item.customisation.length > 0 ? (
            <Card className="p-5 shadow-md ring-outline-variant/15 md:p-6">
              <SectionTitle>Customisation</SectionTitle>
              <p className="mt-2 text-sm text-on-surface-variant">
                Guests can choose from the following options when ordering.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.customisation.map((c) => (
                  <Badge key={c} tone="neutral" className="normal-case tracking-normal">
                    {c}
                  </Badge>
                ))}
              </div>
            </Card>
          ) : null}

          <Card className="p-5 shadow-md ring-outline-variant/15 md:p-6">
            <SectionTitle>Catalog identifiers</SectionTitle>
            <dl className="mt-3">
              <DetailRow label="Item ID">{item.id}</DetailRow>
              <DetailRow label="Category">{category.category}</DetailRow>
              <DetailRow label="Category ID">{category.category_id}</DetailRow>
            </dl>
          </Card>
        </div>
      </div>

      {showAllergenSection ? (
        <Card className="p-5 shadow-md ring-outline-variant/15 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <MaterialIcon name="shield_with_heart" className="text-primary !text-xl" />
            <SectionTitle>Allergens &amp; kitchen notice</SectionTitle>
          </div>
          <div className="mt-5 space-y-5 text-sm leading-relaxed">
            {item.allergens && item.allergens.length > 0 ? (
              <div>
                <p className="font-headline text-xs font-bold uppercase tracking-widest text-secondary">
                  This dish
                </p>
                <p className="mt-2 text-on-surface-variant">
                  Declared on this dish in the catalog.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.allergens.map((a) => (
                    <Badge key={a} tone="warning" className="normal-case tracking-normal">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
            {allergyNotice?.trim() ? (
              <div>
                <p className="font-headline text-xs font-bold uppercase tracking-widest text-secondary">
                  Kitchen-wide notice
                </p>
                <p className="mt-2 text-on-surface-variant">{allergyNotice.trim()}</p>
              </div>
            ) : null}
            {!item.allergens?.length && !allergyNotice?.trim() ? (
              <p className="text-on-surface-variant">
                No item-level allergens are recorded for this dish. Guests with allergies should
                contact the restaurant for confirmation.
              </p>
            ) : null}
          </div>
        </Card>
      ) : null}

      {showDetailBottomCard ? (
        <Card className="space-y-8 p-5 shadow-md ring-outline-variant/15 md:p-6">
          {nameLabels.length > 0 ? (
            <div>
              <SectionTitle>From dish name</SectionTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {nameLabels.map((t) => (
                  <Badge key={t} tone="neutral" className="normal-case tracking-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {keywordTags.length > 0 ? (
            <div
              className={cn(
                nameLabels.length > 0 && "border-t border-outline-variant/15 pt-8",
              )}
            >
              <SectionTitle>Search keywords</SectionTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {keywordTags.map((t) => (
                  <Badge key={t} tone="neutral" className="normal-case tracking-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {pairsWithDetail ? (
            <div
              className={cn(
                (nameLabels.length > 0 || keywordTags.length > 0) &&
                  "border-t border-outline-variant/15 pt-8",
              )}
            >
              <SectionTitle>Recommended pairings</SectionTitle>
              <p className="mt-2 text-sm font-medium leading-relaxed text-on-surface-variant">
                {pairsWithDetail}
              </p>
            </div>
          ) : null}

          {comboDetail ? (
            <div
              className={cn(
                (nameLabels.length > 0 ||
                  keywordTags.length > 0 ||
                  Boolean(pairsWithDetail)) &&
                  "border-t border-outline-variant/15 pt-8",
              )}
            >
              <SectionTitle>Combo includes</SectionTitle>
              <p className="mt-2 text-sm font-medium leading-relaxed text-on-surface-variant">
                {comboDetail}
              </p>
            </div>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
