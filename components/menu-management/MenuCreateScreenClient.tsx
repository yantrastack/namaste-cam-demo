"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { MenuBuilderWorkspace } from "./MenuBuilderWorkspace";
import { useMenuManagementDemo } from "./MenuManagementDemoContext";
import { DEMO_FOOD_ITEMS, type MenuKind, type MenuRow } from "./model";
import type { SubscriptionMenuDraft } from "./subscription-menu-model";
import type { SubscriptionMenuRecord } from "./initial-demo-subscriptions";

function DietIcon({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded border-2",
        veg
          ? "border-green-600 bg-green-50 text-green-700"
          : "border-red-600 bg-red-50 text-red-700",
      )}
      aria-hidden
    >
      <span className={cn("size-1.5 rounded-full", veg ? "bg-green-600" : "bg-red-600")} />
    </span>
  );
}

type TodayItem = { name: string; veg: boolean };

const MAX_VISIBLE_MENU_ITEMS = 5;

/** Deterministic Picsum covers (`next.config.ts` allows `picsum.photos`). */
const TODAY_LUNCH_COVER =
  "https://images.picxy.com/cache/2020/7/11/a3f877f20da02b1a9b619ed4a82a065e.jpg";
const TODAY_DINNER_COVER =
  "https://img.freepik.com/premium-photo/spices-dinner-indian-food-vegetarian_87720-36241.jpg";

function CoverMedia({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  if (src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 size-full object-cover"
        decoding="async"
      />
    );
  }
  return <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />;
}

const LUNCH_ITEMS: TodayItem[] = [
  { name: "Dal Tadka", veg: true },
  { name: "Jeera Rice", veg: true },
  { name: "Tandoori Roti", veg: true },
  { name: "Aloo Gobi", veg: true },
  { name: "Mixed Raita", veg: true },
];

const DINNER_ITEMS: TodayItem[] = [
  { name: "Butter Chicken", veg: false },
  { name: "Dal Makhani", veg: true },
  { name: "Garlic Naan", veg: true },
  { name: "Paneer Butter Masala", veg: true },
  { name: "Jeera Rice", veg: true },
];

function parseIsoDateOnly(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(day)) return null;
  return new Date(y, mo, day);
}

function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function weekdayKeyFromDate(d: Date): string {
  const keys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  return keys[d.getDay()];
}

/** Special is in its promo window (date range); `active` is toggled separately on the card. */
function isSpecialScheduledOnLocalDay(menu: MenuRow, day: Date): boolean {
  if (menu.tableType !== "special" || !menu.specialDetails) return false;
  const start = parseIsoDateOnly(menu.specialDetails.startDate);
  const end = parseIsoDateOnly(menu.specialDetails.endDate);
  if (!start || !end) return false;
  const t = startOfLocalDay(day);
  return t >= start.getTime() && t <= end.getTime();
}

type OutletToggleConfirm =
  | { kind: "menu"; menuId: string; cardLabel: string; nextActive: boolean; headerCoverSrc: string }
  | {
      kind: "subscription";
      subscriptionId: string;
      cardLabel: string;
      nextActive: boolean;
      headerCoverSrc: string;
    };

function specialMenuLinesToTodayItems(menu: MenuRow): TodayItem[] {
  const lines = menu.specialDetails?.items ?? [];
  return lines.map((line) => {
    const food = DEMO_FOOD_ITEMS.find((f) => f.id === line.foodId);
    return {
      name: food?.name ?? `Item #${line.foodId}`,
      veg: food?.diet === "veg",
    };
  });
}

function normalMenuLinesToTodayItems(menu: MenuRow | undefined): TodayItem[] | null {
  const lines = menu?.normalDetails?.items;
  if (!lines?.length) return null;
  return lines.map((line) => {
    const food = DEMO_FOOD_ITEMS.find((f) => f.id === line.foodId);
    return {
      name: food?.name ?? `Item #${line.foodId}`,
      veg: food?.diet === "veg",
    };
  });
}

function subscriptionMenuDraftToTodayItems(menu: SubscriptionMenuDraft): TodayItem[] {
  const seen = new Set<string>();
  const out: TodayItem[] = [];
  for (const section of menu.sections) {
    for (const item of section.items) {
      if (seen.has(item.name)) continue;
      seen.add(item.name);
      out.push({ name: item.name, veg: item.type === "veg" });
    }
  }
  if (out.length === 0) {
    return [{ name: `${menu.totalDays}-day plan · add dishes in the builder`, veg: true }];
  }
  return out;
}

const SUBSCRIPTION_CARD_FALLBACK_COVER =
  "https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2022-04/Food%20Menu.jpg";

function subscriptionCoverSrc(record: SubscriptionMenuRecord): string {
  if (record.menu.bannerImage) return record.menu.bannerImage;
  return SUBSCRIPTION_CARD_FALLBACK_COVER;
}

const TODAY_MENU_GRID_CLASS =
  "grid min-w-0 auto-rows-fr gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]";

export function MenuCreateScreenClient() {
  const router = useRouter();
  const { menus, upsertMenu, setMenuActive, subscriptions, setSubscriptionActive } = useMenuManagementDemo();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [launchKind, setLaunchKind] = useState<MenuKind | null>(null);
  const [workspaceKey, setWorkspaceKey] = useState(0);
  const [outletToggleConfirm, setOutletToggleConfirm] = useState<OutletToggleConfirm | null>(null);

  const today = useMemo(() => new Date(), []);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(today),
    [today],
  );

  const weekdayKey = useMemo(() => weekdayKeyFromDate(today), [today]);

  const todayLunchMenu = useMemo(
    () =>
      menus.find((m) => m.tableType === "lunch" && m.normalDetails?.days?.includes(weekdayKey)) ??
      menus.find((m) => m.tableType === "both" && m.normalDetails?.days?.includes(weekdayKey)),
    [menus, weekdayKey],
  );

  const todayDinnerMenu = useMemo(
    () =>
      menus.find((m) => m.tableType === "dinner" && m.normalDetails?.days?.includes(weekdayKey)) ??
      menus.find((m) => m.tableType === "both" && m.normalDetails?.days?.includes(weekdayKey)),
    [menus, weekdayKey],
  );

  const lunchItemsFromMenus = useMemo(
    () => normalMenuLinesToTodayItems(todayLunchMenu),
    [todayLunchMenu],
  );

  const dinnerItemsFromMenus = useMemo(
    () => normalMenuLinesToTodayItems(todayDinnerMenu),
    [todayDinnerMenu],
  );

  const specialsScheduledToday = useMemo(
    () => menus.filter((m) => isSpecialScheduledOnLocalDay(m, today)),
    [menus, today],
  );

  const sortedSubscriptions = useMemo(
    () =>
      [...subscriptions].sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        return b.createdAt - a.createdAt;
      }),
    [subscriptions],
  );

  const activeSubscriptionCount = useMemo(
    () => subscriptions.filter((s) => s.active).length,
    [subscriptions],
  );

  const openBuilder = useCallback((kind: MenuKind | null) => {
    setLaunchKind(kind);
    setWorkspaceKey((k) => k + 1);
    setBuilderOpen(true);
  }, []);

  const closeBuilder = useCallback(() => {
    setBuilderOpen(false);
    setLaunchKind(null);
  }, []);

  const handleSave = useCallback(
    (row: MenuRow) => {
      upsertMenu(row);
      router.push("/menu");
    },
    [router, upsertMenu],
  );

  const requestOutletToggle = useCallback(
    (menuId: string, cardLabel: string, nextActive: boolean, headerCoverSrc: string) => {
      setOutletToggleConfirm({ kind: "menu", menuId, cardLabel, nextActive, headerCoverSrc });
    },
    [],
  );

  const requestSubscriptionOutletToggle = useCallback(
    (subscriptionId: string, cardLabel: string, nextActive: boolean, headerCoverSrc: string) => {
      setOutletToggleConfirm({
        kind: "subscription",
        subscriptionId,
        cardLabel,
        nextActive,
        headerCoverSrc,
      });
    },
    [],
  );

  const closeOutletToggleModal = useCallback(() => {
    setOutletToggleConfirm(null);
  }, []);

  const confirmOutletToggle = useCallback(() => {
    if (!outletToggleConfirm) return;
    if (outletToggleConfirm.kind === "menu") {
      setMenuActive(outletToggleConfirm.menuId, outletToggleConfirm.nextActive);
    } else {
      setSubscriptionActive(outletToggleConfirm.subscriptionId, outletToggleConfirm.nextActive);
    }
    setOutletToggleConfirm(null);
  }, [outletToggleConfirm, setMenuActive, setSubscriptionActive]);

  return (
    <>
      <div className="mx-auto min-w-0 max-w-7xl space-y-8 pb-8">
        <nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-secondary transition-colors hover:text-primary"
          >
            Admin
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" aria-hidden />
          <Link href="/menu" className="text-sm font-semibold text-secondary transition-colors hover:text-primary">
            Menu Management
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" aria-hidden />
          <span className="text-sm font-semibold text-on-surface">Create menu</span>
        </nav>

        <section>
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-secondary">Quick actions</p>
          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => openBuilder("normal")}
              className="group w-full text-left transition-transform active:scale-[0.99]"
            >
              <Card className="h-full space-y-4 p-5 transition-shadow group-hover:shadow-primary-soft group-hover:ring-primary/15">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                  <MaterialIcon name="add_circle" className="text-2xl" filled />
                </div>
                <div>
                  <p className="font-headline text-lg font-extrabold text-on-surface">Create menu</p>
                  <p className="mt-2 text-sm font-medium text-on-surface-variant">Design a fresh daily selection</p>
                </div>
              </Card>
            </button>
            <button
              type="button"
              onClick={() => openBuilder("special")}
              className="group w-full text-left transition-transform active:scale-[0.99]"
            >
              <Card className="h-full space-y-4 p-5 transition-shadow group-hover:shadow-primary-soft group-hover:ring-primary/15">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                  <MaterialIcon name="auto_awesome" className="text-2xl" filled />
                </div>
                <div>
                  <p className="font-headline text-lg font-extrabold text-on-surface">Add special menu</p>
                  <p className="mt-2 text-sm font-medium text-on-surface-variant">Create festive or themed offers</p>
                </div>
              </Card>
            </button>
            <button
              type="button"
              onClick={() => router.push("/menu/create/subscription")}
              className="group w-full text-left transition-transform active:scale-[0.99]"
            >
              <Card className="h-full space-y-4 p-5 transition-shadow group-hover:shadow-primary-soft group-hover:ring-primary/15">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                  <MaterialIcon name="grid_view" className="text-2xl" filled />
                </div>
                <div>
                  <p className="font-headline text-lg font-extrabold text-on-surface">Subscription menu</p>
                  <p className="mt-2 text-sm font-medium text-on-surface-variant">Schedule rotations for the week</p>
                </div>
              </Card>
            </button>
          </div>
        </section>

        <section className="min-w-0 space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <h2 className="font-headline text-xl font-extrabold tracking-tight text-on-surface sm:text-2xl">
              Today&apos;s menu
            </h2>
            <p className="text-sm font-semibold text-secondary">{todayLabel}</p>
          </div>
          <div className={TODAY_MENU_GRID_CLASS}>
            <MealDayCard
              title="Lunch"
              coverSrc={TODAY_LUNCH_COVER}
              items={lunchItemsFromMenus ?? LUNCH_ITEMS}
              outletActive={todayLunchMenu?.active ?? false}
              onOutletActiveChange={
                todayLunchMenu
                  ? (checked) =>
                      requestOutletToggle(todayLunchMenu.id, "Lunch", checked, TODAY_LUNCH_COVER)
                  : undefined
              }
              outletSwitchDisabled={!todayLunchMenu}
            />
            <MealDayCard
              title="Dinner"
              coverSrc={TODAY_DINNER_COVER}
              items={dinnerItemsFromMenus ?? DINNER_ITEMS}
              outletActive={todayDinnerMenu?.active ?? false}
              onOutletActiveChange={
                todayDinnerMenu
                  ? (checked) =>
                      requestOutletToggle(todayDinnerMenu.id, "Dinner", checked, TODAY_DINNER_COVER)
                  : undefined
              }
              outletSwitchDisabled={!todayDinnerMenu}
            />
            {specialsScheduledToday.map((menu) => {
              const specialItems = specialMenuLinesToTodayItems(menu);
              return (
                <MealDayCard
                  key={menu.id}
                  title={menu.name}
                  coverSrc={menu.specialDetails?.imagePreview ?? menu.imageUrl}
                  items={
                    specialItems.length > 0
                      ? specialItems
                      : [{ name: `${menu.availability} · add dishes in the builder`, veg: true }]
                  }
                  outletActive={menu.active}
                  onOutletActiveChange={(checked) =>
                    requestOutletToggle(
                      menu.id,
                      menu.name,
                      checked,
                      menu.specialDetails?.imagePreview ?? menu.imageUrl,
                    )
                  }
                />
              );
            })}
          </div>

          {sortedSubscriptions.length > 0 ? (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="font-headline text-lg font-extrabold tracking-tight text-on-surface">
                  Subscription plans
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                  {activeSubscriptionCount} active for outlets
                </p>
              </div>
              <p className="text-sm font-medium text-on-surface-variant">
                Same outlet toggle as daily menus. Plans are edited on the subscription builder page.
              </p>
              <div className={TODAY_MENU_GRID_CLASS}>
                {sortedSubscriptions.map((record) => {
                  const label = record.menu.name.trim() || "Subscription";
                  const title = `${label} · ${record.menu.totalDays}d`;
                  const items = subscriptionMenuDraftToTodayItems(record.menu);
                  return (
                    <MealDayCard
                      key={record.id}
                      title={title}
                      coverSrc={subscriptionCoverSrc(record)}
                      items={items}
                      outletActive={record.active}
                      onOutletActiveChange={(checked) =>
                        requestSubscriptionOutletToggle(
                          record.id,
                          title,
                          checked,
                          subscriptionCoverSrc(record),
                        )
                      }
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <Modal
        open={outletToggleConfirm !== null}
        onClose={closeOutletToggleModal}
        className="!max-w-2xl"
        titleContent={
          outletToggleConfirm ? (
            <div className="flex gap-4">
              <div className="relative h-[4.5rem] w-32 shrink-0 overflow-hidden rounded-lg bg-surface-container-high ring-1 ring-outline-variant/15">
                <CoverMedia
                  src={outletToggleConfirm.headerCoverSrc}
                  alt=""
                  sizes="128px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                  Outlets
                </p>
                <h2 className="font-headline mt-1 text-2xl font-extrabold tracking-tight text-on-surface">
                  {outletToggleConfirm.nextActive ? (
                    <>
                      Activate{" "}
                      <span className="text-primary">“{outletToggleConfirm.cardLabel}”</span> for guests?
                    </>
                  ) : (
                    <>
                      Deactivate{" "}
                      <span className="text-primary">“{outletToggleConfirm.cardLabel}”</span> for guests?
                    </>
                  )}
                </h2>
                <p className="mt-2 text-xs font-medium text-on-surface-variant">
                  Matches the card you clicked — same cover and title as Today&apos;s menu.
                </p>
              </div>
            </div>
          ) : undefined
        }
      >
        {outletToggleConfirm ? (
          <>
            <p className="mb-6 text-sm font-medium leading-relaxed text-on-surface-variant">
              {outletToggleConfirm.nextActive
                ? outletToggleConfirm.kind === "subscription"
                  ? "Subscribers will be able to choose this plan where outlets have it enabled."
                  : "Guests will be able to see and order from this menu where outlets are enabled."
                : outletToggleConfirm.kind === "subscription"
                  ? "While inactive, this plan will not appear to guests. You can turn it back on from this page."
                  : "While inactive, this menu will not appear to guests. You can turn it back on anytime from this page or Master Menu."}
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <Button type="button" variant="outline" size="md" onClick={closeOutletToggleModal}>
                Cancel
              </Button>
              <Button
                type="button"
                variant={outletToggleConfirm.nextActive ? "primary" : "danger"}
                size="md"
                onClick={confirmOutletToggle}
              >
                {outletToggleConfirm.nextActive ? "Activate" : "Deactivate"}
              </Button>
            </div>
          </>
        ) : null}
      </Modal>

      <Drawer
        open={builderOpen}
        onClose={closeBuilder}
        position="right"
        className={cn(
          "flex h-full w-[min(100vw,1120px)]! max-w-[min(100vw,1120px)]! flex-col sm:rounded-l-2xl",
          "border-l border-outline-variant/15 shadow-2xl",
        )}
      >
        {builderOpen ? (
          <MenuBuilderWorkspace
            key={workspaceKey}
            menuToEdit={null}
            foodItems={DEMO_FOOD_ITEMS}
            launchWithKind={launchKind}
            onSave={handleSave}
            onClose={closeBuilder}
          />
        ) : null}
      </Drawer>
    </>
  );
}

function MealDayCard({
  title,
  coverSrc,
  items,
  outletActive,
  onOutletActiveChange,
  outletSwitchDisabled = false,
}: {
  title: string;
  coverSrc: string;
  items: TodayItem[];
  outletActive: boolean;
  onOutletActiveChange?: (checked: boolean) => void;
  outletSwitchDisabled?: boolean;
}) {
  const visibleItems = items.slice(0, MAX_VISIBLE_MENU_ITEMS);
  const overflowCount = items.length - MAX_VISIBLE_MENU_ITEMS;

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden p-0 shadow-sm ring-1 ring-outline-variant/10">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden">
        <CoverMedia
          src={coverSrc}
          alt=""
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />
        <p className="absolute bottom-4 left-4 font-headline text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
          {title}
        </p>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-outline-variant/15 px-4 py-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
          Outlets
        </span>
        <div className="flex items-center gap-2">
          <Switch
            checked={outletActive}
            onCheckedChange={onOutletActiveChange}
            disabled={outletSwitchDisabled || !onOutletActiveChange}
            aria-label={`${outletActive ? "Deactivate" : "Activate"} ${title} for outlets`}
          />
          <span
            className={cn(
              "text-[10px] font-extrabold uppercase tracking-widest",
              outletSwitchDisabled ? "text-secondary" : outletActive ? "text-primary" : "text-secondary",
            )}
          >
            {outletSwitchDisabled ? "No menu" : outletActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <ul className="divide-y divide-outline-variant/15 px-4 py-1">
        {visibleItems.map((item, index) => (
          <li key={`${title}-${index}-${item.name}`} className="flex items-center gap-3 py-2.5">
            <DietIcon veg={item.veg} />
            <span className="min-w-0 flex-1 text-sm font-bold text-on-surface">{item.name}</span>
          </li>
        ))}
        {overflowCount > 0 ? (
          <li className="py-2.5 pl-8 text-sm font-semibold text-secondary">
            +{overflowCount} more {overflowCount === 1 ? "item" : "items"}
          </li>
        ) : null}
      </ul>
    </Card>
  );
}
