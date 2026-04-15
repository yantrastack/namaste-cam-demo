"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { Switch } from "@/components/ui/Switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import { useMenuManagementDemo } from "./MenuManagementDemoContext";
import { SubscriptionPlanDrawerEditor } from "./SubscriptionMenuBuilderClient";
import { patchMenuRowWithSubscriptionDraft } from "./sync-subscription-menu-row";
import type { SubscriptionMenuDraft } from "./subscription-menu-model";
import {
  WEEKDAY_KEYS,
  type MenuRow,
  type TableMenuType,
  calendarDateForFocusDay,
  normalMenuAppliesToWeekday,
  specialAppliesOnDate,
  subscriptionValidOnDate,
  weekdayKeyFromDate,
} from "./model";

const TYPE_LABEL: Record<TableMenuType, string> = {
  lunch: "Lunch",
  dinner: "Dinner",
  both: "Lunch & dinner",
  special: "Special",
  subscription: "Subscription",
};

const PRIMARY_TYPE_ORDER: Record<TableMenuType, number> = {
  lunch: 0,
  both: 1,
  dinner: 2,
  special: 3,
  subscription: 4,
};

const MENU_AVATAR_PALETTES = [
  "bg-primary-container text-on-primary-container ring-1 ring-primary-fixed-dim/40",
  "bg-secondary-container text-on-secondary-container ring-1 ring-secondary-fixed-dim/40",
  "bg-tertiary-container text-on-tertiary-container ring-1 ring-tertiary-fixed-dim/40",
  "bg-primary/15 text-primary ring-1 ring-primary/25",
  "bg-secondary-fixed-dim text-on-secondary-fixed ring-1 ring-outline-variant/30",
  "bg-surface-container-highest text-on-surface ring-1 ring-outline-variant/25",
];

function menuInitials(name: string): string {
  const cleaned = name.replace(/[()]/g, " ");
  const parts = cleaned
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0 && !/^\d+$/.test(p));
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  const one = parts[0] ?? name;
  return one.slice(0, 2).toUpperCase();
}

function paletteForMenuId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return MENU_AVATAR_PALETTES[h % MENU_AVATAR_PALETTES.length] ?? MENU_AVATAR_PALETTES[0];
}

function typeTone(t: TableMenuType): "info" | "neutral" {
  if (t === "special") return "info";
  if (t === "subscription") return "info";
  return "neutral";
}

function sortPrimaryRows(a: MenuRow, b: MenuRow): number {
  const o = PRIMARY_TYPE_ORDER[a.tableType] - PRIMARY_TYPE_ORDER[b.tableType];
  if (o !== 0) return o;
  return a.name.localeCompare(b.name);
}

function sortByName(a: MenuRow, b: MenuRow): number {
  return a.name.localeCompare(b.name);
}

const PAGE_SIZE = 6;

type MenuListScope = "today" | "weekdays" | "special" | "subscription" | "all";

export function MasterMenuClient() {
  const { menus, deleteMenu, setMenuActive, upsertMenu } = useMenuManagementDemo();
  const [query, setQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<MenuListScope>("today");
  const [dayFilter, setDayFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MenuRow | null>(null);
  const [subscriptionPlanEditId, setSubscriptionPlanEditId] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const focusDay = dayFilter || weekdayKeyFromDate(new Date());
  const referenceDate = useMemo(
    () => calendarDateForFocusDay(new Date(), focusDay),
    [focusDay],
  );

  const calendarLabel = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(referenceDate);
  }, [referenceDate]);

  const q = query.trim().toLowerCase();

  const matchesQuery = (m: MenuRow) => !q || m.name.toLowerCase().includes(q);

  const lunchDinnerRows = useMemo(
    () =>
      menus.filter(
        (m) => m.tableType === "lunch" || m.tableType === "dinner" || m.tableType === "both",
      ),
    [menus],
  );

  const primaryCandidateIds = useMemo(() => {
    const ids = new Set<string>();
    for (const m of lunchDinnerRows) {
      if (normalMenuAppliesToWeekday(m, focusDay)) ids.add(m.id);
    }
    for (const m of menus) {
      if (m.tableType === "special" && specialAppliesOnDate(m, referenceDate)) {
        ids.add(m.id);
      }
      if (m.tableType === "subscription" && subscriptionValidOnDate(m, referenceDate)) {
        ids.add(m.id);
      }
    }
    return ids;
  }, [lunchDinnerRows, menus, focusDay, referenceDate]);

  const filteredDisplayed = useMemo(() => {
    const base = menus.filter(matchesQuery);
    if (scopeFilter === "today") {
      return base.filter((m) => primaryCandidateIds.has(m.id)).sort(sortPrimaryRows);
    }
    if (scopeFilter === "weekdays") {
      return base
        .filter((m) => m.tableType === "lunch" || m.tableType === "dinner" || m.tableType === "both")
        .sort(sortByName);
    }
    if (scopeFilter === "special") {
      return base.filter((m) => m.tableType === "special").sort(sortByName);
    }
    if (scopeFilter === "subscription") {
      return base.filter((m) => m.tableType === "subscription").sort(sortByName);
    }
    return base.sort(sortByName);
  }, [menus, primaryCandidateIds, q, scopeFilter]);

  const resetPages = () => {
    setPage(1);
  };

  const renderPagination = (
    total: number,
    page: number,
    setPage: (n: number) => void,
  ) => {
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const sliceStart = (safePage - 1) * PAGE_SIZE;
    return {
      pageCount,
      safePage,
      sliceStart,
      footer: (
        <div className="flex flex-col gap-3 border-t border-outline-variant/10 px-6 py-4 text-sm font-semibold text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            {total === 0
              ? "Showing 0 of 0 results"
              : `Showing ${sliceStart + 1}–${Math.min(sliceStart + PAGE_SIZE, total)} of ${total} results`}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => {
              const active = n === safePage;
              return (
                <button
                  key={n}
                  type="button"
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    active
                      ? "bg-primary text-on-primary shadow-primary-soft"
                      : "bg-surface-container-high/60 text-on-surface hover:bg-surface-container-high",
                  )}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      ),
    };
  };

  const renderRows = (pageRows: MenuRow[]) =>
    pageRows.map((row) => (
      <TableRow
        key={row.id}
        className={cn(!row.active && "bg-surface-container-low/40 opacity-80")}
      >
        <TableCell>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full font-headline text-sm font-extrabold tracking-tight",
                paletteForMenuId(row.id),
              )}
              aria-hidden
            >
              {menuInitials(row.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-on-surface">{row.name}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            tone={typeTone(row.tableType)}
            className={cn(
              (row.tableType === "lunch" ||
                row.tableType === "dinner" ||
                row.tableType === "both") &&
                "bg-primary/10 text-primary ring-1 ring-primary/20",
            )}
          >
            {TYPE_LABEL[row.tableType]}
          </Badge>
        </TableCell>
        <TableCell className="font-semibold text-on-surface-variant">{row.availability}</TableCell>
        <TableCell>
          <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
            <Switch
              checked={row.active}
              onCheckedChange={(checked) => setMenuActive(row.id, checked)}
              aria-label={`${row.active ? "Deactivate" : "Activate"} ${row.name}`}
            />
            <span
              className={cn(
                "text-[10px] font-extrabold uppercase tracking-widest",
                row.active ? "text-primary" : "text-secondary",
              )}
            >
              {row.active ? "Active" : "Inactive"}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            {row.tableType === "subscription" && row.subscriptionPlanId ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-10 shrink-0 rounded-full p-0 text-secondary hover:bg-surface-container-high"
                aria-label={`Edit ${row.name} subscription plan`}
                onClick={() => setSubscriptionPlanEditId(row.subscriptionPlanId!)}
              >
                <MaterialIcon name="edit" className="text-xl" />
              </Button>
            ) : (
              <Link
                href={`/menu/${row.id}/edit`}
                className="inline-flex size-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-high"
                aria-label={`Edit ${row.name}`}
              >
                <MaterialIcon name="edit" className="text-xl" />
              </Link>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-secondary hover:text-error"
              aria-label={`Delete ${row.name}`}
              onClick={() => setDeleteTarget(row)}
            >
              <MaterialIcon name="delete" className="text-xl" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));

  const pag = renderPagination(filteredDisplayed.length, page, setPage);
  const pageRows = filteredDisplayed.slice(pag.sliceStart, pag.sliceStart + PAGE_SIZE);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMenu(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleSubscriptionDrawerSave = useCallback(
    (draft: SubscriptionMenuDraft, planId: string) => {
      const row = menus.find((m) => m.subscriptionPlanId === planId);
      if (row) upsertMenu(patchMenuRowWithSubscriptionDraft(row, draft));
    },
    [menus, upsertMenu],
  );

  return (
    <>
      <PageContainer
        title="Master Menu"
        description="Menu management"
        actions={
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
            <div className="min-w-0 flex-1 [&_label]:sr-only sm:max-w-xs">
              <Input
                label="Search"
                placeholder="Search menus…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPages();
                }}
                left={<MaterialIcon name="search" className="text-xl" />}
              />
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:w-auto">
              <div className="min-w-[160px] sm:min-w-[200px]">
                <SelectField
                  label="Menus"
                  value={scopeFilter}
                  onChange={(e) => {
                    setScopeFilter(e.target.value as MenuListScope);
                    resetPages();
                  }}
                >
                  <option value="today">Today menu</option>
                  <option value="weekdays">Weekday menus</option>
                  <option value="special">Special menus</option>
                  <option value="subscription">Subscription menus</option>
                  <option value="all">All</option>
                </SelectField>
              </div>
              {scopeFilter === "today" ? (
                <div className="min-w-[140px] sm:min-w-[160px]">
                  <SelectField
                    label="Day"
                    value={dayFilter}
                    onChange={(e) => {
                      setDayFilter(e.target.value);
                      resetPages();
                    }}
                  >
                    <option value="">Today ({weekdayKeyFromDate(new Date())})</option>
                    {WEEKDAY_KEYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </SelectField>
                </div>
              ) : null}
              <Link
                href="/menu/create"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold shadow-md transition-all active:scale-95 sm:w-auto",
                  "bg-primary text-on-primary shadow-primary-soft hover:bg-primary/90",
                )}
              >
                <MaterialIcon name="add" />
                Create menu
              </Link>
            </div>
          </div>
        }
      >
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              {scopeFilter === "today" ? (
                <>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    {dayFilter ? "Preview day" : "Today"}
                  </p>
                  <h2 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-on-surface">
                    {calendarLabel}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm font-medium text-on-surface-variant">
                    <span className="font-bold text-on-surface">{focusDay}</span> lunch and dinner, plus specials
                    running on this calendar date and subscriptions still valid. Rows are ordered lunch, dinner,
                    then promotions.
                  </p>
                </>
              ) : scopeFilter === "weekdays" ? (
                <>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Rotation</p>
                  <h2 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-on-surface">
                    Weekday menus
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm font-medium text-on-surface-variant">
                    Lunch, dinner, and combined schedules. Switch to Today menu to see what is live for a given
                    calendar day.
                  </p>
                </>
              ) : scopeFilter === "special" ? (
                <>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Promotions</p>
                  <h2 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-on-surface">
                    Special menus
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm font-medium text-on-surface-variant">
                    Date-bound specials. Use Today menu to see which ones apply on a specific day.
                  </p>
                </>
              ) : scopeFilter === "subscription" ? (
                <>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Plans</p>
                  <h2 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-on-surface">
                    Subscription menus
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm font-medium text-on-surface-variant">
                    Packaged meal plans. Use Today menu to see which subscriptions are still valid on a date.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Library</p>
                  <h2 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-on-surface">
                    All menus
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm font-medium text-on-surface-variant">
                    Every menu in this demo workspace, sorted by name.
                  </p>
                </>
              )}
            </div>
            {scopeFilter === "today" ? (
              <Badge tone="info" className="shrink-0">
                <MaterialIcon name="restaurant_menu" className="text-base" />
                Service board
              </Badge>
            ) : null}
          </div>

          <Card className="overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/10 bg-surface-container-low/40 px-5 py-4">
              <h3 className="font-headline text-lg font-extrabold tracking-tight text-on-surface">Menus</h3>
              <Badge tone="neutral">{filteredDisplayed.length} shown</Badge>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Menu</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Availability</TableHeaderCell>
                  <TableHeaderCell className="w-[140px] whitespace-nowrap">Active</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDisplayed.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm font-semibold text-secondary"
                    >
                      {scopeFilter === "today"
                        ? "No menus apply to this day. Try another day from the Day control or clear search."
                        : scopeFilter === "all"
                          ? "No menus match your search."
                          : "No menus in this category match your search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  renderRows(pageRows)
                )}
              </TableBody>
            </Table>
            {filteredDisplayed.length > 0 ? pag.footer : null}
          </Card>
        </section>
      </PageContainer>

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget ? `Delete "${deleteTarget.name}"?` : "Delete menu?"}
        description="This demo removes the menu from the in-memory list until you refresh the page."
        confirmLabel="Delete"
      />

      <Drawer
        open={subscriptionPlanEditId !== null}
        onClose={() => setSubscriptionPlanEditId(null)}
        position="right"
        className={cn(
          "flex h-full w-[min(100vw,1120px)]! max-w-[min(100vw,1120px)]! flex-col sm:rounded-l-2xl",
          "border-l border-outline-variant/15 shadow-2xl",
        )}
      >
        {subscriptionPlanEditId ? (
          <SubscriptionPlanDrawerEditor
            planId={subscriptionPlanEditId}
            onClose={() => setSubscriptionPlanEditId(null)}
            onSaveSuccess={(draft) => handleSubscriptionDrawerSave(draft, subscriptionPlanEditId)}
          />
        ) : null}
      </Drawer>
    </>
  );
}
