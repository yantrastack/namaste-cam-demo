import { EditStaffMemberView } from "@/components/staff/EditStaffMemberView";
import { Suspense } from "react";

export default function EditStaffMemberPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-secondary">Loading...</div>
      }
    >
      <EditStaffMemberView />
    </Suspense>
  );
}
