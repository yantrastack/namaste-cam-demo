export const subscriptionDemoFoodItems = [
  {
    id: 1,
    name: "Butter Chicken",
    type: "non-veg" as const,
    price: 240,
    image: "https://picsum.photos/seed/sub-food-1/200/200",
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    type: "veg" as const,
    price: 180,
    image: "https://picsum.photos/seed/sub-food-2/200/200",
  },
  {
    id: 3,
    name: "Dal Tadka",
    type: "veg" as const,
    price: 120,
    image: "https://picsum.photos/seed/sub-food-3/200/200",
  },
  {
    id: 4,
    name: "Jeera Rice",
    type: "veg" as const,
    price: 90,
    image: "https://picsum.photos/seed/sub-food-4/200/200",
  },
  {
    id: 5,
    name: "Gulab Jamun",
    type: "veg" as const,
    price: 60,
    image: "https://picsum.photos/seed/sub-food-5/200/200",
  },
] as const;

export type SubscriptionDemoFoodItem = (typeof subscriptionDemoFoodItems)[number];

export type SubscriptionSelectionType = "single" | "multi";

export type SubscriptionComboSection = {
  id: string;
  title: string;
  selectionType: SubscriptionSelectionType;
  maxSelection: number;
  items: SubscriptionDemoFoodItem[];
};

export type SubscriptionMenuDraft = {
  name: string;
  totalDays: 7 | 15 | 30;
  expiry: string;
  price: string;
  discount: string;
  bannerText: string;
  /** Data URL from local upload (demo only). */
  bannerImage: string | null;
  sections: SubscriptionComboSection[];
};
