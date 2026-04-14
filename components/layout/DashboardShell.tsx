"use client";

import type { SessionUser } from "@/lib/auth";
import {
  getServerSessionUserJsonSnapshot,
  getSessionUserJsonSnapshot,
  subscribeSessionUser,
} from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore, useState, type ReactNode } from "react";
import { DashboardMiniSidebar } from "@/components/layout/DashboardMiniSidebar";
import { Header } from "@/components/layout/Header";
import { UsersPageSearchProvider } from "@/components/users/UsersPageSearchContext";
import { UsersProvider } from "@/components/users/UsersProvider";

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const userJson = useSyncExternalStore(
    subscribeSessionUser,
    getSessionUserJsonSnapshot,
    getServerSessionUserJsonSnapshot,
  );

  const user = useMemo((): SessionUser | null => {
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as SessionUser;
    } catch {
      return null;
    }
  }, [userJson]);

  const usersPageSearch = useMemo(
    () =>
      pathname === "/users"
        ? { searchQuery, onSearchChange: setSearchQuery }
        : null,
    [pathname, searchQuery],
  );

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
      bodyMinHeight: body.style.minHeight,
    };
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.minHeight = "100%";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overflow = prev.bodyOverflow;
      body.style.height = prev.bodyHeight;
      body.style.minHeight = prev.bodyMinHeight;
    };
  }, []);

  if (user === null) {
    return (
      <div className="flex h-dvh max-h-dvh min-h-0 items-center justify-center overflow-hidden bg-background text-sm text-stone-500">
        Loading…
      </div>
    );
  }

  return (
    <UsersProvider>
      <div className="flex h-dvh max-h-dvh min-h-0 overflow-hidden bg-background">
        <DashboardMiniSidebar />
        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out"
          id="main-content"
        >
          <Header
            searchQuery={pathname === "/users" ? searchQuery : undefined}
            onSearchChange={pathname === "/users" ? setSearchQuery : undefined}
          />
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6">
            <UsersPageSearchProvider value={usersPageSearch}>{children}</UsersPageSearchProvider>
          </main>
        </div>
      </div>
    </UsersProvider>
  );
}
