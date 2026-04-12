import { DashboardRoot } from "@/components/layout/DashboardRoot";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardRoot>{children}</DashboardRoot>;
}
