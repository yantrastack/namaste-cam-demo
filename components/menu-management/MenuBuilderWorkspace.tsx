"use client";

import { useId, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";
import { FoodCatalogPanel } from "./FoodCatalogPanel";
import { SelectedItemsPanel } from "./SelectedItemsPanel";
import {
  createEmptyDayMap,
  type FoodItem,
  foodById,
  formatAvailabilityNormal,
  formatAvailabilitySpecial,
  menuSaveSelectedLine,
  patchSelectedLineSlotAvailability,
  type MealCategory,
  type MenuKind,
  type MenuRow,
  type SpecialMenuSocialShare,
  type SelectedLine,
  type SelectedLineSlotAvailability,
  WEEKDAY_KEYS,
} from "./model";

type Step = "kind" | "form";

export type MenuBuilderWorkspaceProps = {
  menuToEdit: MenuRow | null;
  foodItems: FoodItem[];
  onSave: (row: MenuRow) => void;
  onClose: () => void;
  /** When creating (no `menuToEdit`), jump straight into this menu type’s form. */
  launchWithKind?: MenuKind | null;
};

type BuilderState = {
  step: Step;
  kind: MenuKind | null;
  editId: string | null;
  name: string;
  mealCategory: MealCategory;
  days: string[];
  normalLines: SelectedLine[];
  description: string;
  imagePreview: string | null;
  startDate: string;
  endDate: string;
  specialLines: SelectedLine[];
  /** Special menus only — surfaced in the builder when `kind === "special"`. */
  socialShare: SpecialMenuSocialShare;
  daysCount: 7 | 15 | 30;
  expiryDate: string;
  price: string;
  discount: string;
  bannerText: string;
  activeDay: number;
  itemsByDay: Record<number, SelectedLine[]>;
  /** While editing a normal menu, foodIds added from the catalog this session (not on load). */
  normalSessionAddedFoodIds: number[];
};

const DEFAULT_SPECIAL_SOCIAL_SHARE: SpecialMenuSocialShare = {
  enabled: false,
  facebook: false,
  instagram: false,
  twitter: false,
};

function mergeSpecialSocialShare(
  existing?: SpecialMenuSocialShare | null,
): SpecialMenuSocialShare {
  return { ...DEFAULT_SPECIAL_SOCIAL_SHARE, ...existing };
}

function SpecialShareFacebookIcon() {
  return (
    <svg
      className="h-12 w-12 shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function SpecialShareInstagramIcon() {
  const rawId = useId();
  const gradId = `special-share-ig-${rawId.replace(/:/g, "")}`;
  return (
    <svg
      className="h-12 w-12 shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDC830" />
          <stop offset="25%" stopColor="#F37335" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.163 6.163 0 1 0 0 12.326 6.163 6.163 0 0 0 0-12.326zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.881 0 1.44 1.44 0 0 1 2.881 0z"
      />
    </svg>
  );
}

function SpecialShareTwitterIcon() {
  return (
    <svg
      className="h-12 w-12 shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#1D9BF0"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `menu-${Date.now()}`;
}

function mergeLines(
  lines: SelectedLine[],
  foodId: number,
  options?: { defaultIncludeInMainMenu?: boolean },
): SelectedLine[] {
  if (lines.some((l) => l.foodId === foodId)) return lines;
  const includeInMainMenu = options?.defaultIncludeInMainMenu ?? true;
  return [...lines, { foodId, quantity: 15, includeInMainMenu }];
}

function updateLineQty(lines: SelectedLine[], foodId: number, quantity: number): SelectedLine[] {
  return lines.map((l) => (l.foodId === foodId ? { ...l, quantity } : l));
}

function removeLine(lines: SelectedLine[], foodId: number): SelectedLine[] {
  return lines.filter((l) => l.foodId !== foodId);
}

function applyDaysCount(prev: BuilderState, next: 7 | 15 | 30): BuilderState {
  const itemsByDay: Record<number, SelectedLine[]> = createEmptyDayMap(next);
  for (let d = 1; d <= next; d += 1) {
    itemsByDay[d] = prev.itemsByDay[d] ?? [];
  }
  return {
    ...prev,
    daysCount: next,
    itemsByDay,
    activeDay: Math.min(Math.max(1, prev.activeDay), next),
  };
}

function createBuilderState(
  menu: MenuRow | null,
  launchWithKind?: MenuKind | null,
): BuilderState {
  const empty: BuilderState = {
    step: "kind",
    kind: null,
    editId: null,
    name: "",
    mealCategory: "dinner",
    days: [...WEEKDAY_KEYS],
    normalLines: [],
    description: "",
    imagePreview: null,
    startDate: "",
    endDate: "",
    specialLines: [],
    socialShare: { ...DEFAULT_SPECIAL_SOCIAL_SHARE },
    daysCount: 7,
    expiryDate: "",
    price: "",
    discount: "",
    bannerText: "",
    activeDay: 1,
    itemsByDay: createEmptyDayMap(7),
    normalSessionAddedFoodIds: [],
  };

  if (!menu && launchWithKind) {
    const name =
      launchWithKind === "normal"
        ? "New weekly menu"
        : launchWithKind === "special"
          ? "Festival special"
          : "Monthly meal plan";
    return {
      ...empty,
      step: "form",
      kind: launchWithKind,
      name,
    };
  }

  if (!menu) return empty;

  if (menu.subscriptionDetails) {
    const sub = menu.subscriptionDetails;
    return {
      ...empty,
      step: "form",
      kind: "subscription",
      editId: menu.id,
      name: menu.name,
      daysCount: sub.daysCount,
      expiryDate: sub.expiryDate,
      price: sub.price,
      discount: sub.discount,
      bannerText: sub.bannerText,
      activeDay: 1,
      itemsByDay: { ...createEmptyDayMap(sub.daysCount), ...sub.itemsByDay },
    };
  }

  if (menu.specialDetails) {
    const sp = menu.specialDetails;
    return {
      ...empty,
      step: "form",
      kind: "special",
      editId: menu.id,
      name: menu.name,
      description: sp.description,
      imagePreview: sp.imagePreview,
      startDate: sp.startDate,
      endDate: sp.endDate,
      specialLines: sp.items,
      socialShare: mergeSpecialSocialShare(sp.socialShare),
    };
  }

  if (menu.normalDetails) {
    const n = menu.normalDetails;
    return {
      ...empty,
      step: "form",
      kind: "normal",
      editId: menu.id,
      name: menu.name,
      mealCategory: n.category,
      days: n.days.length ? [...n.days] : [...WEEKDAY_KEYS],
      normalLines: n.items,
      normalSessionAddedFoodIds: [],
    };
  }

  return {
    ...empty,
    step: "form",
    kind: "normal",
    editId: menu.id,
    name: menu.name,
    normalSessionAddedFoodIds: [],
  };
}

export function MenuBuilderWorkspace({
  menuToEdit,
  foodItems,
  onSave,
  onClose,
  launchWithKind = null,
}: MenuBuilderWorkspaceProps) {
  const [s, setS] = useState(() => createBuilderState(menuToEdit, launchWithKind));

  const totalSubscriptionItems = useMemo(
    () => Object.values(s.itemsByDay).reduce((n, arr) => n + arr.length, 0),
    [s.itemsByDay],
  );

  const linesForCatalog = useMemo(() => {
    if (s.kind === "normal") return s.normalLines;
    if (s.kind === "special") return s.specialLines;
    return s.itemsByDay[s.activeDay] ?? [];
  }, [s.kind, s.normalLines, s.specialLines, s.itemsByDay, s.activeDay]);

  const thumbForLines = (lines: SelectedLine[]) => {
    const first = lines[0];
    const food = first ? foodById(foodItems, first.foodId) : undefined;
    if (food?.imageUrl) return food.imageUrl;
    return `https://picsum.photos/seed/${encodeURIComponent(s.name || "menu")}/96/96`;
  };

  const pickKind = (next: MenuKind) => {
    setS((prev) => ({
      ...prev,
      kind: next,
      step: "form",
      name:
        !prev.name.trim() && !menuToEdit
          ? next === "normal"
            ? "New weekly menu"
            : next === "special"
              ? "Festival special"
              : "Monthly meal plan"
          : prev.name,
    }));
  };

  const toggleDay = (d: string) => {
    setS((prev) => {
      let days: string[];
      if (prev.days.includes(d)) {
        const next = prev.days.filter((x) => x !== d);
        days = next.length ? next : prev.days;
      } else {
        days = [...prev.days, d].sort(
          (a, b) =>
            WEEKDAY_KEYS.indexOf(a as (typeof WEEKDAY_KEYS)[number]) -
            WEEKDAY_KEYS.indexOf(b as (typeof WEEKDAY_KEYS)[number]),
        );
      }
      return { ...prev, days };
    });
  };

  const handleSave = () => {
    const trimmed = s.name.trim();
    if (!trimmed || !s.kind) return;

    const id = s.editId ?? newId();

    const activeFlag = menuToEdit?.active ?? true;

    if (s.kind === "normal") {
      if (s.normalLines.length === 0) return;
      onSave({
        id,
        name: trimmed,
        tableType: s.mealCategory,
        availability: formatAvailabilityNormal(s.days),
        imageUrl: thumbForLines(s.normalLines),
        active: activeFlag,
        normalDetails: {
          category: s.mealCategory,
          days: s.days,
          items: s.normalLines.map(menuSaveSelectedLine),
        },
      });
      return;
    }

    if (s.kind === "special") {
      if (s.specialLines.length === 0) return;
      onSave({
        id,
        name: trimmed,
        tableType: "special",
        availability: formatAvailabilitySpecial(s.startDate, s.endDate),
        imageUrl: s.imagePreview ?? thumbForLines(s.specialLines),
        active: activeFlag,
        specialDetails: {
          description: s.description.trim(),
          imagePreview: s.imagePreview,
          startDate: s.startDate,
          endDate: s.endDate,
          items: s.specialLines.map(menuSaveSelectedLine),
          socialShare: { ...s.socialShare },
        },
      });
      return;
    }

    if (totalSubscriptionItems === 0) return;
    onSave({
      id,
      name: trimmed,
      tableType: "subscription",
      availability: `${s.daysCount}-day plan · renew by ${s.expiryDate || "—"}`,
      imageUrl: thumbForLines(Object.values(s.itemsByDay).flat()),
      active: activeFlag,
      subscriptionDetails: {
        daysCount: s.daysCount,
        expiryDate: s.expiryDate,
        price: s.price,
        discount: s.discount,
        bannerText: s.bannerText,
        itemsByDay: Object.fromEntries(
          Object.entries(s.itemsByDay).map(([day, arr]) => [
            Number(day),
            (arr ?? []).map(menuSaveSelectedLine),
          ]),
        ) as Record<number, SelectedLine[]>,
      },
    });
  };

  const handleImagePick = (file: File | null) => {
    if (!file) {
      setS((prev) => ({ ...prev, imagePreview: null }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setS((prev) => ({ ...prev, imagePreview: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const addFromCatalog = (foodId: number) => {
    setS((prev) => {
      if (prev.kind === "normal") {
        const already = prev.normalLines.some((l) => l.foodId === foodId);
        const normalLines = mergeLines(prev.normalLines, foodId, {
          defaultIncludeInMainMenu: !menuToEdit,
        });
        const normalSessionAddedFoodIds =
          menuToEdit && !already
            ? [...prev.normalSessionAddedFoodIds, foodId]
            : prev.normalSessionAddedFoodIds;
        return { ...prev, normalLines, normalSessionAddedFoodIds };
      }
      if (prev.kind === "special") {
        return { ...prev, specialLines: mergeLines(prev.specialLines, foodId) };
      }
      if (prev.kind === "subscription") {
        const cur = prev.itemsByDay[prev.activeDay] ?? [];
        return {
          ...prev,
          itemsByDay: {
            ...prev.itemsByDay,
            [prev.activeDay]: mergeLines(cur, foodId),
          },
        };
      }
      return prev;
    });
  };

  const setLineIncludeInMainMenu = (foodId: number, includeInMainMenu: boolean) => {
    setS((prev) => {
      if (prev.kind !== "normal") return prev;
      return {
        ...prev,
        normalLines: prev.normalLines.map((l) =>
          l.foodId === foodId ? { ...l, includeInMainMenu } : l,
        ),
      };
    });
  };

  const setLineSlotAvailability = (foodId: number, slot: SelectedLineSlotAvailability) => {
    setS((prev) => {
      if (prev.kind === "normal") {
        return {
          ...prev,
          normalLines: patchSelectedLineSlotAvailability(prev.normalLines, foodId, slot),
        };
      }
      if (prev.kind === "special") {
        return {
          ...prev,
          specialLines: patchSelectedLineSlotAvailability(prev.specialLines, foodId, slot),
        };
      }
      if (prev.kind === "subscription") {
        const day = prev.activeDay;
        const cur = prev.itemsByDay[day] ?? [];
        return {
          ...prev,
          itemsByDay: {
            ...prev.itemsByDay,
            [day]: patchSelectedLineSlotAvailability(cur, foodId, slot),
          },
        };
      }
      return prev;
    });
  };

  const changeQty = (foodId: number, quantity: number) => {
    setS((prev) => {
      if (prev.kind === "normal") {
        return { ...prev, normalLines: updateLineQty(prev.normalLines, foodId, quantity) };
      }
      if (prev.kind === "special") {
        return { ...prev, specialLines: updateLineQty(prev.specialLines, foodId, quantity) };
      }
      if (prev.kind === "subscription") {
        const cur = prev.itemsByDay[prev.activeDay] ?? [];
        return {
          ...prev,
          itemsByDay: {
            ...prev.itemsByDay,
            [prev.activeDay]: updateLineQty(cur, foodId, quantity),
          },
        };
      }
      return prev;
    });
  };

  const removeFromSelection = (foodId: number) => {
    setS((prev) => {
      if (prev.kind === "normal") {
        return {
          ...prev,
          normalLines: removeLine(prev.normalLines, foodId),
          normalSessionAddedFoodIds: prev.normalSessionAddedFoodIds.filter((id) => id !== foodId),
        };
      }
      if (prev.kind === "special") {
        return { ...prev, specialLines: removeLine(prev.specialLines, foodId) };
      }
      if (prev.kind === "subscription") {
        const cur = prev.itemsByDay[prev.activeDay] ?? [];
        return {
          ...prev,
          itemsByDay: { ...prev.itemsByDay, [prev.activeDay]: removeLine(cur, foodId) },
        };
      }
      return prev;
    });
  };

  const canSave =
    Boolean(s.name.trim() && s.kind) &&
    (s.kind === "normal"
      ? s.normalLines.length > 0
      : s.kind === "special"
        ? s.specialLines.length > 0
        : totalSubscriptionItems > 0);

  const typeCards: { id: MenuKind; title: string; blurb: string; icon: string }[] = [
    {
      id: "normal",
      title: "Normal menu",
      blurb: "Weekly rotations with lunch or dinner slots.",
      icon: "calendar_month",
    },
    {
      id: "special",
      title: "Special menu",
      blurb: "Date-bound feasts with hero imagery.",
      icon: "auto_awesome",
    },
    {
      id: "subscription",
      title: "Subscription menu",
      blurb: "Multi-day plans priced as a bundle.",
      icon: "subscriptions",
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-surface-container-lowest">
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-outline-variant/10 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-10 shrink-0 rounded-full p-0 text-secondary"
            onClick={onClose}
            aria-label="Close menu builder"
          >
            <MaterialIcon name="close" className="text-2xl" />
          </Button>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary">
              Menu builder & configuration
            </p>
            <h2 className="mt-1 truncate font-headline text-lg font-extrabold tracking-tight text-on-surface sm:text-xl md:text-2xl">
              {s.step === "kind" ? "Choose a menu type" : s.name || "Untitled menu"}
            </h2>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
        {s.step === "kind" ? (
          <div className="grid gap-4 md:grid-cols-3">
            {typeCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => pickKind(card.id)}
                className="text-left transition-transform active:scale-[0.99]"
              >
                <Card className="h-full space-y-4 p-5 ring-primary/0 transition-shadow hover:shadow-primary-soft hover:ring-primary/15">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                    <MaterialIcon name={card.icon} className="text-2xl" filled />
                  </div>
                  <div>
                    <p className="font-headline text-lg font-extrabold text-on-surface">{card.title}</p>
                    <p className="mt-2 text-sm font-medium text-on-surface-variant">{card.blurb}</p>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        ) : null}

        {s.step === "form" && s.kind === "normal" ? (
          <div className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-2">
              <Input
                label="Menu name"
                value={s.name}
                onChange={(e) => setS((prev) => ({ ...prev, name: e.target.value }))}
              />
              <SelectField
                label="Category"
                value={s.mealCategory}
                onChange={(e) =>
                  setS((prev) => ({ ...prev, mealCategory: e.target.value as MealCategory }))
                }
              >
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="both">Both (lunch & dinner)</option>
              </SelectField>
            </div>

            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-secondary">
                Days
              </p>
              <div className="flex flex-wrap gap-2">
                {WEEKDAY_KEYS.map((d) => {
                  const on = s.days.includes(d);
                  return (
                    <Button
                      key={d}
                      type="button"
                      size="sm"
                      variant={on ? "primary" : "outline"}
                      className={cn(!on && "border-outline-variant/30 text-secondary")}
                      onClick={() => toggleDay(d)}
                    >
                      {d}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid min-h-[360px] gap-6 xl:grid-cols-2">
              <FoodCatalogPanel foodItems={foodItems} lines={linesForCatalog} onAdd={addFromCatalog} />
              <SelectedItemsPanel
                foodItems={foodItems}
                lines={linesForCatalog}
                mainMenuScopeSessionFoodIds={s.normalSessionAddedFoodIds}
                onIncludeInMainMenuChange={menuToEdit ? setLineIncludeInMainMenu : undefined}
                onLineSlotAvailabilityChange={setLineSlotAvailability}
                onChangeQuantity={changeQty}
                onRemove={removeFromSelection}
              />
            </div>
          </div>
        ) : null}

        {s.step === "form" && s.kind === "special" ? (
          <div className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-2">
              <Input
                label="Menu name"
                value={s.name}
                onChange={(e) => setS((prev) => ({ ...prev, name: e.target.value }))}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Start date"
                  type="date"
                  value={s.startDate}
                  onChange={(e) => setS((prev) => ({ ...prev, startDate: e.target.value }))}
                />
                <Input
                  label="End date"
                  type="date"
                  value={s.endDate}
                  onChange={(e) => setS((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <Textarea
              label="Description"
              value={s.description}
              onChange={(e) => setS((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
            <Input
              label="Hero image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImagePick(e.target.files?.[0] ?? null)}
            />

            <div className="grid min-h-[360px] gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="grid min-h-[320px] gap-6 lg:grid-cols-2">
                <FoodCatalogPanel foodItems={foodItems} lines={linesForCatalog} onAdd={addFromCatalog} />
                <SelectedItemsPanel
                  foodItems={foodItems}
                  lines={linesForCatalog}
                  onLineSlotAvailabilityChange={setLineSlotAvailability}
                  onChangeQuantity={changeQty}
                  onRemove={removeFromSelection}
                />
              </div>
              <Card className="h-fit space-y-3 p-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">
                  Live preview
                </p>
                <div className="overflow-hidden rounded-xl ring-1 ring-outline-variant/15">
                  {s.imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element -- data URL from FileReader
                    <img src={s.imagePreview} alt="" className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-surface-container-high/40 text-sm font-semibold text-secondary">
                      Image preview
                    </div>
                  )}
                </div>
                <p className="font-headline text-lg font-extrabold text-on-surface">
                  {s.name || "Special title"}
                </p>
                <p className="text-sm text-on-surface-variant line-clamp-3">
                  {s.description || "Describe the experience diners can expect."}
                </p>
              </Card>
            </div>

            <Card className="space-y-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                    <MaterialIcon name="share" className="text-xl" filled />
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline text-base font-extrabold text-on-surface">
                      Share on social
                    </p>
                    <p className="mt-1 text-sm font-medium text-on-surface-variant">
                      Let guests share this special menu on the channels you turn on below.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-secondary">
                    Enable
                  </span>
                  <Switch
                    checked={s.socialShare.enabled}
                    onCheckedChange={(enabled) =>
                      setS((prev) => ({
                        ...prev,
                        socialShare: { ...prev.socialShare, enabled },
                      }))
                    }
                    aria-label="Enable social sharing for this special menu"
                  />
                </div>
              </div>

              <div
                className={cn(
                  "space-y-3 border-t border-outline-variant/10 pt-4 transition-opacity",
                  !s.socialShare.enabled && "pointer-events-none opacity-40",
                )}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary">
                  Platforms
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between gap-4">
                    <span className="flex min-w-0 items-center gap-4">
                      <SpecialShareFacebookIcon />
                      <span className="truncate text-sm font-semibold text-on-surface">Facebook</span>
                    </span>
                    <Switch
                      checked={s.socialShare.facebook}
                      disabled={!s.socialShare.enabled}
                      onCheckedChange={(facebook) =>
                        setS((prev) => ({
                          ...prev,
                          socialShare: { ...prev.socialShare, facebook },
                        }))
                      }
                      aria-label="Share on Facebook"
                    />
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span className="flex min-w-0 items-center gap-4">
                      <SpecialShareInstagramIcon />
                      <span className="truncate text-sm font-semibold text-on-surface">Instagram</span>
                    </span>
                    <Switch
                      checked={s.socialShare.instagram}
                      disabled={!s.socialShare.enabled}
                      onCheckedChange={(instagram) =>
                        setS((prev) => ({
                          ...prev,
                          socialShare: { ...prev.socialShare, instagram },
                        }))
                      }
                      aria-label="Share on Instagram"
                    />
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span className="flex min-w-0 items-center gap-4">
                      <SpecialShareTwitterIcon />
                      <span className="truncate text-sm font-semibold text-on-surface">X (Twitter)</span>
                    </span>
                    <Switch
                      checked={s.socialShare.twitter}
                      disabled={!s.socialShare.enabled}
                      onCheckedChange={(twitter) =>
                        setS((prev) => ({
                          ...prev,
                          socialShare: { ...prev.socialShare, twitter },
                        }))
                      }
                      aria-label="Share on X (Twitter)"
                    />
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        ) : null}

        {s.step === "form" && s.kind === "subscription" ? (
          <div className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-2">
              <Input
                label="Subscription name"
                value={s.name}
                onChange={(e) => setS((prev) => ({ ...prev, name: e.target.value }))}
              />
              <SelectField
                label="Plan length (days)"
                value={String(s.daysCount)}
                onChange={(e) =>
                  setS((prev) => applyDaysCount(prev, Number(e.target.value) as 7 | 15 | 30))
                }
              >
                <option value="7">7 days</option>
                <option value="15">15 days</option>
                <option value="30">30 days</option>
              </SelectField>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="Expiry date"
                type="date"
                value={s.expiryDate}
                onChange={(e) => setS((prev) => ({ ...prev, expiryDate: e.target.value }))}
              />
              <Input
                label="Price (₹)"
                inputMode="decimal"
                value={s.price}
                onChange={(e) => setS((prev) => ({ ...prev, price: e.target.value }))}
              />
              <Input
                label="Discount (optional)"
                placeholder="e.g. 10%"
                value={s.discount}
                onChange={(e) => setS((prev) => ({ ...prev, discount: e.target.value }))}
              />
            </div>
            <Input
              label="Banner text"
              placeholder="Monthly meal deal"
              value={s.bannerText}
              onChange={(e) => setS((prev) => ({ ...prev, bannerText: e.target.value }))}
            />

            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-secondary">
                Build each day
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: s.daysCount }, (_, i) => i + 1).map((d) => {
                  const active = d === s.activeDay;
                  return (
                    <Button
                      key={d}
                      type="button"
                      size="sm"
                      variant={active ? "primary" : "outline"}
                      className={cn(!active && "border-outline-variant/30 text-secondary")}
                      onClick={() => setS((prev) => ({ ...prev, activeDay: d }))}
                    >
                      Day {d}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid min-h-[360px] gap-6 xl:grid-cols-2">
              <FoodCatalogPanel foodItems={foodItems} lines={linesForCatalog} onAdd={addFromCatalog} />
              <SelectedItemsPanel
                foodItems={foodItems}
                lines={linesForCatalog}
                title={`Day ${s.activeDay} picks`}
                onLineSlotAvailabilityChange={setLineSlotAvailability}
                onChangeQuantity={changeQty}
                onRemove={removeFromSelection}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-outline-variant/10 bg-surface-container-lowest/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap gap-2">
          {!menuToEdit && s.step === "form" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setS((prev) => ({ ...prev, step: "kind", kind: null }))}
            >
              Back
            </Button>
          ) : null}
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button type="button" size="sm" disabled={!canSave} onClick={handleSave}>
            Save menu
          </Button>
        </div>
      </div>
    </div>
  );
}
