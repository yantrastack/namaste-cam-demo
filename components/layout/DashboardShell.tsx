"use client";

import type { SessionUser } from "@/lib/auth";
import {
  getServerSessionUserJsonSnapshot,
  getSessionUserJsonSnapshot,
  subscribeSessionUser,
} from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore, useState, cloneElement, type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
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

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  if (user === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-stone-500">
        Loading…
      </div>
    );
  }

  return (
    <UsersProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header 
            searchQuery={pathname === "/users" ? searchQuery : undefined}
            onSearchChange={pathname === "/users" ? setSearchQuery : undefined}
          />
          <main className="flex-1 overflow-y-auto p-6">
            {pathname === "/users" && typeof children === "object" && children !== null
              ? cloneElement(children as any, { 
                  searchQuery, 
                  onSearchChange: setSearchQuery 
                })
              : children}
          </main>
        </div>
      </div>
    </UsersProvider>
  );
}
