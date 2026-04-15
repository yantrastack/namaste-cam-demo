"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import namasteCamLogo from "@/app/namaste-cam-logo.jpeg";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { NavGroup, NavLeafLink } from "@/components/layout/SidebarNavBlocks";
import { clearSessionUser } from "@/lib/auth";
import { cn } from "@/lib/cn";
import {
  dashboardSidebarNav,
  isNavLeafActive,
} from "@/lib/navigation/dashboard-sidebar-nav";

/** Persistent collapsible rail for all dashboard routes, including Users. */
export function DashboardMiniSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const syncExpandedFromPath = useCallback((path: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      for (const item of dashboardSidebarNav.items) {
        if (item.children?.some((c) => c.href && isNavLeafActive(c.href, path))) {
          next.add(item.id);
        }
      }
      return next;
    });
  }, []);

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

  const expandSidebarAndSection = (id: string) => {
    setCollapsed(false);
    setExpandedIds((prev) => new Set(prev).add(id));
  };

  const handleLogout = () => {
    clearSessionUser();
    router.replace("/login");
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-outline-variant/10 bg-surface-container-lowest shadow-sm transition-[width] duration-200 ease-out",
        collapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      <div
        className={cn(
          "flex border-b border-outline-variant/10",
          collapsed
            ? "flex-col items-center gap-2 px-2 py-3"
            : "items-center gap-2 px-3 py-4",
        )}
      >
        {!collapsed ? (
          <>
            <Image
              src={namasteCamLogo}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-outline-variant/15"
              priority
            />
            <div className="min-w-0 flex-1 px-1">
              <p className="font-headline text-lg font-extrabold tracking-tight text-primary">
                Namaste Cam
              </p>
              <p className="text-xs font-medium uppercase tracking-widest text-secondary">
                Admin
              </p>
            </div>
          </>
        ) : (
          <Image
            src={namasteCamLogo}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-outline-variant/15"
            priority
          />
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="shrink-0 rounded-full p-2 text-secondary transition-colors hover:bg-surface-container-high hover:text-primary"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MaterialIcon name={collapsed ? "chevron_right" : "chevron_left"} className="text-xl" />
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
                collapsed={collapsed}
                pathname={pathname}
              />
            );
          }
          return (
            <NavGroup
              key={item.id}
              item={item}
              collapsed={collapsed}
              expanded={expandedIds.has(item.id)}
              onToggle={() => toggleSection(item.id)}
              onExpandSidebar={() => expandSidebarAndSection(item.id)}
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
          className={cn(
            "w-full font-semibold text-secondary hover:bg-surface-container-high hover:text-primary",
            collapsed && "px-2",
          )}
          onClick={handleLogout}
          aria-label="Log out"
        >
          <MaterialIcon name="logout" className="text-xl" />
          {!collapsed ? <span>Log out</span> : <span className="sr-only">Log out</span>}
        </Button>
      </div>
    </aside>
  );
}
