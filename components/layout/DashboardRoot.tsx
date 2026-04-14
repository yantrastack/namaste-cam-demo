"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const DashboardShell = dynamic(
  () =>
    import("@/components/layout/DashboardShell").then((mod) => mod.DashboardShell),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-dvh max-h-dvh min-h-0 items-center justify-center overflow-hidden bg-background text-sm text-stone-500">
        Loading…
      </div>
    ),
  },
);

export function DashboardRoot({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
