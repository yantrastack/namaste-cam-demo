import type { Metadata } from "next";
import menuData from "@/sandbox/menu-demo/menu-data.json";
import { PageContainer } from "@/components/layout/PageContainer";
import { MenuItemListClient, type MenuDocument } from "@/components/menu";

export const metadata: Metadata = {
  title: "Product list",
  description: "Preview menu items with UK pricing and availability",
};

export default function MenuItemListPage() {
  const doc = menuData as MenuDocument;

  return (
    <PageContainer
      title="Product list"
      description={`${doc.restaurant.name} — browse categories, stock, and basket controls (demo data).`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <MenuItemListClient initialDocument={doc} />
      </div>
    </PageContainer>
  );
}
