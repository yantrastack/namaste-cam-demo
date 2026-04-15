export type DietType = "veg" | "non-veg";

export type ItemCategory = "all" | "main" | "appetizer" | "dessert";

export type FoodItem = {
  id: number;
  name: string;
  diet: DietType;
  price: number;
  category: Exclude<ItemCategory, "all">;
  imageUrl: string;
};

/** Per selected catalog line — kitchen / channel availability (menu builder demo). */
export type SelectedLineSlotAvailability = {
  available: boolean;
  timeFrom: string;
  timeTo: string;
  deliverable: boolean;
  pickup: boolean;
  prepMins: string;
};

export const DEFAULT_SELECTED_LINE_SLOT_AVAILABILITY: SelectedLineSlotAvailability = {
  available: true,
  timeFrom: "12:00",
  timeTo: "23:00",
  deliverable: true,
  pickup: true,
  prepMins: "25",
};

export type SelectedLine = {
  foodId: number;
  quantity: number;
  /**
   * When `false`, the dish is treated as a same-day extra: it can appear on Today’s
   * menu for the configured weekdays but is not part of the recurring main roster.
   * Omitted or `true` = part of the main menu.
   */
  includeInMainMenu?: boolean;
  /** Optional overrides edited from the selected-items availability popup. */
  slotAvailability?: SelectedLineSlotAvailability;
};

export function mergeSelectedLineSlotAvailability(
  line: SelectedLine,
): SelectedLineSlotAvailability {
  return {
    ...DEFAULT_SELECTED_LINE_SLOT_AVAILABILITY,
    ...line.slotAvailability,
  };
}

export function patchSelectedLineSlotAvailability(
  lines: SelectedLine[],
  foodId: number,
  slot: SelectedLineSlotAvailability,
): SelectedLine[] {
  return lines.map((l) =>
    l.foodId === foodId ? { ...l, slotAvailability: { ...slot } } : l,
  );
}

/** Strip undefined optional fields for stable menu row payloads. */
export function menuSaveSelectedLine(line: SelectedLine): SelectedLine {
  const out: SelectedLine = { foodId: line.foodId, quantity: line.quantity };
  if (line.includeInMainMenu === false) out.includeInMainMenu = false;
  if (line.slotAvailability) {
    out.slotAvailability = { ...line.slotAvailability };
  }
  return out;
}

export type MealCategory = "lunch" | "dinner" | "both";

export type MenuKind = "normal" | "special" | "subscription";

export type TableMenuType = "lunch" | "dinner" | "both" | "special" | "subscription";

export type NormalMenuDetails = {
  category: MealCategory;
  days: string[];
  items: SelectedLine[];
};

/** Optional social sharing for date-bound special menus (kitchen dashboard). */
export type SpecialMenuSocialShare = {
  enabled: boolean;
  facebook: boolean;
  instagram: boolean;
  twitter: boolean;
};

export type SpecialMenuDetails = {
  description: string;
  imagePreview: string | null;
  startDate: string;
  endDate: string;
  items: SelectedLine[];
  socialShare?: SpecialMenuSocialShare;
};

export type SubscriptionMenuDetails = {
  daysCount: 7 | 15 | 30;
  expiryDate: string;
  price: string;
  discount: string;
  bannerText: string;
  itemsByDay: Record<number, SelectedLine[]>;
};

export type MenuRow = {
  id: string;
  name: string;
  tableType: TableMenuType;
  availability: string;
  imageUrl: string;
  /** Demo flag: whether this menu is live for outlets. */
  active: boolean;
  normalDetails?: NormalMenuDetails;
  specialDetails?: SpecialMenuDetails;
  subscriptionDetails?: SubscriptionMenuDetails;
  /**
   * When set on a subscription `MenuRow`, the full combo builder edits
   * `SubscriptionMenuRecord` with this id (Create menu → subscription).
   */
  subscriptionPlanId?: string;
};

export const WEEKDAY_KEYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export const ITEM_FILTER_LABELS: { id: ItemCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "main", label: "Main Course" },
  { id: "appetizer", label: "Appetizers" },
  { id: "dessert", label: "Dessert" },
];

export const DEMO_FOOD_ITEMS: FoodItem[] = [
  {
    id: 1,
    name: "Butter Chicken",
    diet: "non-veg",
    price: 240,
    category: "main",
    imageUrl: "https://picsum.photos/seed/butter-chicken/96/96",
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    diet: "veg",
    price: 180,
    category: "main",
    imageUrl: "https://picsum.photos/seed/paneer/96/96",
  },
  {
    id: 3,
    name: "Dal Tadka",
    diet: "veg",
    price: 120,
    category: "main",
    imageUrl: "https://picsum.photos/seed/dal/96/96",
  },
  {
    id: 4,
    name: "Jeera Rice",
    diet: "veg",
    price: 90,
    category: "appetizer",
    imageUrl: "https://picsum.photos/seed/rice/96/96",
  },
];

export function formatAvailabilityNormal(days: string[]): string {
  if (days.length === WEEKDAY_KEYS.length) return "Mon – Sun";
  if (days.length === 0) return "—";
  return days.join(", ");
}

/** Maps `Date` to the short weekday labels used in menu rows (`WEEKDAY_KEYS`). */
export function weekdayKeyFromDate(d: Date): (typeof WEEKDAY_KEYS)[number] {
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  return map[d.getDay()];
}

/** Lunch/dinner row applies to a given weekday (including “all week” menus). */
export function normalMenuAppliesToWeekday(row: MenuRow, day: string): boolean {
  if (row.tableType !== "lunch" && row.tableType !== "dinner" && row.tableType !== "both") return false;
  const days = row.normalDetails?.days;
  if (!days?.length) return false;
  const coversAllWeek = days.length >= WEEKDAY_KEYS.length;
  return coversAllWeek || days.includes(day);
}

const DAY_KEY_TO_JS: Record<(typeof WEEKDAY_KEYS)[number], number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Calendar date in the same week as `anchor` for the given weekday key (Mon … Sun). */
export function calendarDateForFocusDay(anchor: Date, focusDay: string): Date {
  const key = focusDay as (typeof WEEKDAY_KEYS)[number];
  const target = DAY_KEY_TO_JS[key];
  const d = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
  const cur = d.getDay();
  d.setDate(d.getDate() + (target - cur));
  return d;
}

function startOfLocalDayMs(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function parseISODateLocal(iso: string): number {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day).getTime();
}

/** Special menu is active on a calendar day (inclusive start/end). */
export function specialAppliesOnDate(row: MenuRow, d: Date): boolean {
  if (row.tableType !== "special" || !row.specialDetails) return false;
  const { startDate, endDate } = row.specialDetails;
  if (!startDate || !endDate) return false;
  const t = startOfLocalDayMs(d);
  return t >= parseISODateLocal(startDate) && t <= parseISODateLocal(endDate);
}

/** Subscription is still valid on a calendar day (before/on expiry). */
export function subscriptionValidOnDate(row: MenuRow, d: Date): boolean {
  if (row.tableType !== "subscription" || !row.subscriptionDetails) return false;
  const exp = row.subscriptionDetails.expiryDate;
  if (!exp) return false;
  return startOfLocalDayMs(d) <= parseISODateLocal(exp);
}

export function formatAvailabilitySpecial(start: string, end: string): string {
  if (!start && !end) return "—";
  if (start && end) return `${start} → ${end}`;
  return start || end || "—";
}

export function foodById(items: FoodItem[], id: number) {
  return items.find((f) => f.id === id);
}

export function createEmptyDayMap(days: number): Record<number, SelectedLine[]> {
  const map: Record<number, SelectedLine[]> = {};
  for (let d = 1; d <= days; d += 1) map[d] = [];
  return map;
}
