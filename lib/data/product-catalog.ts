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

/** Declared allergen chips — align IDs with catalog JSON where possible (e.g. `nuts`, `egg`). */
export type DeclaredAllergenOption = { id: string; label: string };

export const productDeclaredAllergenOptions: DeclaredAllergenOption[] = [
  { id: "celery", label: "Celery" },
  { id: "gluten", label: "Cereals containing gluten" },
  { id: "crustaceans", label: "Crustaceans" },
  { id: "egg", label: "Eggs" },
  { id: "fish", label: "Fish" },
  { id: "lupin", label: "Lupin" },
  { id: "milk", label: "Milk" },
  { id: "molluscs", label: "Molluscs" },
  { id: "mustard", label: "Mustard" },
  { id: "nuts", label: "Tree nuts" },
  { id: "peanuts", label: "Peanuts" },
  { id: "sesame", label: "Sesame" },
  { id: "soy", label: "Soya" },
  { id: "sulphites", label: "Sulphur dioxide / sulphites" },
  { id: "coconut", label: "Coconut" },
];

export const productCurrencySymbol = "£";

export const productDiscountTypes: ProductDiscountType[] = [
  { id: "none", label: "None" },
  { id: "percent", label: "Percentage (%)" },
  { id: "fixed", label: `Fixed amount (${productCurrencySymbol})` },
];

/**
 * Demo catalog taxonomy — mirrors how a live POS might return category trees.
 * Subcategory ids stay stable so local `USER_{main}_{sub}` rows stay consistent.
 */
export const productMainCategories: ProductMainCategory[] = [
  {
    id: "mains",
    label: "Main courses",
    subcategories: [
      { id: "veg-specialties", label: "Vegetarian specialties" },
      { id: "paneer-house", label: "Paneer & cottage cheese" },
      { id: "dal-lentils", label: "Dal & lentils" },
      { id: "regional-curries", label: "Regional curries" },
      { id: "house-gravies", label: "House gravies" },
      { id: "chef-specials-mains", label: "Chef specials (mains)" },
    ],
  },
  {
    id: "nonveg-mains",
    label: "Chicken, lamb & seafood",
    subcategories: [
      { id: "chicken-curry", label: "Chicken curries" },
      { id: "lamb-goat", label: "Lamb & goat" },
      { id: "fish-prawn", label: "Fish & prawn" },
      { id: "tandoori-grill", label: "Tandoori grill plates" },
      { id: "biryani-tray", label: "Biryani & rice trays" },
    ],
  },
  {
    id: "appetizers",
    label: "Starters & small plates",
    subcategories: [
      { id: "street-snacks", label: "Street snacks" },
      { id: "chaat", label: "Chaat counter" },
      { id: "tikka-kebab", label: "Tikka & kebab" },
      { id: "indo-chinese", label: "Indo-Chinese starters" },
      { id: "soup-salad", label: "Soups & salads" },
    ],
  },
  {
    id: "rice-biryani",
    label: "Rice & biryani",
    subcategories: [
      { id: "classic-biryani", label: "Classic biryani" },
      { id: "pulao-fried-rice", label: "Pulao & fried rice" },
      { id: "plain-steamed", label: "Plain & steamed rice" },
      { id: "kids-rice", label: "Kids portions" },
    ],
  },
  {
    id: "breads",
    label: "Breads & roti",
    subcategories: [
      { id: "naan-family", label: "Naan & flatbreads" },
      { id: "stuffed", label: "Stuffed breads" },
      { id: "tandoor-roti", label: "Tandoor roti & kulcha" },
      { id: "gluten-aware", label: "Gluten-aware options" },
    ],
  },
  {
    id: "sides-accompaniments",
    label: "Sides & accompaniments",
    subcategories: [
      { id: "raita-chutney", label: "Raita & chutney" },
      { id: "pickles-papad", label: "Pickles & papad" },
      { id: "extra-gravy", label: "Extra gravy & sauce" },
      { id: "salad-kachumber", label: "Salad & kachumber" },
    ],
  },
  {
    id: "thali-combos",
    label: "Thali & meal deals",
    subcategories: [
      { id: "veg-thali", label: "Vegetarian thali" },
      { id: "nonveg-thali", label: "Non-veg thali" },
      { id: "lunch-box", label: "Lunch box (CB1–CB5)" },
      { id: "family-bundle", label: "Family bundles" },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    subcategories: [
      { id: "mithai", label: "Mithai" },
      { id: "kulfi-falooda", label: "Kulfi & falooda" },
      { id: "ice-cream", label: "Ice cream" },
      { id: "fusion-sweets", label: "Fusion sweets" },
    ],
  },
  {
    id: "drinks",
    label: "Drinks & lassi",
    subcategories: [
      { id: "lassi-shake", label: "Lassi & shakes" },
      { id: "chai-hot", label: "Chai & hot drinks" },
      { id: "soft-juice", label: "Soft drinks & juice" },
      { id: "wine-beer", label: "Wine & beer (where licensed)" },
    ],
  },
  {
    id: "kids",
    label: "Kids menu",
    subcategories: [
      { id: "mild-curry", label: "Mild curries" },
      { id: "snack-box", label: "Snack boxes" },
      { id: "sweet-treat", label: "Sweet treats" },
    ],
  },
  {
    id: "retail-grocery",
    label: "Retail & spice pantry",
    subcategories: [
      { id: "spice-mix", label: "Spice mixes & pastes" },
      { id: "ready-meal", label: "Ready meals" },
      { id: "frozen", label: "Frozen" },
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
