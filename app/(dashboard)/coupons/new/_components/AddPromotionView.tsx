"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { formatCouponValue, formatDisplayDate } from "@/lib/coupons/format";
import {
  loadCouponStore,
  newCouponId,
  saveCouponStore,
  slugCodeFromTitle,
} from "@/lib/coupons/store";
import type { Coupon, CouponType } from "@/lib/coupons/types";

const CATEGORY_PRESETS = [
  "Tandoori Specialties",
  "Vegan Entrees",
  "Breads",
  "Desserts",
  "Drinks",
  "Starters",
  "Mains",
] as const;

function toDatetimeLocalValue(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(v: string): string {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function uniqueCode(base: string, existing: Set<string>): string {
  let code = base.slice(0, 14);
  if (!existing.has(code)) return code;
  for (let i = 0; i < 20; i += 1) {
    const suffix = Math.floor(Math.random() * 90 + 10);
    const next = `${base.slice(0, 10)}${suffix}`;
    if (!existing.has(next)) return next;
  }
  return `${base.slice(0, 8)}${Date.now().toString().slice(-4)}`;
}

type Props = {
  editId: string | null;
};

export function AddPromotionView({ editId }: Props) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [promotionType, setPromotionType] = useState<CouponType>("percentage");
  const [percentOff, setPercentOff] = useState("20");
  const [fixedAmount, setFixedAmount] = useState("5");
  const [freeItemLabel, setFreeItemLabel] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [oncePerUser, setOncePerUser] = useState(true);
  const [usageLimit, setUsageLimit] = useState("500");
  const [minPurchase, setMinPurchase] = useState("25");
  const [allMenu, setAllMenu] = useState(false);
  const [categories, setCategories] = useState<string[]>(["Tandoori Specialties", "Vegan Entrees"]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lockedCode, setLockedCode] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const applyCoupon = useCallback((c: Coupon) => {
    setEditingId(c.id);
    setLockedCode(c.code);
    setCampaignName(c.campaignName);
    setDescription(c.description ?? "");
    setPromotionType(c.type);
    setPercentOff(c.percentOff != null ? String(c.percentOff) : "20");
    setFixedAmount(c.fixedAmount != null ? String(c.fixedAmount) : "5");
    setFreeItemLabel(c.freeItemLabel ?? "");
    setStartsAt(toDatetimeLocalValue(c.startsAt));
    setEndsAt(toDatetimeLocalValue(c.expiryDate));
    setOncePerUser(Boolean(c.oncePerUser));
    setUsageLimit(c.usageLimit != null ? String(c.usageLimit) : "500");
    setMinPurchase(c.minPurchase != null ? String(c.minPurchase) : "25");
    setAllMenu(Boolean(c.allMenu));
    setCategories(c.categories?.length ? c.categories : []);
  }, []);

  useEffect(() => {
    const store = loadCouponStore();
    if (editId) {
      const found = store.coupons.find((c) => c.id === editId);
      if (found) applyCoupon(found);
      else {
        setEditingId(null);
        setLockedCode(null);
      }
    } else {
      setEditingId(null);
      setLockedCode(null);
      const end = new Date();
      end.setMonth(end.getMonth() + 2);
      setEndsAt(toDatetimeLocalValue(end.toISOString()));
      const start = new Date();
      setStartsAt(toDatetimeLocalValue(start.toISOString()));
    }
    setHydrated(true);
  }, [editId, applyCoupon]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const generatedCode = useMemo(() => {
    const store = loadCouponStore();
    const set = new Set(store.coupons.map((c) => c.code));
    if (editingId) {
      const me = store.coupons.find((c) => c.id === editingId);
      if (me) set.delete(me.code);
    }
    return uniqueCode(slugCodeFromTitle(campaignName || "WELCOME"), set);
  }, [campaignName, editingId]);

  const previewCode = lockedCode ?? generatedCode;

  const previewValueLabel = useMemo(() => {
    const draft: Coupon = {
      id: "preview",
      code: previewCode,
      campaignName: campaignName || "Promotion",
      type: promotionType,
      percentOff: promotionType === "percentage" ? Number(percentOff) || 0 : undefined,
      fixedAmount: promotionType === "fixed_amount" ? Number(fixedAmount) || 0 : undefined,
      freeItemLabel: promotionType === "product_bundle" ? freeItemLabel : undefined,
      expiryDate: new Date().toISOString(),
      status: "draft",
      redemptions: 0,
      revenueFromDiscount: 0,
    };
    return formatCouponValue(draft);
  }, [previewCode, campaignName, promotionType, percentOff, fixedAmount, freeItemLabel]);

  const previewHeadline = useMemo(() => {
    if (promotionType === "percentage") return `${Number(percentOff) || 0}% OFF`;
    if (promotionType === "fixed_amount") return `£${(Number(fixedAmount) || 0).toFixed(0)} OFF`;
    return "FREE ADD-ON";
  }, [promotionType, percentOff, fixedAmount]);

  const removeCategory = (label: string) => {
    setCategories((prev) => prev.filter((c) => c !== label));
  };

  const addCategory = (label: string) => {
    setCategories((prev) => (prev.includes(label) ? prev : [...prev, label]));
    setPickerOpen(false);
  };

  const handlePublish = () => {
    if (!campaignName.trim()) {
      setToast("Add a coupon title before publishing.");
      return;
    }
    const store = loadCouponStore();
    const codes = new Set(store.coupons.map((c) => c.code));
    if (editingId) {
      const me = store.coupons.find((c) => c.id === editingId);
      if (me) codes.delete(me.code);
    }
    const code = editingId
      ? store.coupons.find((c) => c.id === editingId)?.code ?? previewCode
      : uniqueCode(slugCodeFromTitle(campaignName), codes);

    const expiryIso = endsAt ? fromDatetimeLocalValue(endsAt) : new Date().toISOString();
    const startsIso = startsAt ? fromDatetimeLocalValue(startsAt) : undefined;
    const now = Date.now();
    const status = new Date(expiryIso).getTime() < now ? "expired" : "active";

    const next: Coupon = {
      id: editingId ? editingId : newCouponId(),
      code,
      campaignName: campaignName.trim(),
      description: description.trim() || undefined,
      type: promotionType,
      percentOff: promotionType === "percentage" ? Number(percentOff) || 0 : undefined,
      fixedAmount: promotionType === "fixed_amount" ? Number(fixedAmount) || 0 : undefined,
      freeItemLabel:
        promotionType === "product_bundle" ? freeItemLabel.trim() || "Free gift" : undefined,
      startsAt: startsIso,
      expiryDate: expiryIso,
      status,
      redemptions: editingId ? store.coupons.find((c) => c.id === editingId)?.redemptions ?? 0 : 0,
      revenueFromDiscount: editingId
        ? store.coupons.find((c) => c.id === editingId)?.revenueFromDiscount ?? 0
        : 0,
      oncePerUser,
      usageLimit: usageLimit.trim() === "" ? undefined : Number(usageLimit),
      minPurchase: minPurchase.trim() === "" ? undefined : Number(minPurchase),
      allMenu,
      categories: allMenu ? [] : categories,
    };

    const others = store.coupons.filter((c) => c.id !== next.id);
    saveCouponStore({ coupons: [next, ...others], campaigns: store.campaigns });
    router.push("/coupons");
    router.refresh();
  };

  const typeButton = (t: CouponType, icon: string, label: string) => {
    const selected = promotionType === t;
    return (
      <button
        key={t}
        type="button"
        onClick={() => setPromotionType(t)}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-xs font-bold transition-all",
          selected
            ? "bg-primary-container text-on-primary-container ring-2 ring-primary"
            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container",
        )}
      >
        <MaterialIcon name={icon} className="text-2xl" />
        {label}
      </button>
    );
  };

  if (!hydrated) {
    return (
      <PageContainer title="Add coupon & promotion" description="Preparing the editor…">
        <Card className="p-10 text-center text-secondary">Loading…</Card>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer
        title={editId ? "Edit coupon & promotion" : "Add new coupon & promotion"}
        description="Configure your marketing campaign for Namaste Cam."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
              Discard draft
            </Button>
            <Button type="button" size="sm" onClick={handlePublish}>
              Publish promotion
            </Button>
          </div>
        }
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/coupons"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <MaterialIcon name="arrow_back" className="text-lg" />
            Back to coupons
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <MaterialIcon name="edit_note" className="text-primary text-2xl" />
                <h2 className="font-headline text-xl font-bold text-on-surface">Basic details</h2>
              </div>
              <div className="space-y-6">
                <Input
                  label="Coupon title"
                  placeholder="e.g. Welcome discount 2025"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
                <div className="space-y-2">
                  <label htmlFor="coupon-desc" className="ml-1 text-sm font-bold text-on-surface">
                    Internal description
                  </label>
                  <textarea
                    id="coupon-desc"
                    rows={3}
                    placeholder="Brief notes for staff reference…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border-none bg-surface px-4 py-4 text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all placeholder:text-secondary focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <p className="mb-4 ml-1 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    Promotion type
                  </p>
                  <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {typeButton("percentage", "percent", "Percentage")}
                    {typeButton("fixed_amount", "payments", "Fixed amount")}
                    {typeButton("product_bundle", "featured_seasonal_and_gifts", "Free item")}
                  </div>
                  {promotionType === "percentage" ? (
                    <div className="space-y-2">
                      <label htmlFor="pct" className="ml-1 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                        Discount value
                      </label>
                      <div className="relative">
                        <input
                          id="pct"
                          type="number"
                          min={0}
                          max={100}
                          value={percentOff}
                          onChange={(e) => setPercentOff(e.target.value)}
                          className="w-full rounded-xl border-none bg-surface py-4 pl-4 pr-12 text-on-surface outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
                        />
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-secondary">
                          %
                        </span>
                      </div>
                    </div>
                  ) : null}
                  {promotionType === "fixed_amount" ? (
                    <div className="space-y-2">
                      <label htmlFor="amt" className="ml-1 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                        Discount amount
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-secondary">
                          £
                        </span>
                        <input
                          id="amt"
                          type="number"
                          min={0}
                          step="0.01"
                          value={fixedAmount}
                          onChange={(e) => setFixedAmount(e.target.value)}
                          className="w-full rounded-xl border-none bg-surface py-4 pl-10 pr-4 text-on-surface outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  ) : null}
                  {promotionType === "product_bundle" ? (
                    <Input
                      label="Free item label"
                      placeholder="e.g. Mango lassi"
                      value={freeItemLabel}
                      onChange={(e) => setFreeItemLabel(e.target.value)}
                      left={<MaterialIcon name="search" className="text-xl text-secondary" />}
                    />
                  ) : null}
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <MaterialIcon name="event_available" className="text-primary text-2xl" />
                <h2 className="font-headline text-xl font-bold text-on-surface">Validity & limits</h2>
              </div>
              <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="start" className="ml-1 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    Start date/time
                  </label>
                  <input
                    id="start"
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full rounded-xl border-none bg-surface px-4 py-4 text-on-surface outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="end" className="ml-1 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    End date/time
                  </label>
                  <input
                    id="end"
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full rounded-xl border-none bg-surface px-4 py-4 text-on-surface outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-container-low p-4 ring-1 ring-outline-variant/10">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Once per user</p>
                    <p className="text-xs text-secondary">Limit customers to a single use of this coupon</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={oncePerUser}
                      onChange={(e) => setOncePerUser(e.target.checked)}
                    />
                    <span className="relative h-6 w-11 rounded-full bg-surface-container-high after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-surface-container-lowest after:shadow-sm after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="Usage limit"
                    type="number"
                    min={0}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label htmlFor="minp" className="ml-1 text-sm font-bold text-on-surface">
                      Minimum purchase amount
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary">£</span>
                      <input
                        id="minp"
                        type="number"
                        min={0}
                        step="0.01"
                        value={minPurchase}
                        onChange={(e) => setMinPurchase(e.target.value)}
                        className="w-full rounded-xl border-none bg-surface py-4 pl-10 pr-4 text-on-surface outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <MaterialIcon name="target" className="text-primary text-2xl" />
                <h2 className="font-headline text-xl font-bold text-on-surface">Targeting</h2>
              </div>
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-outline-variant/15 pb-4">
                <div>
                  <p className="text-sm font-bold text-on-surface">All menu items</p>
                  <p className="text-xs text-secondary">Apply this discount across the entire menu</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={allMenu}
                    onChange={(e) => {
                      setAllMenu(e.target.checked);
                      if (e.target.checked) setCategories([]);
                    }}
                  />
                  <span className="relative h-6 w-11 rounded-full bg-surface-container-high after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-surface-container-lowest after:shadow-sm after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                </label>
              </div>
              {!allMenu ? (
                <div>
                  <p className="mb-4 ml-1 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                    Specific categories / items
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-xs font-bold text-on-primary-container"
                      >
                        {cat}
                        <button
                          type="button"
                          className="rounded-full p-0.5 hover:bg-on-primary-container/10"
                          onClick={() => removeCategory(cat)}
                          aria-label={`Remove ${cat}`}
                        >
                          <MaterialIcon name="close" className="text-base" />
                        </button>
                      </span>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
                      <MaterialIcon name="add" className="text-base" />
                      Add category
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <MaterialIcon name="image" className="text-primary text-2xl" />
                <h2 className="font-headline text-xl font-bold text-on-surface">Creative</h2>
              </div>
              <button
                type="button"
                className="w-full rounded-xl border-2 border-dashed border-outline-variant/40 p-6 text-center transition-colors hover:border-primary/40"
              >
                <div className="mb-4 flex aspect-video items-center justify-center rounded-xl bg-surface-container-high">
                  <MaterialIcon name="upload_file" className="text-4xl text-secondary" />
                </div>
                <p className="text-sm font-bold text-on-surface">Change promotion image</p>
                <p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                  Recommended size: 1200×675px
                </p>
              </button>
            </Card>

            <Card className="p-8">
              <p className="mb-6 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                Customer preview
              </p>
              <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-md ring-1 ring-outline-variant/15">
                <div className="flex h-32 flex-col items-center justify-center bg-primary p-4 text-center text-on-primary">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em]">Limited time</p>
                  <p className="mt-1 font-headline text-2xl font-extrabold tracking-tight">{previewHeadline}</p>
                  <p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest opacity-90">
                    {campaignName || "Your campaign"}
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-4">
                  <p className="text-sm font-bold text-on-surface">
                    {minPurchase.trim()
                      ? `Valid on orders over £${Number(minPurchase).toFixed(0)}`
                      : "Valid on eligible orders"}
                  </p>
                  <div className="mt-3 flex items-center justify-between rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low p-2">
                    <span className="font-mono text-xs font-bold text-on-surface">{previewCode}</span>
                    <button
                      type="button"
                      className="text-[10px] font-extrabold uppercase tracking-widest text-primary"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(previewCode);
                          setToast("Code copied");
                        } catch {
                          setToast("Could not copy");
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-secondary">Value: {previewValueLabel}</p>
                  {endsAt ? (
                    <p className="mt-1 text-xs text-secondary">Ends {formatDisplayDate(fromDatetimeLocalValue(endsAt))}</p>
                  ) : null}
                </div>
              </div>
            </Card>

            <div className="rounded-xl border border-primary/15 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <MaterialIcon name="info" className="mt-0.5 text-primary text-xl" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Did you know?</p>
                  <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                    Promotions with images see higher engagement on the customer app. Upload a hero image when you are ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Add category"
        description="Pick a menu grouping to target with this promotion."
      >
        <ul className="max-h-64 space-y-2 overflow-y-auto">
          {CATEGORY_PRESETS.filter((c) => !categories.includes(c)).map((c) => (
            <li key={c}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl bg-surface-container-low px-4 py-3 text-left text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
                onClick={() => addCategory(c)}
              >
                {c}
                <MaterialIcon name="add" className="text-secondary" />
              </button>
            </li>
          ))}
        </ul>
        {CATEGORY_PRESETS.every((c) => categories.includes(c)) ? (
          <p className="mt-4 text-sm text-secondary">All preset categories are already added.</p>
        ) : null}
      </Modal>

      {toast ? (
        <div
          className="fixed bottom-8 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-3 rounded-full bg-inverse-surface px-6 py-4 text-inverse-on-surface shadow-2xl"
          role="status"
        >
          <MaterialIcon name="check_circle" className="text-green-400 text-xl" />
          <p className="text-sm font-bold">{toast}</p>
        </div>
      ) : null}
    </>
  );
}
