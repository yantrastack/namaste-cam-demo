"use client";

import { useEffect, useState } from "react";
import { MENU_CATALOG_EVENT, mergeMenuWithLocal } from "@/lib/menu-local-catalog";
import { MenuProductList } from "./MenuProductList";
import type { MenuDocument } from "./types";

export function MenuItemListClient({ initialDocument }: { initialDocument: MenuDocument }) {
  const [data, setData] = useState<MenuDocument>(initialDocument);

  useEffect(() => {
    setData(mergeMenuWithLocal(initialDocument));
  }, [initialDocument]);

  useEffect(() => {
    const bump = () => setData(mergeMenuWithLocal(initialDocument));
    window.addEventListener(MENU_CATALOG_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(MENU_CATALOG_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, [initialDocument]);

  return (
    <MenuProductList
      data={data}
      itemDetailBasePath="/menu/item-list"
      showCartControls={false}
      productEditBasePath="/menu/new"
    />
  );
}
