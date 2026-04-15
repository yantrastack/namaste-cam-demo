"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { AddPromotionView } from "./_components/AddPromotionView";

function NewCouponInner() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  return <AddPromotionView editId={editId} />;
}

export default function NewCouponPage() {
  return (
    <Suspense
      fallback={
        <PageContainer title="Add coupon" description="Loading editor…">
          <Card className="p-10 text-center text-secondary">Loading…</Card>
        </PageContainer>
      }
    >
      <NewCouponInner />
    </Suspense>
  );
}
