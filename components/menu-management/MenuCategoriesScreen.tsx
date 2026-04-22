"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { MenuCategorySection, MenuDocument } from "@/components/menu/types";
import menuDemo from "@/sandbox/menu-demo/menu-data.json";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { productMainCategories } from "@/lib/data/product-catalog";
import { buildPresetSubsectionCategoryId } from "@/lib/menu-category-form";
import {
  MENU_CATALOG_EVENT,
  loadLocalCategoryShells,
  mergeMenuWithLocal,
  removeLocalCategoryShell,
  removeLocalCategoryShellTree,
} from "@/lib/menu-local-catalog";
import { CategoryCreateModal, type CategoryEditDraft } from "./CategoryCreateModal";
import { cn } from "@/lib/cn";

function shellIdSet(): Set<string> {
  return new Set(loadLocalCategoryShells().map((s) => s.category_id));
}

function dishCountChip(itemCount: number) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        itemCount === 0
          ? "bg-surface-container-high text-secondary ring-1 ring-outline-variant/20"
          : "bg-primary/10 text-primary ring-1 ring-primary/20",
      )}
    >
      {itemCount}
    </span>
  );
}

type DeleteTarget =
  | { scope: "preset-sub" | "custom-sub"; categoryId: string; label: string }
  | { scope: "custom-main"; categoryId: string; label: string };

const tableHeadClass =
  "border-b border-outline-variant/20 bg-surface-container-low/80 text-[10px] font-extrabold uppercase tracking-widest text-secondary";

export function MenuCategoriesScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rev, setRev] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState<"category" | "subcategory">("category");
  const [editDraft, setEditDraft] = useState<CategoryEditDraft | null>(null);
  const [expandedMainIds, setExpandedMainIds] = useState<Set<string>>(() => new Set());
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditDraft(null);
    if (searchParams.get("add")) {
      router.replace("/menu/categories", { scroll: false });
    }
  }, [router, searchParams]);

  const bump = useCallback(() => setRev((n) => n + 1), []);

  useEffect(() => {
    window.addEventListener(MENU_CATALOG_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(MENU_CATALOG_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, [bump]);

  useEffect(() => {
    const add = searchParams.get("add");
    if (add === "subcategory" || add === "sub") {
      setEditDraft(null);
      setModalDefaultTab("subcategory");
      setModalOpen(true);
    } else if (add === "category") {
      setEditDraft(null);
      setModalDefaultTab("category");
      setModalOpen(true);
    }
  }, [searchParams]);

  const doc = menuDemo as MenuDocument;
  const merged = useMemo(() => mergeMenuWithLocal(doc), [doc, rev]);
  const shellIds = useMemo(() => shellIdSet(), [rev]);

  const sectionById = useMemo(() => {
    const m = new Map<string, MenuCategorySection>();
    for (const s of merged.menu) {
      m.set(s.category_id, s);
    }
    return m;
  }, [merged.menu]);

  const presetTaxonomy = useMemo(() => {
    return productMainCategories.map((main) => ({
      mainId: main.id,
      mainLabel: main.label,
      subcategories: main.subcategories.map((sub) => {
        const category_id = buildPresetSubsectionCategoryId(main.id, sub.id);
        const section = sectionById.get(category_id);
        return {
          subId: sub.id,
          subLabel: sub.label,
          category_id,
          itemCount: section?.items.length ?? 0,
          inMenu: Boolean(section),
          displayLabel: section?.category ?? `${main.label} — ${sub.label}`,
          isShell: section ? shellIds.has(category_id) : false,
        };
      }),
    }));
  }, [sectionById, shellIds]);

  const customMainGroups = useMemo(() => {
    const mains = loadLocalCategoryShells().filter((s) => s.kind === "main");
    return mains.map((shell) => {
      const mainSection = sectionById.get(shell.category_id);
      const subs = merged.menu.filter(
        (s) => s.category_id.startsWith(`${shell.category_id}_`) && s.category_id !== shell.category_id,
      );
      return {
        shell,
        mainItemCount: mainSection?.items.length ?? 0,
        subRows: subs.map((s) => ({
          category_id: s.category_id,
          category: s.category,
          itemCount: s.items.length,
          isShell: shellIds.has(s.category_id),
        })),
      };
    });
  }, [merged.menu, sectionById, shellIds]);

  const classifiedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const g of presetTaxonomy) {
      for (const row of g.subcategories) {
        ids.add(row.category_id);
      }
    }
    for (const g of customMainGroups) {
      ids.add(g.shell.category_id);
      for (const r of g.subRows) {
        ids.add(r.category_id);
      }
    }
    return ids;
  }, [presetTaxonomy, customMainGroups]);

  const otherSections = useMemo(
    () => merged.menu.filter((s) => !classifiedIds.has(s.category_id)),
    [merged.menu, classifiedIds],
  );

  const flatRows = useMemo(() => {
    const list = merged.menu.map((s) => ({
      category_id: s.category_id,
      category: s.category,
      itemCount: s.items.length,
      isShell: shellIds.has(s.category_id),
    }));
    list.sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [merged.menu, shellIds]);

  const toggleExpand = (mainId: string) => {
    setExpandedMainIds((prev) => {
      const next = new Set(prev);
      if (next.has(mainId)) next.delete(mainId);
      else next.add(mainId);
      return next;
    });
  };

  const openCreateModal = (tab: "category" | "subcategory") => {
    setEditDraft(null);
    setModalDefaultTab(tab);
    setModalOpen(true);
  };

  const openEditModal = (draft: CategoryEditDraft) => {
    setModalDefaultTab(draft.type);
    setEditDraft(draft);
    setModalOpen(true);
  };

  function runDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.scope === "custom-main") {
      removeLocalCategoryShellTree(deleteTarget.categoryId);
    } else {
      removeLocalCategoryShell(deleteTarget.categoryId);
    }
    bump();
  }

  const totalPresetSubs = presetTaxonomy.reduce((n, g) => n + g.subcategories.length, 0);

  const actionLinkClass =
    "text-xs font-bold uppercase tracking-wide text-primary underline-offset-2 hover:underline disabled:pointer-events-none disabled:opacity-40";

  return (
    <PageContainer
      title="Categories"
      description={
        <span className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
          <Link href="/menu" className="transition-colors hover:text-primary">
            Menu
          </Link>
          <span aria-hidden>/</span>
          <Link href="/menu/item-list" className="transition-colors hover:text-primary">
            Product list
          </Link>
          <span aria-hidden>/</span>
          <span className="text-primary">Categories</span>
        </span>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="md" onClick={() => openCreateModal("subcategory")}>
            <MaterialIcon name="account_tree" className="text-xl" />
            New subcategory
          </Button>
          <Button type="button" variant="primary" size="md" onClick={() => openCreateModal("category")}>
            <MaterialIcon name="add" className="text-xl" />
            New category
          </Button>
        </div>
      }
    >
      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={runDelete}
        title={deleteTarget ? `Delete “${deleteTarget.label}”?` : "Delete?"}
        description={
          deleteTarget?.scope === "custom-main"
            ? "Removes this custom main and any nested local sub-section shells. Products in local storage that still reference these ids are not changed."
            : "Removes this local empty-section shell if present. Products already filed under this section id are not removed."
        }
        confirmLabel="Delete"
      />

      <CategoryCreateModal
        open={modalOpen}
        onClose={closeModal}
        defaultTab={modalDefaultTab}
        editDraft={editDraft}
        onSaved={bump}
      />

      <div className="space-y-8">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-outline-variant/10 bg-surface-container-low/40 px-5 py-4 sm:px-6">
            <h2 className="font-headline text-base font-bold text-on-surface sm:text-lg">
              Catalog groups &amp; subcategories
            </h2>
            <p className="mt-1 text-sm font-medium text-secondary">
              Click a row to expand nested subcategories. Edit updates the display label for local
              shells ({totalPresetSubs} preset sub-slots). Delete only applies to rows you added
              locally (shells).
            </p>
          </div>
          <Table>
            <TableHead className={tableHeadClass}>
              <TableRow className="hover:bg-transparent">
                <TableHeaderCell className="w-10 px-4 py-3 sm:px-5" />
                <TableHeaderCell className="px-4 py-3 sm:px-5">Category</TableHeaderCell>
                <TableHeaderCell className="hidden px-4 py-3 sm:table-cell sm:px-5 md:table-cell">
                  Id
                </TableHeaderCell>
                <TableHeaderCell className="px-4 py-3 text-center sm:px-5">Subs</TableHeaderCell>
                <TableHeaderCell className="hidden px-4 py-3 text-center sm:table-cell sm:px-5">
                  In menu
                </TableHeaderCell>
                <TableHeaderCell className="w-[140px] px-4 py-3 text-right sm:px-5">
                  Actions
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y divide-outline-variant/10">
              {presetTaxonomy.map((group) => {
                const expanded = expandedMainIds.has(`preset:${group.mainId}`);
                const inMenuCount = group.subcategories.filter((s) => s.inMenu).length;
                return (
                  <Fragment key={`preset:${group.mainId}`}>
                    <TableRow
                      className="cursor-pointer hover:bg-surface-container-low/50"
                      onClick={() => toggleExpand(`preset:${group.mainId}`)}
                    >
                      <TableCell className="px-4 py-3 sm:px-5">
                        <MaterialIcon
                          name="expand_more"
                          className={cn(
                            "text-secondary transition-transform duration-200",
                            expanded && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 sm:px-5">
                        <p className="font-headline text-sm font-bold text-on-surface">{group.mainLabel}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-secondary sm:hidden">
                          {group.mainId}
                        </p>
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 font-mono text-xs text-secondary sm:table-cell sm:px-5">
                        {group.mainId}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center sm:px-5">
                        {group.subcategories.length}
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 text-center sm:table-cell sm:px-5">
                        {inMenuCount}
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 text-right sm:px-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[11px] font-semibold text-secondary">Preset</span>
                      </TableCell>
                    </TableRow>
                    {expanded ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={6} className="bg-surface-container-low/30 p-0 px-0 py-0">
                          <Table>
                            <TableHead className={cn(tableHeadClass, "bg-surface-container-low/60")}>
                              <TableRow className="hover:bg-transparent">
                                <TableHeaderCell className="px-6 py-2 ps-10 sm:ps-14">
                                  Subcategory
                                </TableHeaderCell>
                                <TableHeaderCell className="hidden py-2 md:table-cell">Section id</TableHeaderCell>
                                <TableHeaderCell className="py-2 text-center">Dishes</TableHeaderCell>
                                <TableHeaderCell className="py-2 text-center">Status</TableHeaderCell>
                                <TableHeaderCell className="w-[120px] py-2 text-right">Actions</TableHeaderCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {group.subcategories.map((sub) => (
                                <TableRow key={sub.subId} className="hover:bg-surface-container-low/40">
                                  <TableCell className="px-6 py-3 ps-10 sm:ps-14">
                                    <p className="text-sm font-bold text-on-surface">{sub.subLabel}</p>
                                    <p className="mt-1 font-mono text-[10px] text-secondary md:hidden">
                                      {sub.category_id}
                                    </p>
                                  </TableCell>
                                  <TableCell className="hidden py-3 font-mono text-[11px] text-secondary md:table-cell">
                                    {sub.category_id}
                                  </TableCell>
                                  <TableCell className="py-3 text-center">{dishCountChip(sub.itemCount)}</TableCell>
                                  <TableCell className="py-3 text-center">
                                    {sub.inMenu ? (
                                      <Badge tone="success" className="text-[10px]">
                                        In menu
                                      </Badge>
                                    ) : (
                                      <Badge tone="neutral" className="text-[10px]">
                                        —
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="py-3 text-right">
                                    <div className="flex flex-wrap justify-end gap-x-2 gap-y-1">
                                      <button
                                        type="button"
                                        className={actionLinkClass}
                                        onClick={() =>
                                          openEditModal({
                                            type: "subcategory",
                                            categoryId: sub.category_id,
                                            displayLabel: sub.displayLabel,
                                            parentId: group.mainId,
                                          })
                                        }
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        className={actionLinkClass}
                                        disabled={!sub.isShell}
                                        onClick={() =>
                                          setDeleteTarget({
                                            scope: "preset-sub",
                                            categoryId: sub.category_id,
                                            label: sub.subLabel,
                                          })
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}

              {customMainGroups.map(({ shell, mainItemCount, subRows }) => {
                const rowKey = `custom:${shell.category_id}`;
                const expanded = expandedMainIds.has(rowKey);
                const subsWithDishes = subRows.filter((r) => r.itemCount > 0).length;
                const inMenuDisplay =
                  subsWithDishes + (mainItemCount > 0 && subRows.length === 0 ? 1 : 0);
                return (
                  <Fragment key={rowKey}>
                    <TableRow
                      className="cursor-pointer hover:bg-surface-container-low/50"
                      onClick={() => toggleExpand(rowKey)}
                    >
                      <TableCell className="px-4 py-3 sm:px-5">
                        <MaterialIcon
                          name="expand_more"
                          className={cn(
                            "text-secondary transition-transform duration-200",
                            expanded && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3 sm:px-5">
                        <p className="font-headline text-sm font-bold text-on-surface">{shell.category}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-secondary sm:hidden">
                          {shell.category_id}
                        </p>
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 font-mono text-xs text-secondary sm:table-cell sm:px-5">
                        {shell.category_id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center sm:px-5">{subRows.length}</TableCell>
                      <TableCell className="hidden px-4 py-3 text-center sm:table-cell sm:px-5">
                        {inMenuDisplay}
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 text-right sm:px-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-wrap justify-end gap-x-2 gap-y-1">
                          <button
                            type="button"
                            className={actionLinkClass}
                            onClick={() =>
                              openEditModal({
                                type: "category",
                                categoryId: shell.category_id,
                                displayLabel: shell.category,
                              })
                            }
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={actionLinkClass}
                            onClick={() =>
                              setDeleteTarget({
                                scope: "custom-main",
                                categoryId: shell.category_id,
                                label: shell.category,
                              })
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expanded ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={6} className="bg-surface-container-low/30 p-0">
                          {subRows.length === 0 ? (
                            <p className="px-6 py-4 ps-10 text-sm text-secondary sm:ps-14">
                              No sub-sections yet. Use <strong className="text-on-surface">New subcategory</strong>{" "}
                              with this main as parent.
                            </p>
                          ) : (
                            <Table>
                              <TableHead className={cn(tableHeadClass, "bg-surface-container-low/60")}>
                                <TableRow className="hover:bg-transparent">
                                  <TableHeaderCell className="px-6 py-2 ps-10 sm:ps-14">
                                    Subcategory
                                  </TableHeaderCell>
                                  <TableHeaderCell className="hidden py-2 md:table-cell">Section id</TableHeaderCell>
                                  <TableHeaderCell className="py-2 text-center">Dishes</TableHeaderCell>
                                  <TableHeaderCell className="py-2 text-center">Status</TableHeaderCell>
                                  <TableHeaderCell className="w-[120px] py-2 text-right">Actions</TableHeaderCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {subRows.map((row) => (
                                  <TableRow key={row.category_id} className="hover:bg-surface-container-low/40">
                                    <TableCell className="px-6 py-3 ps-10 sm:ps-14">
                                      <p className="text-sm font-bold text-on-surface">{row.category}</p>
                                      <p className="mt-1 font-mono text-[10px] text-secondary md:hidden">
                                        {row.category_id}
                                      </p>
                                    </TableCell>
                                    <TableCell className="hidden py-3 font-mono text-[11px] text-secondary md:table-cell">
                                      {row.category_id}
                                    </TableCell>
                                    <TableCell className="py-3 text-center">{dishCountChip(row.itemCount)}</TableCell>
                                    <TableCell className="py-3 text-center">
                                      <Badge tone="info" className="text-[10px]">
                                        Custom
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 text-right">
                                      <div className="flex flex-wrap justify-end gap-x-2 gap-y-1">
                                        <button
                                          type="button"
                                          className={actionLinkClass}
                                          onClick={() =>
                                            openEditModal({
                                              type: "subcategory",
                                              categoryId: row.category_id,
                                              displayLabel: row.category,
                                              parentId: shell.category_id,
                                            })
                                          }
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          className={actionLinkClass}
                                          disabled={!row.isShell}
                                          onClick={() =>
                                            setDeleteTarget({
                                              scope: "custom-sub",
                                              categoryId: row.category_id,
                                              label: row.category,
                                            })
                                          }
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {otherSections.length > 0 ? (
          <Card className="overflow-hidden p-0">
            <div className="border-b border-outline-variant/10 px-5 py-4 sm:px-6">
              <h2 className="font-headline text-base font-bold text-on-surface sm:text-lg">
                Other menu sections
              </h2>
              <p className="mt-1 text-sm font-medium text-secondary">
                Demo JSON / legacy ids ({otherSections.length}) — not part of the preset grid above.
              </p>
            </div>
            <Table>
              <TableHead className={tableHeadClass}>
                <TableRow className="hover:bg-transparent">
                  <TableHeaderCell className="px-5 py-3">Section</TableHeaderCell>
                  <TableHeaderCell className="hidden py-3 md:table-cell">Id</TableHeaderCell>
                  <TableHeaderCell className="py-3 text-center">Dishes</TableHeaderCell>
                  <TableHeaderCell className="w-[100px] py-3 text-right"> </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otherSections.map((s) => (
                  <TableRow key={s.category_id}>
                    <TableCell className="px-5 py-3">
                      <p className="font-headline text-sm font-bold text-on-surface">{s.category}</p>
                      <p className="mt-1 font-mono text-[10px] text-secondary md:hidden">{s.category_id}</p>
                    </TableCell>
                    <TableCell className="hidden py-3 font-mono text-xs text-secondary md:table-cell">
                      {s.category_id}
                    </TableCell>
                    <TableCell className="py-3 text-center">{dishCountChip(s.items.length)}</TableCell>
                    <TableCell className="py-3 text-right">
                      <span className="text-[11px] font-semibold text-secondary">—</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : null}

        {flatRows.length === 0 ? (
          <Card className="p-10 text-center">
            <MaterialIcon
              name="folder_off"
              className="mx-auto text-5xl text-outline-variant"
              aria-hidden
            />
            <p className="mt-4 font-headline text-lg font-bold text-on-surface">No categories yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-secondary">
              Add a top-level category or a subcategory from the toolbar.
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="border-b border-outline-variant/10 px-5 py-4 sm:px-6">
              <h2 className="font-headline text-base font-bold text-on-surface sm:text-lg">
                All sections (flat)
              </h2>
              <p className="text-sm font-medium text-on-surface-variant">
                {flatRows.length} merged section{flatRows.length === 1 ? "" : "s"}.
              </p>
            </div>
            <Table>
              <TableHead className={tableHeadClass}>
                <TableRow className="hover:bg-transparent">
                  <TableHeaderCell className="px-5 py-3">Section</TableHeaderCell>
                  <TableHeaderCell className="hidden py-3 md:table-cell">Id</TableHeaderCell>
                  <TableHeaderCell className="py-3 text-center">Dishes</TableHeaderCell>
                  <TableHeaderCell className="py-3 text-right">Shell</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flatRows.map((row) => (
                  <TableRow key={row.category_id}>
                    <TableCell className="px-5 py-3">
                      <p className="font-headline text-sm font-bold text-on-surface">{row.category}</p>
                      <p className="mt-1 font-mono text-[10px] text-secondary md:hidden">{row.category_id}</p>
                    </TableCell>
                    <TableCell className="hidden py-3 font-mono text-xs text-secondary md:table-cell">
                      {row.category_id}
                    </TableCell>
                    <TableCell className="py-3 text-center">{dishCountChip(row.itemCount)}</TableCell>
                    <TableCell className="py-3 text-right">
                      {row.isShell ? (
                        <Badge tone="info" className="text-[10px]">
                          Local
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-secondary">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
