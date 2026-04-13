export type MenuProductType = "veg" | "non-veg" | string;

export type MenuProductVariant = {
  size: string;
  price_gbp: number;
  currency?: string;
};

export type MenuProduct = {
  id: string;
  name: string;
  description: string;
  type: MenuProductType;
  image_url: string;
  variants: MenuProductVariant[];
  base_price_gbp: number;
  available: boolean;
  /** Kitchen / inventory count when known */
  available_qty?: number;
  stock_note?: string;
  collection_only?: boolean;
  allergens?: string[];
  customisation?: string[];
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
  };
  menu: MenuCategorySection[];
  meta?: {
    currency?: string;
    currency_symbol?: string;
  };
};
