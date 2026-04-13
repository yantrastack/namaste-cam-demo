"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { NavGroup, NavLeafLink } from "@/components/layout/SidebarNavBlocks";
import { UserSidebarDirectory } from "@/components/users/UserSidebarDirectory";
import { clearSessionUser } from "@/lib/auth";
import { cn } from "@/lib/cn";
import {
  dashboardSidebarNav,
  isNavLeafActive,
} from "@/lib/navigation/dashboard-sidebar-nav";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
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
                renderGroupExtra={(navItem) =>
                  navItem.id === "users" ? <UserSidebarDirectory /> : null
                }
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
