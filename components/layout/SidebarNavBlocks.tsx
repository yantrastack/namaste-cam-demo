"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";
import {
  isNavGroupActive,
  isNavLeafActive,
  type DashboardSidebarGroup,
} from "@/lib/navigation/dashboard-sidebar-nav";

export function NavLeafLink({
  href,
  label,
  icon,
  collapsed,
  pathname,
}: {
  href: string;
  label: string;
  icon: string;
  collapsed: boolean;
  pathname: string;
}) {
  const active = isNavLeafActive(href, pathname);
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-full py-2.5 text-sm font-semibold transition-colors",
        collapsed ? "justify-center px-2" : "px-4",
        active
          ? "bg-primary/10 text-primary"
          : "text-secondary hover:bg-surface-container-high hover:text-on-surface",
      )}
    >
      <MaterialIcon name={icon} className="shrink-0 text-xl" />
      {!collapsed ? <span className="truncate">{label}</span> : null}
      {collapsed ? <span className="sr-only">{label}</span> : null}
    </Link>
  );
}

export function NavGroup({
  item,
  collapsed,
  expanded,
  onToggle,
  onExpandSidebar,
  pathname,
  renderGroupExtra,
}: {
  item: DashboardSidebarGroup;
  collapsed: boolean;
  expanded: boolean;
  onToggle: () => void;
  onExpandSidebar: () => void;
  pathname: string;
  renderGroupExtra?: (item: DashboardSidebarGroup) => ReactNode;
}) {
  const children = item.children ?? [];
  const groupActive = isNavGroupActive(item, pathname);

  if (children.length === 0 && item.href) {
    return (
      <NavLeafLink
        href={item.href}
        label={item.label}
        icon={item.icon}
        collapsed={collapsed}
        pathname={pathname}
      />
    );
  }

  if (collapsed) {
    return (
      <button
        type="button"
        title={item.label}
        aria-expanded={false}
        onClick={onExpandSidebar}
        className={cn(
          "flex w-full items-center justify-center rounded-full px-2 py-2.5 text-sm font-semibold transition-colors",
          groupActive
            ? "bg-primary/10 text-primary"
            : "text-secondary hover:bg-surface-container-high hover:text-on-surface",
        )}
      >
        <MaterialIcon name={item.icon} className="text-xl" />
        <span className="sr-only">{item.label}</span>
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-semibold transition-colors",
          groupActive && !expanded
            ? "text-primary"
            : "text-on-surface hover:bg-surface-container-high",
        )}
      >
        <MaterialIcon name={item.icon} className="shrink-0 text-xl" />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <MaterialIcon
          name="expand_more"
          className={cn("shrink-0 text-xl transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded ? (
        <div className="ml-2 space-y-1 border-l border-outline-variant/30 pl-3">
          {children.map((child) => (
            <NavLeafLink
              key={child.id}
              href={child.href}
              label={child.label}
              icon={child.icon}
              collapsed={false}
              pathname={pathname}
            />
          ))}
          {renderGroupExtra?.(item)}
        </div>
      ) : null}
    </div>
  );
}
