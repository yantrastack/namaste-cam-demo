import { DashboardRoot } from "@/components/layout/DashboardRoot";
import { ToastProvider } from "@/components/ui/Toast";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <DashboardRoot>{children}</DashboardRoot>
    </ToastProvider>
  );
}
