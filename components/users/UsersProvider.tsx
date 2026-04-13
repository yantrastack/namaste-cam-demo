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
import {
  getDefaultUsers,
  loadUsersStore,
  newUserId,
  saveUsersStore,
} from "@/lib/users/store";
import type {
  ManagedUser,
  StaffProfile,
  UserRole,
  UserStatus,
} from "@/lib/users/types";

export type UsersContextValue = {
  users: ManagedUser[];
  hydrated: boolean;
  getUser: (id: string) => ManagedUser | undefined;
  updateUser: (id: string, patch: Partial<ManagedUser>) => void;
  addUser: (input: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    notes?: string;
    twoFactorEnabled?: boolean;
    requirePasswordReset?: boolean;
    walletBalance?: number;
    creditLimit?: number;
    strictCustomer?: boolean;
    staffProfile?: StaffProfile;
    avatarUrl?: string;
  }) => ManagedUser;
};

const UsersContext = createContext<UsersContextValue | null>(null);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<ManagedUser[]>(getDefaultUsers);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUsers(loadUsersStore().users);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveUsersStore({ users });
  }, [users, hydrated]);

  const getUser = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users],
  );

  const updateUser = useCallback((id: string, patch: Partial<ManagedUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    );
  }, []);

  const addUser = useCallback(
    (input: {
      name: string;
      email: string;
      phone: string;
      role: UserRole;
      notes?: string;
      twoFactorEnabled?: boolean;
      requirePasswordReset?: boolean;
      walletBalance?: number;
      creditLimit?: number;
      strictCustomer?: boolean;
      staffProfile?: StaffProfile;
      avatarUrl?: string;
    }): ManagedUser => {
      const today = new Date().toISOString().slice(0, 10);
      const defaultAvatar =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA9hbRJ_e1L8nTeuPZ77n1KRKKhkWcNcyg6UQMuiqJD-blZjfhk3xVk3pyotPX1BokJIlYuA9lUGXedKH5lgq8g8b5YW112Gq4JuIUKuNXDlrfoLQ0wpPCbTc0Fx0kiaOecQUe9B_qk1SACoJEIsknUjg7gPSzirDaQm8jNugiAb-ZX64oQWqKtLwlaR1fwlpbWhXdSdoMD0cLoICuCYAKuVJjsT_wpK0XigXC6yV_jXgOtUJji2LXGWZVu8Dz0My3D4O1fl3Y1KYg";
      const user: ManagedUser = {
        id: newUserId(),
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        role: input.role,
        status: "active",
        joinDate: today,
        avatarUrl:
          typeof input.avatarUrl === "string" && input.avatarUrl.length > 0
            ? input.avatarUrl
            : defaultAvatar,
        notes: input.notes?.trim() ?? "",
        walletBalance: input.walletBalance ?? 0,
        creditLimit: input.creditLimit ?? 500,
        walletNote: "",
        strictCustomer: input.strictCustomer ?? false,
        staffProfile: input.staffProfile,
        twoFactorEnabled: input.twoFactorEnabled ?? false,
        requirePasswordReset: input.requirePasswordReset ?? false,
      };
      setUsers((prev) => [...prev, user]);
      return user;
    },
    [],
  );

  const value = useMemo(
    () => ({
      users,
      hydrated,
      getUser,
      updateUser,
      addUser,
    }),
    [users, hydrated, getUser, updateUser, addUser],
  );

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

export function useUsers(): UsersContextValue {
  const ctx = useContext(UsersContext);
  if (!ctx) {
    throw new Error("useUsers must be used within UsersProvider");
  }
  return ctx;
}

export function userStatusLabel(status: UserStatus): string {
  return status === "active" ? "Active" : "Inactive";
}

export function formatJoinDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
