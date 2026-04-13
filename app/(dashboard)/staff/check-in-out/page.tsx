import type { Metadata } from "next";
import { Suspense } from "react";
import { StaffCheckInOutClient } from "@/components/staff/StaffCheckInOutClient";

export const metadata: Metadata = {
  title: "Check-in / check-out",
  description: "Record staff arrivals and departures",
};

export default function StaffCheckInOutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl rounded-xl bg-surface-container-lowest p-8 text-center text-sm font-medium text-secondary ring-1 ring-outline-variant/10">
          Loading check-in…
        </div>
      }
    >
      <StaffCheckInOutClient />
    </Suspense>
  );
}
