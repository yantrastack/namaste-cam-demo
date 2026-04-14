"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";

const SETTINGS_CONFIG = {
  general: {
    id: "general",
    label: "General Settings",
    icon: "settings",
    fields: [
      {
        key: "maintenanceMode",
        label: "Maintenance Mode",
        type: "toggle",
        defaultValue: false,
        description: "Disable customer app ordering",
      },
    ],
  },
  banners: {
    id: "banners",
    label: "Home Screen Banners",
    navLabel: "Banners",
    icon: "image",
    fields: [
      {
        key: "title",
        label: "BANNER TITLE",
        type: "text",
        validation: { required: true, maxLength: 100 },
      },
      {
        key: "sortOrder",
        label: "SORT ORDER",
        type: "number",
        validation: { required: true, min: 1 },
      },
      {
        key: "active",
        label: "Active",
        type: "toggle",
        description: "Show this banner in the customer app",
      },
      {
        key: "imageUrl",
        label: "Banner Image",
        type: "file",
        accept: "image/*",
        aspectRatio: "16:9",
      },
    ],
  },
  /** Temporary home until a dedicated inventory route exists. */
  wastage: {
    id: "wastage",
    label: "Daily wastage",
    navLabel: "Wastage",
    icon: "calculate",
    fields: [],
  },
} as const;

const BANNER_SCREEN_PLACEMENTS = [
  { value: "home", label: "Home screen" },
  { value: "checkout", label: "Checkout screen" },
  { value: "payment_menu", label: "Payment menu" },
  { value: "cart", label: "Cart" },
  { value: "menu", label: "Menu browsing" },
  { value: "order_status", label: "Order status" },
] as const;

type SectionId = keyof typeof SETTINGS_CONFIG;

type FieldValidation = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
};

type CollectionDiscountType = "percent" | "fixed";

type PricingSaveScope = "collection" | "deliveryFee";

type WastageLine = { id: string; name: string; qty: string; unitCostGbp: string };

const PRICING_DEFAULTS = {
  collectionDiscountType: "percent" as CollectionDiscountType,
  collectionDiscountValue: "10",
  collectionDiscountMaxGbp: "100",
  globalDeliveryFee: "3.50",
} as const;

function validateCollectionDiscount(data: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  const type = (data.collectionDiscountType as CollectionDiscountType | undefined) ?? "percent";
  const raw = String(data.collectionDiscountValue ?? "").trim();
  const maxRaw = String(data.collectionDiscountMaxGbp ?? "").trim();

  if (!raw) {
    out.collectionDiscountValue = "Discount value is required";
  } else {
    const n = Number(raw);
    if (Number.isNaN(n)) {
      out.collectionDiscountValue = "Enter a valid number";
    } else if (type === "percent") {
      if (n < 0 || n > 100) {
        out.collectionDiscountValue = "Percentage must be between 0 and 100";
      }
    } else if (n < 0) {
      out.collectionDiscountValue = "Amount must be 0 or greater";
    }
  }

  if (maxRaw !== "") {
    const maxN = Number(maxRaw);
    if (Number.isNaN(maxN) || maxN < 0) {
      out.collectionDiscountMaxGbp = "Enter a valid max cap (£)";
    }
  }

  return out;
}

function validateGlobalDeliveryFee(data: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = String(data.globalDeliveryFee ?? "").trim();
  if (!raw) {
    out.globalDeliveryFee = "Global delivery fee is required";
    return out;
  }
  const n = Number(raw);
  if (Number.isNaN(n) || n < 0 || n > 500) {
    out.globalDeliveryFee = "Enter a fee between 0 and 500 (£)";
  }
  return out;
}

function MicroLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  const className =
    "ml-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant";
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={className}>
        {children}
      </label>
    );
  }
  return <p className={className}>{children}</p>;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("general");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const [settingsData, setSettingsData] = useState<Record<string, unknown>>({});
  const [banners, setBanners] = useState<
    {
      id: string;
      title: string;
      imageUrl: string;
      sortOrder: string;
      active: boolean;
      screenPlacement: (typeof BANNER_SCREEN_PLACEMENTS)[number]["value"];
    }[]
  >([]);
  const [wastageDate, setWastageDate] = useState("");
  const [wastageLines, setWastageLines] = useState<WastageLine[]>([]);
  const [editingCollectionDiscount, setEditingCollectionDiscount] = useState(false);
  const [editingGlobalDeliveryFee, setEditingGlobalDeliveryFee] = useState(false);
  const collectionDiscountSnapshotRef = useRef<{
    collectionDiscountType: unknown;
    collectionDiscountValue: unknown;
    collectionDiscountMaxGbp: unknown;
  } | null>(null);
  const globalDeliveryFeeSnapshotRef = useRef<string | null>(null);

  const generalCardRef = useRef<HTMLDivElement>(null);
  const bannersCardRef = useRef<HTMLDivElement>(null);
  const wastageCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialData: Record<string, unknown> = {};
    Object.values(SETTINGS_CONFIG).forEach((section) => {
      section.fields.forEach((field) => {
        if ("defaultValue" in field && field.defaultValue !== undefined) {
          initialData[field.key] = field.defaultValue;
        }
      });
    });
    Object.assign(initialData, { ...PRICING_DEFAULTS });
    setSettingsData(initialData);

    setWastageDate(new Date().toISOString().slice(0, 10));
    setWastageLines([
      { id: "w1", name: "Marinara sauce (prep)", qty: "0.8", unitCostGbp: "4.50" },
      { id: "w2", name: "Mixed salad leaves", qty: "1.2", unitCostGbp: "2.10" },
    ]);

    setBanners([
      {
        id: "1",
        title: "Authentic Italian Pizzas",
        imageUrl:
          "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=200&fit=crop&crop=center",
        sortOrder: "1",
        active: true,
        screenPlacement: "home",
      },
      {
        id: "2",
        title: "Summer Salad Fest",
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop&crop=center",
        sortOrder: "2",
        active: true,
        screenPlacement: "checkout",
      },
    ]);
  }, []);

  const currentSectionConfig = SETTINGS_CONFIG[activeSection];
  const settingsSections = Object.values(SETTINGS_CONFIG);

  const scrollToSection = useCallback((id: SectionId) => {
    const map: Record<SectionId, React.RefObject<HTMLDivElement | null>> = {
      general: generalCardRef,
      banners: bannersCardRef,
      wastage: wastageCardRef,
    };
    requestAnimationFrame(() => {
      map[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const selectSection = useCallback(
    (id: SectionId) => {
      setActiveSection(id);
      scrollToSection(id);
    },
    [scrollToSection],
  );

  const validateField = useCallback((label: string, validation: FieldValidation | undefined, value: unknown): string | null => {
    if (!validation) return null;
    const { required, minLength, maxLength, min, max, pattern } = validation;

    if (required && (value === undefined || value === null || (typeof value === "string" && value.trim() === ""))) {
      return `${label} is required`;
    }

    if (typeof value === "string") {
      if (minLength && value.length < minLength) {
        return `${label} must be at least ${minLength} characters`;
      }
      if (maxLength && value.length > maxLength) {
        return `${label} must not exceed ${maxLength} characters`;
      }
    }

    if (min !== undefined && value !== "" && Number(value) < min) {
      return `${label} must be at least ${min}`;
    }
    if (max !== undefined && value !== "" && Number(value) > max) {
      return `${label} must not exceed ${max}`;
    }

    if (pattern && typeof value === "string" && !pattern.test(value)) {
      return `${label} format is invalid`;
    }

    return null;
  }, []);

  const handleFieldChange = useCallback(
    (key: string, value: unknown, section?: string) => {
      if (section === "banners") {
        const patch = value as Record<string, unknown>;
        setBanners((prev) => prev.map((banner) => (banner.id === key ? { ...banner, ...patch } : banner)));
      } else {
        setSettingsData((prev) => ({ ...prev, [key]: value }));
        const field = SETTINGS_CONFIG.general.fields.find((f) => f.key === key);
        if (field && "validation" in field && field.validation) {
          const error = validateField(field.label, field.validation as FieldValidation, value);
          setErrors((prev) => {
            const next = { ...prev };
            if (error) next[key] = error;
            else delete next[key];
            return next;
          });
        }
      }
    },
    [validateField],
  );

  const saveGeneralSection = useCallback(
    async (scope: PricingSaveScope) => {
      const scopedErrors =
        scope === "collection"
          ? validateCollectionDiscount(settingsData)
          : validateGlobalDeliveryFee(settingsData);

      if (Object.keys(scopedErrors).length > 0) {
        setErrors((prev) => {
          const next = { ...prev };
          if (scope === "collection") {
            delete next.collectionDiscountValue;
            delete next.collectionDiscountMaxGbp;
          } else {
            delete next.globalDeliveryFee;
          }
          return { ...next, ...scopedErrors };
        });
        return false;
      }

      setErrors((prev) => {
        const next = { ...prev };
        if (scope === "collection") {
          delete next.collectionDiscountValue;
          delete next.collectionDiscountMaxGbp;
        } else {
          delete next.globalDeliveryFee;
        }
        return next;
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

      setSuccessMessage(
        scope === "collection" ? "Collection discount saved." : "Global delivery fee saved.",
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      return true;
    },
    [settingsData],
  );

  const handleSaveChanges = useCallback(async () => {
    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const newErrors: Record<string, string> = {};

      if (activeSection === "banners") {
        banners.forEach((banner, index) => {
          SETTINGS_CONFIG.banners.fields.forEach((field) => {
            if (field.key === "imageUrl" || field.key === "active") return;
            const value = banner[field.key as keyof typeof banner];
            const err =
              "validation" in field && field.validation
                ? validateField(field.label, field.validation as FieldValidation, value)
                : null;
            if (err) newErrors[`banner_${index}_${field.key}`] = err;
          });
        });
      }

      if (activeSection === "wastage") {
        wastageLines.forEach((line, index) => {
          const hasAny = line.name.trim() !== "" || line.qty.trim() !== "" || line.unitCostGbp.trim() !== "";
          if (hasAny && !line.name.trim()) {
            newErrors[`wastage_${index}_name`] = "Item name is required";
          }
        });
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage(`${currentSectionConfig.label} saved successfully.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrors({ general: "Failed to save changes. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }, [activeSection, currentSectionConfig.label, banners, wastageLines, validateField]);

  const handleSavePricing = useCallback(
    async (scope: "collection" | "deliveryFee") => {
      setIsLoading(true);
      setSuccessMessage("");
      try {
        const ok = await saveGeneralSection(scope);
        if (ok) {
          if (scope === "collection") {
            collectionDiscountSnapshotRef.current = null;
            setEditingCollectionDiscount(false);
          } else {
            globalDeliveryFeeSnapshotRef.current = null;
            setEditingGlobalDeliveryFee(false);
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [saveGeneralSection],
  );

  const beginEditCollectionDiscount = useCallback(() => {
    collectionDiscountSnapshotRef.current = {
      collectionDiscountType: settingsData.collectionDiscountType,
      collectionDiscountValue: settingsData.collectionDiscountValue,
      collectionDiscountMaxGbp: settingsData.collectionDiscountMaxGbp,
    };
    setEditingCollectionDiscount(true);
  }, [settingsData]);

  const cancelEditCollectionDiscount = useCallback(() => {
    const snap = collectionDiscountSnapshotRef.current;
    if (snap) {
      setSettingsData((prev) => ({
        ...prev,
        collectionDiscountType: snap.collectionDiscountType,
        collectionDiscountValue: snap.collectionDiscountValue,
        collectionDiscountMaxGbp: snap.collectionDiscountMaxGbp,
      }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.collectionDiscountValue;
        delete next.collectionDiscountMaxGbp;
        return next;
      });
    }
    collectionDiscountSnapshotRef.current = null;
    setEditingCollectionDiscount(false);
  }, []);

  const beginEditGlobalDeliveryFee = useCallback(() => {
    globalDeliveryFeeSnapshotRef.current = String(settingsData.globalDeliveryFee ?? "");
    setEditingGlobalDeliveryFee(true);
  }, [settingsData]);

  const cancelEditGlobalDeliveryFee = useCallback(() => {
    const snap = globalDeliveryFeeSnapshotRef.current;
    if (snap !== null) {
      setSettingsData((prev) => ({ ...prev, globalDeliveryFee: snap }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.globalDeliveryFee;
        return next;
      });
    }
    globalDeliveryFeeSnapshotRef.current = null;
    setEditingGlobalDeliveryFee(false);
  }, []);

  const handleAddBanner = useCallback(() => {
    const id = `${Date.now()}`;
    setBanners((prev) => {
      const bumped = prev.map((b) => {
        const n = Number.parseInt(String(b.sortOrder), 10);
        return {
          ...b,
          sortOrder: Number.isFinite(n) ? String(n + 1) : b.sortOrder,
        };
      });
      const newBanner = {
        id,
        title: "",
        imageUrl: "",
        sortOrder: "1",
        active: true,
        screenPlacement: "home" as const,
      };
      return [newBanner, ...bumped];
    });
    window.setTimeout(() => {
      document.getElementById(`banner-row-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, []);

  const handleDeleteBanner = useCallback((id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleBannerChange = useCallback(
    (id: string, field: string, value: unknown) => {
      handleFieldChange(id, { [field]: value }, "banners");
    },
    [handleFieldChange],
  );

  const handleBannerImageFile = useCallback(
    (bannerId: string, file: File | undefined) => {
      if (!file) return;
      const url = URL.createObjectURL(file);
      handleBannerChange(bannerId, "imageUrl", url);
    },
    [handleBannerChange],
  );

  const maintenanceField = SETTINGS_CONFIG.general.fields.find((f) => f.key === "maintenanceMode")!;
  const collectionDiscountType =
    (settingsData.collectionDiscountType as CollectionDiscountType | undefined) ?? PRICING_DEFAULTS.collectionDiscountType;
  const collectionDiscountValueDisplay = String(settingsData.collectionDiscountValue ?? "").trim();
  const collectionDiscountMaxDisplay = String(settingsData.collectionDiscountMaxGbp ?? "").trim();
  const globalDeliveryFeeDisplay = String(settingsData.globalDeliveryFee ?? "").trim();

  const wastageTotals = useMemo(() => {
    let qty = 0;
    let valueGbp = 0;
    for (const row of wastageLines) {
      const q = Number.parseFloat(row.qty);
      const c = Number.parseFloat(row.unitCostGbp);
      if (Number.isFinite(q)) qty += q;
      if (Number.isFinite(q) && Number.isFinite(c)) valueGbp += q * c;
    }
    return { qty, valueGbp };
  }, [wastageLines]);

  const handleWastageLineChange = useCallback((id: string, patch: Partial<WastageLine>) => {
    setWastageLines((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }, []);

  const handleAddWastageLine = useCallback(() => {
    setWastageLines((prev) => [
      ...prev,
      { id: `w-${Date.now()}`, name: "", qty: "", unitCostGbp: "" },
    ]);
  }, []);

  const handleRemoveWastageLine = useCallback((id: string) => {
    setWastageLines((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const renderBannersBlock = (opts: { showSaveInHeader?: boolean }) => (
    <div ref={bannersCardRef}>
      <Card className="overflow-hidden p-6 shadow-md ring-outline-variant/10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MaterialIcon name="image" className="!text-xl" />
          </div>
          <div>
            <h2 className="font-headline text-lg font-extrabold tracking-tight text-on-surface">
              {SETTINGS_CONFIG.banners.label}
            </h2>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">
              Manage promotional carousels visible to app users.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {opts.showSaveInHeader ? (
            <Button type="button" size="sm" disabled={isLoading} onClick={() => void handleSaveChanges()}>
              {isLoading ? "Saving…" : "Save"}
            </Button>
          ) : null}
          <Button type="button" variant="outline" size="sm" onClick={handleAddBanner}>
            <MaterialIcon name="add" className="!text-lg" />
            Create new
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {banners.map((banner, index) => (
          <Card
            id={`banner-row-${banner.id}`}
            key={banner.id}
            className="p-4 shadow-sm ring-outline-variant/10 sm:p-5"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div className="flex shrink-0 justify-center lg:w-[140px] lg:justify-start">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    id={`banner-img-${banner.id}`}
                    onChange={(e) => handleBannerImageFile(banner.id, e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById(`banner-img-${banner.id}`)?.click()}
                    className={cn(
                      "relative aspect-[5/4] w-full max-w-[200px] overflow-hidden rounded-[1.75rem] bg-surface ring-1 ring-outline-variant/20 lg:h-[120px] lg:w-[120px] lg:max-w-none",
                    )}
                  >
                    {banner.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={banner.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center">
                        <MaterialIcon name="image" className="text-on-surface-variant/50 !text-3xl" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Banner
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                <div className="min-w-0 flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <MicroLabel htmlFor={`title-${banner.id}`}>Banner title</MicroLabel>
                      <Input
                        id={`title-${banner.id}`}
                        value={banner.title}
                        onChange={(e) => handleBannerChange(banner.id, "title", e.target.value)}
                        error={errors[`banner_${index}_title`]}
                        className="bg-surface-container-low"
                      />
                    </div>
                    <div className="space-y-2">
                      <MicroLabel htmlFor={`sort-${banner.id}`}>Sort order</MicroLabel>
                      <Input
                        id={`sort-${banner.id}`}
                        type="number"
                        value={banner.sortOrder}
                        onChange={(e) => handleBannerChange(banner.id, "sortOrder", e.target.value)}
                        error={errors[`banner_${index}_sortOrder`]}
                        className="bg-surface-container-low"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                      <SelectField
                        id={`placement-${banner.id}`}
                        label="App screen"
                        value={banner.screenPlacement}
                        onChange={(e) =>
                          handleBannerChange(banner.id, "screenPlacement", e.target.value)
                        }
                        className="bg-surface-container-low"
                      >
                        {BANNER_SCREEN_PLACEMENTS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </SelectField>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-outline-variant/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={banner.active}
                    onCheckedChange={(checked) => handleBannerChange(banner.id, "active", checked)}
                    className="shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-on-surface">Active</p>
                    <p className="text-xs text-on-surface-variant">Visible in app</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 self-start text-error hover:bg-error/10 sm:self-auto"
                  onClick={() => handleDeleteBanner(banner.id)}
                >
                  <MaterialIcon name="delete" className="!text-lg" />
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {banners.length === 0 ? (
          <div className="rounded-xl bg-surface py-12 text-center ring-1 ring-outline-variant/15">
            <MaterialIcon name="image" className="mx-auto mb-3 text-on-surface-variant/30 !text-4xl" />
            <p className="font-medium text-on-surface-variant">No banners yet</p>
            <p className="mt-1 text-sm text-on-surface-variant/80">
              Upload a banner and choose which app screen it appears on.
            </p>
          </div>
        ) : null}
      </div>
    </Card>
    </div>
  );

  const renderWastageBlock = (opts: { showSaveInHeader?: boolean }) => (
    <div ref={wastageCardRef}>
      <Card className="overflow-hidden p-6 shadow-md ring-outline-variant/10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MaterialIcon name="calculate" className="!text-xl" />
            </div>
            <div>
              <h2 className="font-headline text-lg font-extrabold tracking-tight text-on-surface">
                {SETTINGS_CONFIG.wastage.label}
              </h2>
              <p className="mt-1 text-sm font-medium text-on-surface-variant">
                Record spoilage and prep loss by day. Totals update as you type. This screen is a placeholder until a
                dedicated inventory module ships.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {opts.showSaveInHeader ? (
              <Button type="button" size="sm" disabled={isLoading} onClick={() => void handleSaveChanges()}>
                {isLoading ? "Saving…" : "Save"}
              </Button>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={handleAddWastageLine}>
              <MaterialIcon name="add" className="!text-lg" />
              Add line
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="max-w-xs space-y-2">
            <MicroLabel htmlFor="wastage-date">Date</MicroLabel>
            <Input
              id="wastage-date"
              type="date"
              value={wastageDate}
              onChange={(e) => setWastageDate(e.target.value)}
              className="bg-surface-container-low"
            />
          </div>

          <div className="overflow-x-auto rounded-xl ring-1 ring-outline-variant/15">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low/80">
                  <th className="px-4 py-3 font-extrabold text-on-surface-variant">Item</th>
                  <th className="px-4 py-3 font-extrabold text-on-surface-variant">Qty lost</th>
                  <th className="px-4 py-3 font-extrabold text-on-surface-variant">Unit cost (£)</th>
                  <th className="w-14 px-2 py-3" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {wastageLines.map((line, index) => (
                  <tr key={line.id} className="border-b border-outline-variant/10 last:border-0">
                    <td className="p-3 align-middle">
                      <Input
                        id={`wastage-name-${line.id}`}
                        value={line.name}
                        onChange={(e) => handleWastageLineChange(line.id, { name: e.target.value })}
                        error={errors[`wastage_${index}_name`]}
                        placeholder="Ingredient or SKU"
                        className="bg-surface-container-low"
                      />
                    </td>
                    <td className="p-3 align-middle">
                      <Input
                        id={`wastage-qty-${line.id}`}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        value={line.qty}
                        onChange={(e) => handleWastageLineChange(line.id, { qty: e.target.value })}
                        className="bg-surface-container-low"
                      />
                    </td>
                    <td className="p-3 align-middle">
                      <Input
                        id={`wastage-cost-${line.id}`}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        value={line.unitCostGbp}
                        onChange={(e) => handleWastageLineChange(line.id, { unitCostGbp: e.target.value })}
                        className="bg-surface-container-low"
                      />
                    </td>
                    <td className="p-2 align-middle">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        aria-label="Remove line"
                        onClick={() => handleRemoveWastageLine(line.id)}
                      >
                        <MaterialIcon name="close" className="!text-xl" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {wastageLines.length === 0 ? (
            <p className="text-sm font-medium text-on-surface-variant">No lines yet. Add a row to log wastage.</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4 ring-outline-variant/10">
              <MicroLabel>Total quantity lost</MicroLabel>
              <p className="mt-2 font-headline text-xl font-extrabold tracking-tight text-on-surface">
                {wastageTotals.qty.toFixed(2)}
              </p>
            </Card>
            <Card className="p-4 ring-outline-variant/10">
              <MicroLabel>Estimated value (£)</MicroLabel>
              <p className="mt-2 font-headline text-xl font-extrabold tracking-tight text-on-surface">
                £{wastageTotals.valueGbp.toFixed(2)}
              </p>
              <p className="mt-1 text-xs font-medium text-on-surface-variant">Qty × unit cost per line, summed.</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <PageContainer
      title="Platform Configuration"
      description="Manage your platform settings and preferences."
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 space-y-6 lg:sticky lg:top-0 lg:self-start lg:w-56">
          <nav className="space-y-0.5" aria-label="Settings sections">
            {settingsSections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => selectSection(section.id as SectionId)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-r-xl py-3 pl-3 pr-2 text-left transition-colors",
                    isActive
                      ? "border-l-4 border-primary bg-primary/5 font-extrabold text-on-surface"
                      : "border-l-4 border-transparent font-medium text-on-surface-variant hover:bg-surface-container-low",
                  )}
                >
                  <MaterialIcon
                    name="chevron_right"
                    className={cn("shrink-0 !text-lg", isActive ? "text-primary" : "text-on-surface-variant/70")}
                  />
                  <span className="text-sm">
                    {"navLabel" in section && section.navLabel ? section.navLabel : section.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <Card className="space-y-2 bg-primary-fixed-dim/25 p-4 shadow-sm ring-primary/15">
            <div className="flex items-center gap-2 text-primary">
              <MaterialIcon name="shield" className="!text-xl" />
              <h3 className="font-headline text-sm font-extrabold text-on-surface">System Security</h3>
            </div>
            <p className="text-xs font-medium leading-relaxed text-on-surface-variant">
              Last configuration backup was performed 4 hours ago. All systems nominal.
            </p>
          </Card>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          {successMessage ? (
            <Card className="flex items-center gap-3 border-none bg-surface-container-low p-4 ring-green-500/20">
              <MaterialIcon name="check_circle" className="text-green-600 !text-xl" />
              <p className="text-sm font-medium text-on-surface">{successMessage}</p>
            </Card>
          ) : null}

          {errors.general ? (
            <Card className="flex items-center gap-3 border-none bg-error-container/40 p-4 ring-error/20">
              <MaterialIcon name="error" className="text-error !text-xl" />
              <p className="text-sm font-medium text-on-error-container">{errors.general}</p>
            </Card>
          ) : null}

          {(activeSection === "general" || activeSection === "banners") && (
            <>
              {activeSection === "general" ? (
                <div ref={generalCardRef}>
                  <Card className="p-6 shadow-md ring-outline-variant/10">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MaterialIcon name="info" className="!text-xl" />
                    </div>
                    <h2 className="font-headline text-lg font-extrabold tracking-tight text-on-surface">
                      {SETTINGS_CONFIG.general.label}
                    </h2>
                  </div>

                  <div className="space-y-6">
                      <div className="space-y-4 rounded-xl bg-surface-container-low p-5 ring-1 ring-outline-variant/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <MicroLabel>Collection discount (pickup)</MicroLabel>
                            <p className="mt-1 text-xs font-medium text-on-surface-variant">
                              Discount when customers choose collection instead of delivery. Set a percentage or a fixed
                              amount in pounds, with an optional maximum cap in pounds.
                            </p>
                          </div>
                          {editingCollectionDiscount ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface"
                              aria-label="Cancel editing collection discount"
                              onClick={cancelEditCollectionDiscount}
                            >
                              <MaterialIcon name="close" className="!text-xl" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-primary hover:bg-primary/10"
                              aria-label="Edit collection discount"
                              onClick={beginEditCollectionDiscount}
                            >
                              <MaterialIcon name="edit" className="!text-xl" />
                            </Button>
                          )}
                        </div>

                        {!editingCollectionDiscount ? (
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/15">
                              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">
                                {collectionDiscountType === "percent" ? "Discount (%)" : "Discount (£)"}
                              </p>
                              <p className="mt-2 font-headline text-lg font-extrabold tracking-tight text-on-surface">
                                {collectionDiscountType === "percent"
                                  ? collectionDiscountValueDisplay
                                    ? `${collectionDiscountValueDisplay}%`
                                    : "—"
                                  : collectionDiscountValueDisplay
                                    ? `£${collectionDiscountValueDisplay}`
                                    : "—"}
                              </p>
                            </div>
                            <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/15">
                              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">
                                Max discount cap (£)
                              </p>
                              <p className="mt-2 font-headline text-lg font-extrabold tracking-tight text-on-surface">
                                {collectionDiscountMaxDisplay ? `£${collectionDiscountMaxDisplay}` : "None"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-wrap gap-2" role="group" aria-label="Discount type">
                              <Button
                                type="button"
                                size="sm"
                                variant={collectionDiscountType === "percent" ? "primary" : "outline"}
                                onClick={() => handleFieldChange("collectionDiscountType", "percent")}
                              >
                                Percent (%)
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant={collectionDiscountType === "fixed" ? "primary" : "outline"}
                                onClick={() => handleFieldChange("collectionDiscountType", "fixed")}
                              >
                                Fixed (£)
                              </Button>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <MicroLabel htmlFor="collectionDiscountValue">
                                  {collectionDiscountType === "percent" ? "Discount (%)" : "Discount (£)"}
                                </MicroLabel>
                                <Input
                                  id="collectionDiscountValue"
                                  type="number"
                                  value={String(settingsData.collectionDiscountValue ?? "")}
                                  onChange={(e) => handleFieldChange("collectionDiscountValue", e.target.value)}
                                  error={errors.collectionDiscountValue}
                                  className="bg-surface"
                                  min={0}
                                  max={collectionDiscountType === "percent" ? 100 : undefined}
                                  step={collectionDiscountType === "percent" ? "0.1" : "0.01"}
                                />
                              </div>
                              <div className="space-y-2">
                                <MicroLabel htmlFor="collectionDiscountMaxGbp">Max discount cap (£)</MicroLabel>
                                <Input
                                  id="collectionDiscountMaxGbp"
                                  type="number"
                                  value={String(settingsData.collectionDiscountMaxGbp ?? "")}
                                  onChange={(e) => handleFieldChange("collectionDiscountMaxGbp", e.target.value)}
                                  error={errors.collectionDiscountMaxGbp}
                                  className="bg-surface"
                                  min={0}
                                  step="0.01"
                                  placeholder="Optional"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end pt-1">
                              <Button
                                type="button"
                                size="sm"
                                disabled={isLoading}
                                onClick={() => void handleSavePricing("collection")}
                              >
                                {isLoading ? "Saving…" : "Save"}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-4 rounded-xl bg-surface-container-low p-5 ring-1 ring-outline-variant/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <MicroLabel>Global delivery fee (£)</MicroLabel>
                            <p className="mt-1 text-xs font-medium text-on-surface-variant">
                              Default delivery charge applied unless a zone overrides it.
                            </p>
                          </div>
                          {editingGlobalDeliveryFee ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface"
                              aria-label="Cancel editing global delivery fee"
                              onClick={cancelEditGlobalDeliveryFee}
                            >
                              <MaterialIcon name="close" className="!text-xl" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-primary hover:bg-primary/10"
                              aria-label="Edit global delivery fee"
                              onClick={beginEditGlobalDeliveryFee}
                            >
                              <MaterialIcon name="edit" className="!text-xl" />
                            </Button>
                          )}
                        </div>

                        {!editingGlobalDeliveryFee ? (
                          <div className="rounded-xl bg-surface p-4 ring-1 ring-outline-variant/15">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">
                              Current fee
                            </p>
                            <p className="mt-2 font-headline text-lg font-extrabold tracking-tight text-on-surface">
                              {globalDeliveryFeeDisplay ? `£${globalDeliveryFeeDisplay}` : "—"}
                            </p>
                          </div>
                        ) : (
                          <>
                            <Input
                              id="globalDeliveryFee"
                              type="number"
                              value={String(settingsData.globalDeliveryFee ?? "")}
                              onChange={(e) => handleFieldChange("globalDeliveryFee", e.target.value)}
                              error={errors.globalDeliveryFee}
                              className="bg-surface sm:max-w-xs"
                              min={0}
                              max={500}
                              step="0.01"
                            />
                            <div className="flex justify-end pt-1">
                              <Button
                                type="button"
                                size="sm"
                                disabled={isLoading}
                                onClick={() => void handleSavePricing("deliveryFee")}
                              >
                                {isLoading ? "Saving…" : "Save"}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-4 border-t border-outline-variant/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-sm font-extrabold text-on-surface">{maintenanceField.label}</h3>
                          <p className="mt-1 text-xs font-medium text-on-surface-variant">{maintenanceField.description}</p>
                        </div>
                        <Switch
                          checked={Boolean(settingsData.maintenanceMode)}
                          onCheckedChange={(checked) => handleFieldChange("maintenanceMode", checked)}
                          className="shrink-0"
                        />
                      </div>
                  </div>
                </Card>
                </div>
              ) : null}

              {activeSection === "general" ? renderBannersBlock({ showSaveInHeader: false }) : null}
              {activeSection === "banners" ? renderBannersBlock({ showSaveInHeader: true }) : null}
            </>
          )}

          {activeSection === "wastage" ? renderWastageBlock({ showSaveInHeader: true }) : null}
        </div>
      </div>
    </PageContainer>
  );
}
