import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { MenuCategoriesScreen } from "@/components/menu-management/MenuCategoriesScreen";

export default function MenuCategoriesPage() {
  return (
    <Suspense
      fallback={
        <PageContainer title="Categories" description="Loading…">
          <div className="h-24" />
        </PageContainer>
      }
    >
      <MenuCategoriesScreen />
    </Suspense>
  );
}
