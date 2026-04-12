import seed from "@/data/users-seed.json";
import type { ManagedUser, UserRole, UserStatus } from "./types";

const STORAGE_KEY = "namaste-cam-users-store-v3";

const FALLBACK_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA9hbRJ_e1L8nTeuPZ77n1KRKKhkWcNcyg6UQMuiqJD-blZjfhk3xVk3pyotPX1BokJIlYuA9lUGXedKH5lgq8g8b5YW112Gq4JuIUKuNXDlrfoLQ0wpPCbTc0Fx0kiaOecQUe9B_qk1SACoJEIsknUjg7gPSzirDaQm8jNugiAb-ZX64oQWqKtLwlaR1fwlpbWhXdSdoMD0cLoICuCYAKuVJjsT_wpK0XigXC6yV_jXgOtUJji2LXGWZVu8Dz0My3D4O1fl3Y1KYg";

const ROLES: readonly UserRole[] = [
  "user",
  "admin",
  "restaurant_admin",
  "delivery_agent",
  "customer",
];

export function normalizeManagedUser(
  raw: Partial<ManagedUser> & Pick<ManagedUser, "id">,
): ManagedUser {
  const role = ROLES.includes(raw.role as UserRole)
    ? (raw.role as UserRole)
    : "user";
  const status: UserStatus =
    raw.status === "inactive" ? "inactive" : "active";
  const wb =
    typeof raw.walletBalance === "number" && Number.isFinite(raw.walletBalance)
      ? raw.walletBalance
      : 0;
  const cl =
    typeof raw.creditLimit === "number" && Number.isFinite(raw.creditLimit)
      ? raw.creditLimit
      : 0;
  return {
    id: raw.id,
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    role,
    status,
    joinDate:
      typeof raw.joinDate === "string" && raw.joinDate.length >= 8
        ? raw.joinDate
        : new Date().toISOString().slice(0, 10),
    avatarUrl:
      typeof raw.avatarUrl === "string" && raw.avatarUrl.length > 0
        ? raw.avatarUrl
        : FALLBACK_AVATAR,
    notes: typeof raw.notes === "string" ? raw.notes : "",
    walletBalance: wb,
    creditLimit: cl,
    walletNote: typeof raw.walletNote === "string" ? raw.walletNote : "",
    twoFactorEnabled: Boolean(raw.twoFactorEnabled),
    requirePasswordReset: Boolean(raw.requirePasswordReset),
  };
}

export type UsersStoreState = {
  users: ManagedUser[];
};

const initial: UsersStoreState = {
  users: (seed as UsersStoreState).users.map((u) =>
    normalizeManagedUser(u as ManagedUser),
  ),
};

function cloneInitial(): UsersStoreState {
  return JSON.parse(JSON.stringify(initial)) as UsersStoreState;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadUsersStore(): UsersStoreState {
  if (!isBrowser()) return cloneInitial();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return cloneInitial();
    }
    const parsed = JSON.parse(raw) as UsersStoreState;
    if (!Array.isArray(parsed.users)) return cloneInitial();
    return {
      users: parsed.users.map((u) =>
        normalizeManagedUser(u as Partial<ManagedUser> & Pick<ManagedUser, "id">),
      ),
    };
  } catch {
    return cloneInitial();
  }
}

export function saveUsersStore(next: UsersStoreState): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/** Stable seed clone for React initial state (avoids SSR/client hydration mismatch). */
export function getDefaultUsers(): ManagedUser[] {
  return initial.users.map((u) => normalizeManagedUser(u));
}

export function newUserId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `u-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
