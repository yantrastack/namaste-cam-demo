import type { Metadata } from "next";
import menuData from "@/sandbox/menu-demo/menu-data.json";
import { MenuProductList, type MenuDocument } from "@/components/menu";

export const metadata: Metadata = {
  title: "Menu product list (demo)",
  description: "UK menu browse with stock and basket controls — Namaste Cam",
};

export default function MenuProductListDemoPage() {
  const doc = menuData as MenuDocument;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-outline-variant/20 bg-surface-container-lowest px-4 py-6 shadow-sm">
        <div className="mx-auto max-w-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            Sandbox
          </p>
          <h1 className="mt-1 font-headline text-2xl font-bold text-on-surface">
            {doc.restaurant.name}
          </h1>
          <p className="mt-1 text-sm text-secondary">{doc.restaurant.tagline}</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <MenuProductList data={doc} />
      </main>
    </div>
  );
}
