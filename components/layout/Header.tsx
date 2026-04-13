"use client";

import type { SessionUser } from "@/lib/auth";
import {
  getServerSessionUserJsonSnapshot,
  getSessionUserJsonSnapshot,
  subscribeSessionUser,
} from "@/lib/auth";
import { useMemo, useSyncExternalStore } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { usePathname } from "next/navigation";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps = {}) {
  const userJson = useSyncExternalStore(
    subscribeSessionUser,
    getSessionUserJsonSnapshot,
    getServerSessionUserJsonSnapshot,
  );
  const pathname = usePathname();

  const name = useMemo(() => {
    if (!userJson) return "";
    try {
      return (JSON.parse(userJson) as SessionUser).name ?? "";
    } catch {
      return "";
    }
  }, [userJson]);

  const isUsersPage = pathname === "/users";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-outline-variant/10 bg-white/80 px-6 py-4 backdrop-blur-md">
      <div className="hidden min-w-0 flex-1 md:block">
        <div className="relative max-w-md">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            <MaterialIcon name="search" />
          </span>
          <input
            type="search"
            value={isUsersPage && searchQuery !== undefined ? searchQuery : ""}
            onChange={(e) => isUsersPage && onSearchChange ? onSearchChange(e.target.value) : undefined}
            placeholder={isUsersPage ? "Search users by name or email..." : "Search orders, menus, users..."}
            className="w-full rounded-full bg-surface py-3 pl-12 pr-4 text-sm font-medium text-on-surface ring-1 ring-outline-variant/20 outline-none transition-all focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <p className="font-headline text-sm font-extrabold text-on-surface md:hidden">
        Namaste Cam
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-stone-500 transition-colors hover:bg-surface-container-high hover:text-primary"
          aria-label="Notifications"
        >
          <MaterialIcon name="notifications" />
        </button>
        <div className="ml-1 flex items-center gap-2 rounded-full bg-surface px-3 py-2 ring-1 ring-outline-variant/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {name ? name.slice(0, 1).toUpperCase() : "A"}
          </div>
          <div className="hidden text-left text-sm leading-tight sm:block">
            <p className="font-bold text-on-surface">{name || "Admin"}</p>
            <p className="text-xs text-stone-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
