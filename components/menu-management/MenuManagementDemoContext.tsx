"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_DEMO_SUBSCRIPTIONS, type SubscriptionMenuRecord } from "./initial-demo-subscriptions";
import { INITIAL_MENUS } from "./initial-menus";
import type { MenuRow } from "./model";
import { loadPersistedSubscriptions, savePersistedSubscriptions } from "./subscription-persist";
import type { SubscriptionMenuDraft } from "./subscription-menu-model";

export type { SubscriptionMenuRecord } from "./initial-demo-subscriptions";

function newSubscriptionRecordId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneSubscriptionMenu(menu: SubscriptionMenuDraft): SubscriptionMenuDraft {
  return {
    ...menu,
    sections: menu.sections.map((s) => ({
      ...s,
      items: [...s.items],
    })),
  };
}

type MenuManagementDemoContextValue = {
  menus: MenuRow[];
  upsertMenu: (row: MenuRow) => void;
  deleteMenu: (id: string) => void;
  setMenuActive: (id: string, active: boolean) => void;
  subscriptions: SubscriptionMenuRecord[];
  addSubscription: (menu: SubscriptionMenuDraft) => void;
  updateSubscription: (id: string, menu: SubscriptionMenuDraft) => void;
  setSubscriptionActive: (id: string, active: boolean) => void;
};

const MenuManagementDemoContext = createContext<MenuManagementDemoContextValue | null>(null);

export function MenuManagementDemoProvider({ children }: { children: ReactNode }) {
  const [menus, setMenus] = useState<MenuRow[]>(INITIAL_MENUS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionMenuRecord[]>(
    () => loadPersistedSubscriptions() ?? INITIAL_DEMO_SUBSCRIPTIONS,
  );

  useEffect(() => {
    savePersistedSubscriptions(subscriptions);
  }, [subscriptions]);

  const upsertMenu = useCallback((row: MenuRow) => {
    setMenus((prev) => {
      const withActive: MenuRow = { ...row, active: row.active ?? true };
      const exists = prev.some((m) => m.id === withActive.id);
      if (exists) return prev.map((m) => (m.id === withActive.id ? withActive : m));
      return [withActive, ...prev];
    });
  }, []);

  const deleteMenu = useCallback((id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const setMenuActive = useCallback((id: string, active: boolean) => {
    setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, active } : m)));
  }, []);

  const addSubscription = useCallback((menu: SubscriptionMenuDraft) => {
    const record: SubscriptionMenuRecord = {
      id: newSubscriptionRecordId(),
      active: true,
      createdAt: Date.now(),
      menu: cloneSubscriptionMenu(menu),
    };
    setSubscriptions((prev) => [record, ...prev]);
  }, []);

  const updateSubscription = useCallback((id: string, menu: SubscriptionMenuDraft) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, menu: cloneSubscriptionMenu(menu) } : s)),
    );
  }, []);

  const setSubscriptionActive = useCallback((id: string, active: boolean) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, active } : s)));
  }, []);

  const value = useMemo(
    () => ({
      menus,
      upsertMenu,
      deleteMenu,
      setMenuActive,
      subscriptions,
      addSubscription,
      updateSubscription,
      setSubscriptionActive,
    }),
    [
      menus,
      upsertMenu,
      deleteMenu,
      setMenuActive,
      subscriptions,
      addSubscription,
      updateSubscription,
      setSubscriptionActive,
    ],
  );

  return (
    <MenuManagementDemoContext.Provider value={value}>
      {children}
    </MenuManagementDemoContext.Provider>
  );
}

export function useMenuManagementDemo() {
  const ctx = useContext(MenuManagementDemoContext);
  if (!ctx) {
    throw new Error("useMenuManagementDemo must be used within MenuManagementDemoProvider");
  }
  return ctx;
}
