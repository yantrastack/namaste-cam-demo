import type { Metadata } from "next";
import Link from "next/link";
import menuData from "@/sandbox/menu-demo/menu-data.json";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";
import {
  countIngredientAlerts,
  listKitchenIngredientRows,
  listLowSellableRows,
  listSellableStockRows,
} from "@/lib/inventory-data";
import type { MenuDocument } from "@/components/menu/types";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Stock alerts and links to sellable and kitchen views.",
};

export default function InventoryOverviewPage() {
  const doc = menuData as MenuDocument;
  const sellable = listSellableStockRows(doc);
  const alerts = listLowSellableRows(doc);
  const ingredients = listKitchenIngredientRows();
  const ingAlerts = countIngredientAlerts(ingredients);

  return (
    <PageContainer
      title="Inventory overview"
      description="Sellable stock follows menu catalog quantities; kitchen ingredients are demo rows until a BOM is connected."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-headline text-lg font-extrabold text-on-surface">Sellable catalog</h2>
              <p className="mt-1 text-sm font-medium text-on-surface-variant">
                {sellable.length} SKUs tracked · {alerts.length} need attention (off, low qty, or unavailable)
              </p>
            </div>
            <Link
              href="/inventory/stock"
              className={cn(
                "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-sm font-bold text-on-secondary-container transition-all hover:bg-secondary-container/80 active:scale-95",
              )}
            >
              Open stock
            </Link>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-headline text-lg font-extrabold text-on-surface">Kitchen ingredients</h2>
              <p className="mt-1 text-sm font-medium text-on-surface-variant">
                {ingredients.length} demo lines · {ingAlerts.low} low · {ingAlerts.out} out
              </p>
            </div>
            <Link
              href="/inventory/ingredients"
              className={cn(
                "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-sm font-bold text-on-secondary-container transition-all hover:bg-secondary-container/80 active:scale-95",
              )}
            >
              Open list
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href="/inventory/stock" className="group block">
          <Card className="flex items-center gap-4 border border-transparent p-5 transition-all hover:border-primary/10 hover:shadow-md">
            <div className="rounded-lg bg-secondary-container p-2 text-on-secondary-container ring-1 ring-outline-variant/15">
              <MaterialIcon name="shelves" className="text-2xl" />
            </div>
            <div>
              <p className="font-bold text-on-surface group-hover:text-primary">Sellable stock</p>
              <p className="text-sm text-on-surface-variant">Quantities and notes from the live catalog merge (incl. local additions).</p>
            </div>
          </Card>
        </Link>
        <Link href="/inventory/ingredients" className="group block">
          <Card className="flex items-center gap-4 border border-transparent p-5 transition-all hover:border-primary/10 hover:shadow-md">
            <div className="rounded-lg bg-tertiary-container p-2 text-on-tertiary-container ring-1 ring-outline-variant/15">
              <MaterialIcon name="grocery" className="text-2xl" />
            </div>
            <div>
              <p className="font-bold text-on-surface group-hover:text-primary">Kitchen ingredients</p>
              <p className="text-sm text-on-surface-variant">Back-of-house levels (sample) — distinct from menu merchandising.</p>
            </div>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}
