export type MenuProductType = "veg" | "non-veg" | string;

export type MenuProductVariant = {
  size: string;
  price_gbp: number;
  currency?: string;
};

/** Optional add-on line when present in catalog JSON */
export type MenuProductAddon = {
  name: string;
  price_gbp?: number;
};

export type MenuProduct = {
  id: string;
  name: string;
  description: string;
  type: MenuProductType;
  image_url: string;
  /** Additional photos shown after the hero image (e.g. on item detail). */
  gallery_image_urls?: string[];
  variants: MenuProductVariant[];
  base_price_gbp: number;
  available: boolean;
  /** Kitchen / inventory count when known */
  available_qty?: number;
  stock_note?: string;
  collection_only?: boolean;
  allergens?: string[];
  customisation?: string[];
  /** Drinks: volume on pack (ml) */
  volume_ml?: number;
  /** Sides / retail: portion label from catalog (e.g. "4 oz") — JSON key `quantity` */
  quantity?: string;
  addons?: MenuProductAddon[];
  discount_percent?: number;
  /** Strike-through reference price when discounted */
  compare_at_price_gbp?: number;
  /** 1 = mild … 5 = very hot when provided in catalog */
  spicy_level?: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
};

export type MenuCategorySection = {
  category: string;
  category_id: string;
  items: MenuProduct[];
};

export type MenuDocument = {
  restaurant: {
    name: string;
    tagline: string;
    address?: string;
    cuisine?: string;
    /** General allergen disclaimer shown with item-level allergens */
    allergy_notice?: string;
  };
  menu: MenuCategorySection[];
  meta?: {
    currency?: string;
    currency_symbol?: string;
  };
};
