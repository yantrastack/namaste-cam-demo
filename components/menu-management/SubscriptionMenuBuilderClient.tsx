"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import type { SubscriptionMenuRecord } from "./initial-demo-subscriptions";
import { useMenuManagementDemo } from "./MenuManagementDemoContext";
import {
  subscriptionDemoFoodItems,
  type SubscriptionComboSection,
  type SubscriptionDemoFoodItem,
  type SubscriptionMenuDraft,
  type SubscriptionSelectionType,
} from "./subscription-menu-model";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneSections(sections: SubscriptionComboSection[]): SubscriptionComboSection[] {
  return sections.map((s) => ({
    ...s,
    items: [...s.items],
  }));
}

function maxSelectable(section: SubscriptionComboSection): number {
  if (section.selectionType === "single") return 1;
  return Math.max(1, section.maxSelection);
}

function normalizeSectionMeta(section: SubscriptionComboSection): SubscriptionComboSection {
  return {
    ...section,
    maxSelection: Math.max(1, Math.min(20, section.maxSelection)),
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function cloneMenuDraft(menu: SubscriptionMenuDraft): SubscriptionMenuDraft {
  return {
    ...menu,
    sections: cloneSections(menu.sections),
  };
}

type SubscriptionMenuFormBodyProps = {
  editId: string | null;
  seedMenu: SubscriptionMenuDraft | null;
  subscriptions: SubscriptionMenuRecord[];
  addSubscription: (menu: SubscriptionMenuDraft) => void;
  updateSubscription: (id: string, menu: SubscriptionMenuDraft) => void;
};

function SubscriptionMenuFormBody({
  editId,
  seedMenu,
  subscriptions,
  addSubscription,
  updateSubscription,
}: SubscriptionMenuFormBodyProps) {
  const [name, setName] = useState(() => seedMenu?.name ?? "");
  const [totalDays, setTotalDays] = useState<7 | 15 | 30>(() => seedMenu?.totalDays ?? 7);
  const [expiry, setExpiry] = useState(() => seedMenu?.expiry ?? "");
  const [price, setPrice] = useState(() => seedMenu?.price ?? "");
  const [discount, setDiscount] = useState(() => seedMenu?.discount ?? "");
  const [bannerText, setBannerText] = useState(() => seedMenu?.bannerText ?? "");
  const [bannerImage, setBannerImage] = useState<string | null>(() => seedMenu?.bannerImage ?? null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const bannerUploadId = useId();

  const [sections, setSections] = useState<SubscriptionComboSection[]>(() =>
    seedMenu ? cloneSections(seedMenu.sections) : [],
  );

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = () => {
    const menu: SubscriptionMenuDraft = {
      name,
      totalDays,
      expiry,
      price,
      discount,
      bannerText,
      bannerImage,
      sections: cloneSections(sections),
    };
    const label = name.trim() || "Untitled";

    if (editId) {
      const exists = subscriptions.some((s) => s.id === editId);
      if (!exists) {
        setSaveMessage(
          "This subscription link is no longer valid. Use Create menu to pick a plan, or remove ?edit= from the URL.",
        );
        setTimeout(() => setSaveMessage(null), 6000);
        return;
      }
      updateSubscription(editId, menu);
      setSaveMessage(`“${label}” saved. Changes sync to Create menu and your browser storage.`);
    } else {
      addSubscription(menu);
      setSaveMessage(`“${label}” added to your subscription plans (Create menu + browser storage).`);
    }
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <>
      <button
        type="button"
        id="subscription-builder-save"
        className="sr-only"
        tabIndex={-1}
        onClick={handleSave}
      >
        Save
      </button>
      {saveMessage ? (
        <p
          role="status"
          className="rounded-xl bg-secondary-container/40 px-4 py-3 text-sm font-semibold text-on-secondary-container ring-1 ring-outline-variant/15"
        >
          {saveMessage}
        </p>
      ) : null}

      <Card className="p-6">
        <h2 className="font-headline text-lg font-extrabold text-on-surface">Basic details</h2>
        <p className="mt-1 text-sm font-medium text-on-surface-variant">
          Name your plan, set duration and pricing.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Input
            label="Subscription name"
            name="subName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Office lunch — veg"
          />
          <SelectField
            label="Number of days"
            name="totalDays"
            value={String(totalDays)}
            onChange={(e) => setTotalDays(Number(e.target.value) as 7 | 15 | 30)}
          >
            <option value="7">7 days</option>
            <option value="15">15 days</option>
            <option value="30">30 days</option>
          </SelectField>
          <Input label="Expiry date" name="expiry" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          <Input
            label="Price (₹)"
            name="price"
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="2999"
          />
          <Input
            label="Discount (optional)"
            name="discount"
            type="number"
            min={0}
            step={1}
            hint="Flat amount or leave empty."
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="0"
          />
          <Input
            label="Banner text"
            name="bannerText"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            placeholder='e.g. "Monthly Meal Deal"'
          />
          <div className="md:col-span-2">
            <p className="ml-1 text-sm font-bold text-on-surface">Banner image</p>
            <p className="ml-1 mt-1 text-xs text-secondary">
              Optional cover for this plan. Included in browser storage with the rest of the plan.
            </p>
            <input
              ref={bannerFileInputRef}
              id={bannerUploadId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file || !file.type.startsWith("image/")) return;
                try {
                  const dataUrl = await readFileAsDataUrl(file);
                  setBannerImage(dataUrl);
                } catch {
                  /* ignore read errors in demo */
                }
              }}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => bannerFileInputRef.current?.click()}
              >
                <MaterialIcon name="upload" className="text-xl" />
                Upload image
              </Button>
              {bannerImage ? (
                <Button type="button" variant="ghost" size="md" onClick={() => setBannerImage(null)}>
                  Remove image
                </Button>
              ) : null}
            </div>
            {bannerImage ? (
              <div className="relative mt-4 aspect-[21/9] w-full max-w-2xl overflow-hidden rounded-xl bg-surface-container-high ring-1 ring-outline-variant/15">
                <img src={bannerImage} alt="Banner preview" className="size-full object-cover" />
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-headline text-lg font-extrabold text-on-surface">Combo sections</h2>
        <p className="mt-1 text-sm font-medium text-on-surface-variant">
          Build a dish pool per section; subscribers only pick up to the limit you set. Repeats each day of this{" "}
          {totalDays}-day plan.
        </p>
        <div className="mt-6">
          <ComboSectionsEditor
            sections={sections}
            foodItems={subscriptionDemoFoodItems}
            onSectionsChange={setSections}
          />
        </div>
      </Card>
    </>
  );
}

export function SubscriptionMenuBuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { subscriptions, addSubscription, updateSubscription } = useMenuManagementDemo();

  const seedMenu = useMemo(() => {
    if (!editId) return null;
    const rec = subscriptions.find((s) => s.id === editId);
    return rec ? cloneMenuDraft(rec.menu) : null;
  }, [editId, subscriptions]);

  const editLinkBroken = Boolean(editId && !seedMenu);
  const isEditing = Boolean(editId && seedMenu);
  const formMountKey = editId ?? "__create__";

  const handleCancel = () => {
    router.push("/menu");
  };

  return (
    <PageContainer
      title={isEditing ? "Edit subscription menu" : "Create subscription menu"}
      description="Plans are saved in this browser (localStorage). Use ?edit=id from Create menu to edit an existing plan."
      breadcrumbs={
        <nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
          <Link href="/menu" className="text-sm font-semibold text-secondary transition-colors hover:text-primary">
            Menu
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" aria-hidden />
          <Link href="/menu/create" className="text-sm font-semibold text-secondary transition-colors hover:text-primary">
            Create menu
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" aria-hidden />
          <span
            className={
              isEditing ? "text-sm font-semibold text-primary" : "text-sm font-semibold text-on-surface"
            }
            aria-current="page"
          >
            {isEditing ? "Edit subscription" : "Subscription builder"}
          </span>
        </nav>
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="md" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={editLinkBroken}
            onClick={() => document.getElementById("subscription-builder-save")?.click()}
          >
            <MaterialIcon name="save" className="text-xl" />
            {isEditing ? "Save changes" : "Save subscription"}
          </Button>
        </div>
      }
    >
      {editLinkBroken ? (
        <p
          role="alert"
          className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 ring-1 ring-amber-200"
        >
          No subscription matches this link.{" "}
          <Link href="/menu/create/subscription" className="font-bold text-primary underline">
            Start a new plan
          </Link>{" "}
          or open it from Menu → Create menu.
        </p>
      ) : null}

      <SubscriptionMenuFormBody
        key={formMountKey}
        editId={editId}
        seedMenu={seedMenu}
        subscriptions={subscriptions}
        addSubscription={addSubscription}
        updateSubscription={updateSubscription}
      />

      {subscriptions.length > 0 ? (
        <Card className="p-6">
          <h2 className="font-headline text-lg font-extrabold text-on-surface">Your subscription plans</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Newest first. Stored in this browser. Toggle outlets on Create menu.
          </p>
          <ul className="mt-4 space-y-3">
            {[...subscriptions]
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-container-high/30 px-4 py-3 ring-1 ring-outline-variant/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-on-surface">{s.menu.name.trim() || "Untitled"}</p>
                    <p className="text-xs font-medium text-secondary">
                      {s.menu.totalDays} days · Outlets {s.active ? "on" : "off"}
                      {s.createdAt > 0 ? ` · ${new Date(s.createdAt).toLocaleString()}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Badge tone={s.active ? "success" : "neutral"}>{s.menu.sections.length} section(s)</Badge>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/menu/create/subscription?edit=${encodeURIComponent(s.id)}`)
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      ) : null}
    </PageContainer>
  );
}

type ComboSectionsEditorProps = {
  sections: SubscriptionComboSection[];
  foodItems: readonly SubscriptionDemoFoodItem[];
  onSectionsChange: (sections: SubscriptionComboSection[]) => void;
};

function ComboSectionsEditor({ sections, foodItems, onSectionsChange }: ComboSectionsEditorProps) {
  const mutate = (updater: (prev: SubscriptionComboSection[]) => SubscriptionComboSection[]) => {
    onSectionsChange(updater(sections));
  };

  const addSection = () => {
    mutate((prev) => [
      ...prev,
      {
        id: createId(),
        title: "",
        selectionType: "single",
        maxSelection: 2,
        items: [],
      },
    ]);
  };

  const updateSection = (id: string, patch: Partial<SubscriptionComboSection>) => {
    mutate((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return normalizeSectionMeta({ ...s, ...patch });
      }),
    );
  };

  const removeSection = (id: string) => {
    mutate((prev) => prev.filter((s) => s.id !== id));
  };

  const addItemToSection = (sectionId: string, item: SubscriptionDemoFoodItem) => {
    mutate((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        if (s.items.some((i) => i.id === item.id)) return s;
        return { ...s, items: [...s.items, item] };
      }),
    );
  };

  const removeItemFromSection = (sectionId: string, foodId: number) => {
    mutate((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== foodId) } : s,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <Button type="button" variant="secondary" size="md" onClick={addSection}>
        <MaterialIcon name="add" className="text-xl" />
        Add section
      </Button>

      {sections.length === 0 ? (
        <p className="rounded-xl bg-surface-container-high/40 px-4 py-6 text-center text-sm font-medium text-secondary">
          No combo sections yet. Use “Add section” to define what subscribers choose each day.
        </p>
      ) : null}

      {sections.map((section) => (
        <Card key={section.id} className="overflow-hidden p-0 ring-1 ring-outline-variant/15">
          <div className="flex flex-col gap-4 border-b border-outline-variant/15 bg-surface-container-high/20 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <Input
                label="Section title"
                name={`title-${section.id}`}
                value={section.title}
                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                placeholder='e.g. "Choose curry"'
              />
              <SelectField
                label="Selection type"
                name={`type-${section.id}`}
                value={section.selectionType}
                onChange={(e) =>
                  updateSection(section.id, {
                    selectionType: e.target.value as SubscriptionSelectionType,
                  })
                }
              >
                <option value="single">Single select (1 item)</option>
                <option value="multi">Multi select</option>
              </SelectField>
              <Input
                label="Max selection count"
                name={`max-${section.id}`}
                type="number"
                min={1}
                max={20}
                step={1}
                disabled={section.selectionType === "single"}
                value={section.maxSelection}
                onChange={(e) =>
                  updateSection(section.id, { maxSelection: Math.max(1, Number(e.target.value) || 1) })
                }
                hint={section.selectionType === "single" ? "Not used for single select." : "Caps how many dishes a user can pick."}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 self-start text-error hover:bg-red-50"
              onClick={() => removeSection(section.id)}
              aria-label="Remove section"
            >
              <MaterialIcon name="delete" className="text-xl" />
              Remove
            </Button>
          </div>
          <p className="px-5 pb-0 pt-2 text-xs font-medium text-secondary">
            {section.items.length} dish{section.items.length === 1 ? "" : "es"} in this section’s pool. Subscribers choose
            up to {maxSelectable(section)} when they order.
          </p>

          <div className="grid gap-0 lg:grid-cols-2">
            <div className="border-b border-outline-variant/15 p-5 lg:border-b-0 lg:border-r">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary">Item library</h3>
              <p className="mt-2 text-xs font-medium text-on-surface-variant">
                Add as many catalog dishes as you want to the pool (each dish once).
              </p>
              <ul className="mt-4 space-y-3">
                {foodItems.map((item) => {
                  const inSection = section.items.some((i) => i.id === item.id);
                  return (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl bg-surface p-3 ring-1 ring-outline-variant/10"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-on-surface">{item.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge tone={item.type === "veg" ? "success" : "error"}>
                            {item.type === "veg" ? "Veg" : "Non-veg"}
                          </Badge>
                          <span className="text-sm font-semibold text-primary">₹{item.price}</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={inSection}
                        onClick={() => addItemToSection(section.id, item)}
                      >
                        Add
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary">Section pool</h3>
              <p className="mt-2 text-xs font-medium text-on-surface-variant">
                Subscribers will only pick from this list, up to the limit above.
              </p>
              {section.items.length === 0 ? (
                <p className="mt-4 text-sm font-medium text-secondary">Add dishes from the library to build the pool.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl bg-surface-container-high/40 p-3 ring-1 ring-outline-variant/10"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-on-surface">{item.name}</p>
                        <Badge tone={item.type === "veg" ? "success" : "error"} className="mt-1">
                          {item.type === "veg" ? "Veg" : "Non-veg"}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-error"
                        onClick={() => removeItemFromSection(section.id, item.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
