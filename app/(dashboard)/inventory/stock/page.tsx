import type { Metadata } from "next";
import menuData from "@/sandbox/menu-demo/menu-data.json";
import { PageContainer } from "@/components/layout/PageContainer";
import { InventoryStockClient } from "@/components/inventory/InventoryStockClient";
import type { MenuDocument } from "@/components/menu/types";
import { SELLABLE_LOW_QTY_THRESHOLD } from "@/lib/inventory-data";

export const metadata: Metadata = {
  title: "Sellable stock",
  description: "Menu-linked quantities and availability.",
};

export default function InventoryStockPage() {
  const doc = menuData as MenuDocument;

  return (
    <PageContainer
      title="Sellable stock"
      description={`Catalog quantities merged with local additions. “Low” when a numeric count is below ${SELLABLE_LOW_QTY_THRESHOLD} and the item is still marked available.`}
    >
      <InventoryStockClient initialDocument={doc} />
    </PageContainer>
  );
}
