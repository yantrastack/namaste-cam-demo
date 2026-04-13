import { MenuManagementDemoProvider } from "@/components/menu-management/MenuManagementDemoContext";
import type { ReactNode } from "react";

export default function MenuSectionLayout({ children }: { children: ReactNode }) {
  return <MenuManagementDemoProvider>{children}</MenuManagementDemoProvider>;
}
