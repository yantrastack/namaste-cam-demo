"use client";

import type { SessionUser } from "@/lib/auth";
import {
  getServerSessionUserJsonSnapshot,
  getSessionUserJsonSnapshot,
  subscribeSessionUser,
} from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
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
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out" id="main-content">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
