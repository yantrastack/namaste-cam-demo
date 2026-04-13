"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
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
import { WEEKDAY_KEYS, type MenuRow, type TableMenuType } from "./model";

const TYPE_LABEL: Record<TableMenuType, string> = {
  lunch: "Lunch",
  dinner: "Dinner",
  special: "Special",
  subscription: "Subscription",
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

function menuMatchesDayFilter(row: MenuRow, dayFilter: string): boolean {
  if (!dayFilter) return true;
  const days = row.normalDetails?.days;
  if (days?.length) {
    const coversAllWeek = days.length >= 7;
    return coversAllWeek || days.includes(dayFilter);
  }
  if (row.tableType === "special" || row.tableType === "subscription") {
    return true;
  }
  return false;
}

export function MasterMenuClient() {
  const { menus, deleteMenu, setMenuActive } = useMenuManagementDemo();
  const [query, setQuery] = useState("");
  const [mealFilter, setMealFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MenuRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menus.filter((m) => {
      if (q && !m.name.toLowerCase().includes(q)) return false;
      if (mealFilter && m.tableType !== mealFilter) return false;
      if (!menuMatchesDayFilter(m, dayFilter)) return false;
      return true;
    });
  }, [menus, query, mealFilter, dayFilter]);

  const pageSize = 6;
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const sliceStart = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(sliceStart, sliceStart + pageSize);

  const resetPage = () => setPage(1);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMenu(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <>
      <PageContainer
        title="Master Menu"
        description="Manage inventory, categories, and promotions"
        actions={
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
            <div className="min-w-0 flex-1 [&_label]:sr-only sm:max-w-xs">
              <Input
                label="Search"
                placeholder="Search menus…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPage();
                }}
                left={<MaterialIcon name="search" className="text-xl" />}
              />
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:w-auto">
              <div className="min-w-[160px] sm:min-w-[180px]">
                <SelectField
                  label="Meal"
                  value={mealFilter}
                  onChange={(e) => {
                    setMealFilter(e.target.value);
                    resetPage();
                  }}
                >
                  <option value="">All types</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="special">Special</option>
                  <option value="subscription">Subscription</option>
                </SelectField>
              </div>
              <div className="min-w-[140px] sm:min-w-[160px]">
                <SelectField
                  label="Day"
                  value={dayFilter}
                  onChange={(e) => {
                    setDayFilter(e.target.value);
                    resetPage();
                  }}
                >
                  <option value="">All days</option>
                  {WEEKDAY_KEYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </SelectField>
              </div>
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
        <Card className="overflow-hidden p-0">
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
              {pageRows.map((row) => (
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
                        (row.tableType === "lunch" || row.tableType === "dinner") &&
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
                      <Link
                        href={`/menu/${row.id}/edit`}
                        className="inline-flex size-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-stone-100"
                        aria-label={`Edit ${row.name}`}
                      >
                        <MaterialIcon name="edit" className="text-xl" />
                      </Link>
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
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 border-t border-outline-variant/10 px-6 py-4 text-sm font-semibold text-secondary sm:flex-row sm:items-center sm:justify-between">
            <p>
              {filtered.length === 0
                ? "Showing 0 of 0 results"
                : `Showing ${sliceStart + 1}–${Math.min(sliceStart + pageSize, filtered.length)} of ${filtered.length} results`}
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
        </Card>
      </PageContainer>

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget ? `Delete "${deleteTarget.name}"?` : "Delete menu?"}
        description="This demo removes the menu from the in-memory list until you refresh the page."
        confirmLabel="Delete"
      />
    </>
  );
}
