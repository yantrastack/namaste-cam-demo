"use client";

import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { productMainCategories } from "@/lib/data/product-catalog";
import {
  MENU_CATALOG_EVENT,
  loadLocalCategoryShells,
  upsertLocalCategoryShell,
} from "@/lib/menu-local-catalog";
import { buildMainCategoryId, buildSubcategorySectionId } from "@/lib/menu-category-form";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-xl border-none bg-surface px-4 py-3.5 font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary";

const controlSm =
  "w-full rounded-xl border-none bg-surface px-3 py-2.5 text-sm font-medium text-on-surface outline-none ring-1 ring-outline-variant/20 transition-all focus:ring-2 focus:ring-primary";

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

type Tab = "category" | "subcategory";

type ParentOption = { id: string; label: string };

export type CategoryEditDraft = {
  type: "category" | "subcategory";
  categoryId: string;
  /** Current section title in the menu */
  displayLabel: string;
  /** Preset main id (e.g. mains) or custom main shell id — required for subcategory */
  parentId?: string;
};

export type CategoryCreateModalProps = {
  open: boolean;
  onClose: () => void;
  defaultTab?: Tab;
  onSaved?: () => void;
  /** When set, modal edits this row (fixed id; tabs hidden). */
  editDraft?: CategoryEditDraft | null;
};

export function CategoryCreateModal({
  open,
  onClose,
  defaultTab = "category",
  onSaved,
  editDraft = null,
}: CategoryCreateModalProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [shellRev, setShellRev] = useState(0);
  const [editFixedCategoryId, setEditFixedCategoryId] = useState<string | null>(null);

  const [catName, setCatName] = useState("");
  const [catKey, setCatKey] = useState("");
  const [catNotes, setCatNotes] = useState("");

  const [parentId, setParentId] = useState<string>(() => productMainCategories[0]?.id ?? "");
  const [subName, setSubName] = useState("");
  const [subKey, setSubKey] = useState("");
  const [subNotes, setSubNotes] = useState("");

  useEffect(() => {
    const bump = () => setShellRev((n) => n + 1);
    window.addEventListener(MENU_CATALOG_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(MENU_CATALOG_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    if (editDraft) {
      setTab(editDraft.type);
      setEditFixedCategoryId(editDraft.categoryId);
      setCatNotes("");
      setSubNotes("");
      if (editDraft.type === "category") {
        setCatName(editDraft.displayLabel);
        setCatKey("");
        setSubName("");
        setSubKey("");
        setParentId(productMainCategories[0]?.id ?? "");
      } else {
        setCatName("");
        setCatKey("");
        const pid = editDraft.parentId ?? productMainCategories[0]?.id ?? "";
        setParentId(pid);
        const sep = " — ";
        const label = editDraft.displayLabel;
        const subPart = label.includes(sep)
          ? (label.split(sep).pop() ?? label).trim()
          : label.trim();
        setSubName(subPart);
        setSubKey("");
      }
      return;
    }
    setEditFixedCategoryId(null);
    setTab(defaultTab);
    setCatName("");
    setCatKey("");
    setCatNotes("");
    setSubName("");
    setSubKey("");
    setSubNotes("");
    setParentId(productMainCategories[0]?.id ?? "");
  }, [open, defaultTab, editDraft]);

  const parentOptions = useMemo((): ParentOption[] => {
    const preset: ParentOption[] = productMainCategories.map((c) => ({
      id: c.id,
      label: c.label,
    }));
    const localMains = loadLocalCategoryShells()
      .filter((s) => s.kind === "main")
      .map((s) => ({ id: s.category_id, label: `${s.category} (custom)` }));
    const seen = new Set(preset.map((p) => p.id));
    const merged = [...preset];
    for (const row of localMains) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      merged.push(row);
    }
    return merged;
  }, [shellRev]);

  useEffect(() => {
    if (!open) return;
    if (!parentOptions.some((p) => p.id === parentId) && parentOptions[0]) {
      setParentId(parentOptions[0].id);
    }
  }, [open, parentOptions, parentId]);

  const parentLabel = parentOptions.find((p) => p.id === parentId)?.label ?? parentId;

  const mainIdPreview = useMemo(() => {
    if (editFixedCategoryId && tab === "category") return editFixedCategoryId;
    return buildMainCategoryId(catName, catKey);
  }, [editFixedCategoryId, tab, catName, catKey]);

  const subIdPreview = useMemo(() => {
    if (editFixedCategoryId && tab === "subcategory") return editFixedCategoryId;
    const source = subName.trim() || subKey.trim() || "subcategory";
    return buildSubcategorySectionId(parentId, source);
  }, [editFixedCategoryId, tab, parentId, subName, subKey]);

  const subTitlePreview = useMemo(() => {
    const base = parentLabel.replace(/\s*\(custom\)\s*$/, "");
    const sub = subName.trim() || subKey.trim() || "Subcategory";
    return `${base} — ${sub}`;
  }, [parentLabel, subName, subKey]);

  function handleSave() {
    if (tab === "category") {
      const label = catName.trim() || "Untitled category";
      const category_id = mainIdPreview;
      upsertLocalCategoryShell({
        category_id,
        category: label,
        kind: "main",
      });
      console.info(editDraft ? "update category" : "save category", {
        category_id,
        category: label,
        description: catNotes.trim() || undefined,
      });
    } else {
      const category_id = subIdPreview;
      upsertLocalCategoryShell({
        category_id,
        category: subTitlePreview,
      });
      console.info(editDraft ? "update subcategory" : "save subcategory", {
        category_id,
        category: subTitlePreview,
        parentId,
        description: subNotes.trim() || undefined,
      });
    }
    onSaved?.();
    onClose();
  }

  const isEdit = Boolean(editDraft);

  const modalShellClass =
    "flex max-h-[min(90dvh,920px)] w-[min(80vw,72rem)] max-w-none flex-col overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-2xl";

  return (
    <Modal open={open} onClose={onClose} unpadded className={modalShellClass}>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-outline-variant/15 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-headline text-lg font-bold tracking-tight text-on-surface sm:text-xl">
              {isEdit ? "Edit category" : "Add category"}
            </h2>
            <p className="mt-1 text-sm font-medium text-secondary">
              {isEdit
                ? "Update the display name. The stored category id stays the same."
                : "Create a top-level section or a sub-section under an existing group."}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full p-2 text-outline-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            aria-label="Close"
            onClick={onClose}
          >
            <MaterialIcon name="close" className="text-2xl" />
          </button>
        </div>

        {!isEdit ? (
          <div className="flex shrink-0 gap-2 border-b border-outline-variant/10 px-5 py-3 sm:px-6">
            <Button
              type="button"
              size="sm"
              variant={tab === "category" ? "primary" : "outline"}
              className="!rounded-full"
              onClick={() => setTab("category")}
            >
              <MaterialIcon name="folder" className="text-lg" />
              Top-level category
            </Button>
            <Button
              type="button"
              size="sm"
              variant={tab === "subcategory" ? "primary" : "outline"}
              className="!rounded-full"
              onClick={() => setTab("subcategory")}
            >
              <MaterialIcon name="account_tree" className="text-lg" />
              Subcategory
            </Button>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {tab === "category" ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <Card className="p-5 md:p-6 lg:col-span-7">
                <div className="mb-5 flex items-center gap-2">
                  <MaterialIcon name="folder" className="text-xl text-primary" />
                  <h3 className="font-headline text-base font-bold text-on-surface">Details</h3>
                </div>
                <div className="space-y-5">
                  <Input
                    label="Category name"
                    name="categoryName"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Weekend specials"
                    required
                  />
                  <div>
                    <Input
                      label="Internal key (optional)"
                      name="categoryKey"
                      value={catKey}
                      onChange={(e) => setCatKey(e.target.value)}
                      placeholder="Leave blank to derive from the name"
                      disabled={Boolean(editFixedCategoryId && tab === "category")}
                    />
                    <p className="mt-2 text-[11px] font-medium text-secondary">
                      {editFixedCategoryId && tab === "category"
                        ? "Category id is fixed while editing."
                        : "Normalized into the stored category id (max 48 characters)."}
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Notes for staff (optional)</FieldLabel>
                    <textarea
                      className={cn(control, "min-h-[5rem] resize-y")}
                      rows={3}
                      value={catNotes}
                      onChange={(e) => setCatNotes(e.target.value)}
                      placeholder="Internal notes until an API is connected…"
                      aria-label="Staff notes"
                    />
                  </div>
                </div>
              </Card>
              <Card className="h-fit p-5 md:p-6 lg:col-span-5">
                <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Preview
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Section title
                    </dt>
                    <dd className="mt-1 font-headline font-bold text-on-surface">
                      {catName.trim() || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Category id
                    </dt>
                    <dd className="mt-1 break-all font-mono text-xs font-semibold text-primary">
                      {mainIdPreview}
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <Card className="p-5 md:p-6 lg:col-span-7">
                <div className="mb-5 flex items-center gap-2">
                  <MaterialIcon name="account_tree" className="text-xl text-primary" />
                  <h3 className="font-headline text-base font-bold text-on-surface">Details</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <FieldLabel requiredMark>Parent category</FieldLabel>
                    <select
                      className={controlSm}
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      aria-label="Parent category"
                      disabled={Boolean(editFixedCategoryId && tab === "subcategory")}
                    >
                      {parentOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-[11px] font-medium text-secondary">
                      Preset groups match the new product form; custom mains you added appear here.
                    </p>
                  </div>
                  <Input
                    label="Subcategory name"
                    name="subcategoryName"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="e.g. House thalis"
                    required
                  />
                  <div>
                    <Input
                      label="Slug segment (optional)"
                      name="subcategoryKey"
                      value={subKey}
                      onChange={(e) => setSubKey(e.target.value)}
                      placeholder="Overrides the id segment from the name"
                      disabled={Boolean(editFixedCategoryId && tab === "subcategory")}
                    />
                  </div>
                  <div>
                    <FieldLabel>Notes for staff (optional)</FieldLabel>
                    <textarea
                      className={cn(control, "min-h-[5rem] resize-y")}
                      rows={3}
                      value={subNotes}
                      onChange={(e) => setSubNotes(e.target.value)}
                      placeholder="Internal notes until an API is connected…"
                      aria-label="Staff notes"
                    />
                  </div>
                </div>
              </Card>
              <Card className="h-fit p-5 md:p-6 lg:col-span-5">
                <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Preview
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      List heading
                    </dt>
                    <dd className="mt-1 font-headline font-bold text-on-surface">{subTitlePreview}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Category id
                    </dt>
                    <dd className="mt-1 break-all font-mono text-xs font-semibold text-primary">
                      {subIdPreview}
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-outline-variant/15 bg-surface-container-low/40 px-5 py-4 sm:px-6">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" size="md" onClick={handleSave}>
            <MaterialIcon name="save" className="text-xl" />
            {isEdit
              ? "Save changes"
              : tab === "category"
                ? "Save category"
                : "Save subcategory"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
