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

export type SelectedLine = {
  foodId: number;
  quantity: number;
};

export type MealCategory = "lunch" | "dinner";

export type MenuKind = "normal" | "special" | "subscription";

export type TableMenuType = "lunch" | "dinner" | "special" | "subscription";

export type NormalMenuDetails = {
  category: MealCategory;
  days: string[];
  items: SelectedLine[];
};

export type SpecialMenuDetails = {
  description: string;
  imagePreview: string | null;
  startDate: string;
  endDate: string;
  items: SelectedLine[];
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
