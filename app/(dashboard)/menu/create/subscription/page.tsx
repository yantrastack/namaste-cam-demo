import { Suspense } from "react";
import { SubscriptionMenuBuilderClient } from "@/components/menu-management/SubscriptionMenuBuilderClient";

export default function CreateSubscriptionMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl bg-surface-container-lowest p-6 text-sm font-medium text-secondary ring-1 ring-outline-variant/10">
          Loading subscription builder…
        </div>
      }
    >
      <SubscriptionMenuBuilderClient />
    </Suspense>
  );
}
