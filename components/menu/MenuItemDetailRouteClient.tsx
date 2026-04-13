"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import menuData from "@/sandbox/menu-demo/menu-data.json";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { mergeMenuWithLocal, MENU_CATALOG_EVENT } from "@/lib/menu-local-catalog";
import { MenuItemDetail } from "./MenuItemDetail";
import { MenuItemDetailBreadcrumbs } from "./MenuItemDetailBreadcrumbs";
import { findMenuProduct } from "./find-menu-product";
import type { MenuDocument } from "./types";

export function MenuItemDetailRouteClient({ itemId }: { itemId: string }) {
  const base = menuData as MenuDocument;
  const [doc, setDoc] = useState<MenuDocument>(base);

  useEffect(() => {
    setDoc(mergeMenuWithLocal(base));
  }, [base]);

  useEffect(() => {
    const bump = () => setDoc(mergeMenuWithLocal(base));
    window.addEventListener(MENU_CATALOG_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(MENU_CATALOG_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, [base]);

  const found = useMemo(() => findMenuProduct(doc, itemId), [doc, itemId]);

  if (!found) {
    return (
      <PageContainer title="Item not found" description="This dish is not in the catalog (including locally saved items).">
        <Card className="mx-auto max-w-lg p-8">
          <p className="text-on-surface-variant">
            No menu item matches <span className="font-mono text-on-surface">{itemId}</span>. Add
            a product from{" "}
            <Link href="/menu/new" className="font-semibold text-primary hover:underline">
              Add product
            </Link>{" "}
            to store it in this browser.
          </p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumbs={
        <MenuItemDetailBreadcrumbs listHref="/menu/item-list" itemName={found.item.name} />
      }
      title={found.item.name}
      description={
        <>
          <span className="text-on-surface-variant">{found.category.category}</span>
          <span className="text-secondary"> · </span>
          <span className="text-on-surface-variant">Menu catalog</span>
        </>
      }
    >
      <div className="mx-auto w-full max-w-6xl">
        <MenuItemDetail found={found} allergyNotice={doc.restaurant.allergy_notice} />
      </div>
    </PageContainer>
  );
}
