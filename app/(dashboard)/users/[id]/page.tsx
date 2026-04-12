import { UserDetailView } from "@/components/users/UserDetailView";
import { Suspense } from "react";

export default function UserDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-secondary">Loading…</div>
      }
    >
      <UserDetailView />
    </Suspense>
  );
}
