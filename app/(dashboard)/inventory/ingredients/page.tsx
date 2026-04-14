import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { KitchenIngredientsTable } from "@/components/inventory/KitchenIngredientsTable";
import { listKitchenIngredientRows } from "@/lib/inventory-data";

export const metadata: Metadata = {
  title: "Kitchen ingredients",
  description: "Back-of-house stock (demo data).",
};

export default function InventoryIngredientsPage() {
  const rows = listKitchenIngredientRows();

  return (
    <PageContainer
      title="Kitchen ingredients"
      description="Sample ledger rows for spices, dry goods, and dairy — replace with procurement data when available."
    >
      <KitchenIngredientsTable rows={rows} />
    </PageContainer>
  );
}
