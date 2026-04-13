import type { Metadata } from "next";
import menuData from "@/sandbox/menu-demo/menu-data.json";
import { MenuItemDetailRouteClient, findMenuProduct, type MenuDocument } from "@/components/menu";

type Props = {
  params: Promise<{ itemId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { itemId } = await params;
  const found = findMenuProduct(menuData as MenuDocument, itemId);
  if (!found) return { title: "Menu item" };
  return {
    title: found.item.name,
    description: found.item.description.slice(0, 160),
  };
}

export default async function MenuItemDetailPage({ params }: Props) {
  const { itemId } = await params;
  return <MenuItemDetailRouteClient itemId={itemId} />;
}
