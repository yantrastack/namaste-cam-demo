import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CreateProductForm } from "./CreateProductForm";

export default function MenuNewProductPage() {
  return (
    <Suspense
      fallback={
        <PageContainer title="Add product" description="Loading…">
          <div className="h-24" />
        </PageContainer>
      }
    >
      <CreateProductForm />
    </Suspense>
  );
}
