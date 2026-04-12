/** Catalog-driven options for the create product screen (replace with API later). */

export type ProductSubcategory = { id: string; label: string };

export type ProductMainCategory = {
  id: string;
  label: string;
  subcategories: ProductSubcategory[];
};

export type ProductDiscountType = { id: string; label: string };

export type NamedPriceRow = { id: string; name: string; price: string };

export type DietaryFlagDef = {
  id: string;
  label: string;
  icon: string;
  iconClassName: string;
  defaultChecked?: boolean;
};

export const productCurrencySymbol = "£";

export const productDiscountTypes: ProductDiscountType[] = [
  { id: "none", label: "None" },
  { id: "percent", label: "Percentage (%)" },
  { id: "fixed", label: `Fixed amount (${productCurrencySymbol})` },
];

export const productMainCategories: ProductMainCategory[] = [
  {
    id: "mains",
    label: "Main courses",
    subcategories: [
      { id: "veg-specialties", label: "Vegetarian specialties" },
      { id: "tandoori", label: "Tandoori classics" },
      { id: "regional-curries", label: "Regional curries" },
    ],
  },
  {
    id: "appetizers",
    label: "Appetizers",
    subcategories: [
      { id: "street-snacks", label: "Street snacks" },
      { id: "chaat", label: "Chaat" },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    subcategories: [
      { id: "mithai", label: "Mithai" },
      { id: "ice-cream", label: "Ice cream" },
    ],
  },
  {
    id: "breads",
    label: "Breads",
    subcategories: [
      { id: "naan-family", label: "Naan & flatbreads" },
      { id: "stuffed", label: "Stuffed breads" },
    ],
  },
];

export const productDietaryFlags: DietaryFlagDef[] = [
  {
    id: "popular",
    label: "Is popular",
    icon: "local_fire_department",
    iconClassName: "text-orange-500",
  },
  {
    id: "recommended",
    label: "Is recommended",
    icon: "star",
    iconClassName: "text-blue-500",
    defaultChecked: true,
  },
  {
    id: "glutenFree",
    label: "Gluten free",
    icon: "eco",
    iconClassName: "text-green-600",
  },
  {
    id: "dairy",
    label: "Contains dairy",
    icon: "egg_alt",
    iconClassName: "text-amber-500",
    defaultChecked: true,
  },
];

export const productInitialVariants: NamedPriceRow[] = [
  { id: "variant-half", name: "Half portion", price: "" },
  { id: "variant-full", name: "Full portion", price: "" },
];

export const productInitialAddons: NamedPriceRow[] = [
  { id: "addon-cheese", name: "Extra cheese", price: "1.50" },
];
