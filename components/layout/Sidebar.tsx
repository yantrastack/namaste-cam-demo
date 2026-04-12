"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { clearSessionUser } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { UserSidebarDirectory } from "@/components/users/UserSidebarDirectory";
import {
  dashboardSidebarNav,
  isNavGroupActive,
  isNavLeafActive,
  type DashboardSidebarGroup,
} from "@/lib/navigation/dashboard-sidebar-nav";

function NavLeafLink({
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

function NavGroup({
  item,
  collapsed,
  expanded,
  onToggle,
  onExpandSidebar,
  pathname,
}: {
  item: DashboardSidebarGroup;
  collapsed: boolean;
  expanded: boolean;
  onToggle: () => void;
  onExpandSidebar: () => void;
  pathname: string;
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
          {item.id === "users" ? <UserSidebarDirectory /> : null}
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const syncExpandedFromPath = useCallback(
    (path: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        for (const item of dashboardSidebarNav.items) {
          if (item.children?.some((c) => c.href && isNavLeafActive(c.href, path))) {
            next.add(item.id);
          }
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    syncExpandedFromPath(pathname);
  }, [pathname, syncExpandedFromPath]);

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLogout = () => {
    clearSessionUser();
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-30 rounded-full bg-primary p-3 text-white shadow-lg transition-transform hover:scale-105"
          aria-label="Open sidebar"
        >
          <MaterialIcon name="menu" className="text-xl" />
        </button>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen flex-col border-r border-outline-variant/10 bg-surface-container-lowest shadow-sm transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0 w-[30%]" : "-translate-x-full",
          "flex",
        )}
      >
      <div className="flex items-center gap-2 border-b border-outline-variant/10 px-3 py-4">
        <div className="min-w-0 flex-1 px-1">
          <p className="font-headline text-lg font-extrabold tracking-tight text-on-surface">
            Namaste Cam
          </p>
          <p className="text-xs font-medium uppercase tracking-widest text-secondary">
            Admin
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="shrink-0 rounded-full p-2 text-secondary transition-colors hover:bg-surface-container-high hover:text-primary"
          aria-label="Close sidebar"
        >
          <MaterialIcon name="close" className="text-xl" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Main">
        {dashboardSidebarNav.items.map((item) => {
          if (item.href && !item.children?.length) {
            return (
              <NavLeafLink
                key={item.id}
                href={item.href}
                label={item.label}
                icon={item.icon}
                collapsed={false}
                pathname={pathname}
              />
            );
          }
          return (
            <NavGroup
              key={item.id}
              item={item}
              collapsed={false}
              expanded={expandedIds.has(item.id)}
              onToggle={() => toggleSection(item.id)}
              onExpandSidebar={() => {}}
              pathname={pathname}
            />
          );
        })}
      </nav>

      <div className="border-t border-outline-variant/10 p-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full font-semibold text-secondary hover:bg-surface-container-high hover:text-primary"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <MaterialIcon name="logout" className="text-xl" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
    </>
  );
}
