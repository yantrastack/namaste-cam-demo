import raw from "@/data/dashboard-sidebar-nav.json";

export type DashboardSidebarLeaf = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

export type DashboardSidebarGroup = {
  id: string;
  label: string;
  icon: string;
  href?: string;
  children?: DashboardSidebarLeaf[];
};

export type DashboardSidebarNavFile = {
  version: number;
  items: DashboardSidebarGroup[];
};

export const dashboardSidebarNav = raw as DashboardSidebarNavFile;

export function isNavLeafActive(href: string, pathname: string): boolean {
  if (pathname === href) return true;
  if (href === "/orders") {
    if (pathname.startsWith("/orders/create")) return false;
    if (pathname.startsWith("/orders/history")) return false;
    if (pathname.startsWith("/orders/")) return true;
  }
  return false;
}

export function isNavGroupActive(
  item: DashboardSidebarGroup,
  pathname: string,
): boolean {
  if (item.href && isNavLeafActive(item.href, pathname)) return true;
  return Boolean(
    item.children?.some((c) => c.href && isNavLeafActive(c.href, pathname)),
  );
}
