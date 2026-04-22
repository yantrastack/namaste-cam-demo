import seed from "@/data/users-seed.json";
import { isStaffLikeRole } from "@/lib/users/role-policy";
import type {
  ManagedUser,
  StaffProfile,
  SubscriptionPaymentMode,
  UserRole,
  UserStatus,
  UserSubscription,
} from "./types";

const STORAGE_KEY = "namaste-cam-users-store-v5";

const FALLBACK_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA9hbRJ_e1L8nTeuPZ77n1KRKKhkWcNcyg6UQMuiqJD-blZjfhk3xVk3pyotPX1BokJIlYuA9lUGXedKH5lgq8g8b5YW112Gq4JuIUKuNXDlrfoLQ0wpPCbTc0Fx0kiaOecQUe9B_qk1SACoJEIsknUjg7gPSzirDaQm8jNugiAb-ZX64oQWqKtLwlaR1fwlpbWhXdSdoMD0cLoICuCYAKuVJjsT_wpK0XigXC6yV_jXgOtUJji2LXGWZVu8Dz0My3D4O1fl3Y1KYg";

const ROLES: readonly UserRole[] = [
  "user",
  "admin",
  "restaurant_admin",
  "delivery_agent",
  "customer",
  "cook",
  "manager",
];

const PAYMENT_MODES: readonly SubscriptionPaymentMode[] = [
  "card",
  "direct_debit",
  "invoice",
  "bank_transfer",
];

function normalizeUserSubscription(raw: unknown): UserSubscription | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const planId = typeof o.planId === "string" ? o.planId.trim() : "";
  if (!planId) return undefined;
  const expiresOn =
    typeof o.expiresOn === "string" && o.expiresOn.length >= 8
      ? o.expiresOn.slice(0, 10)
      : "";
  if (!expiresOn) return undefined;
  const pm = o.paymentMode;
  const paymentMode: SubscriptionPaymentMode = PAYMENT_MODES.includes(
    pm as SubscriptionPaymentMode,
  )
    ? (pm as SubscriptionPaymentMode)
    : "card";
  const assignedOn =
    typeof o.assignedOn === "string" && o.assignedOn.length >= 8
      ? o.assignedOn.slice(0, 10)
      : new Date().toISOString().slice(0, 10);
  return {
    planId,
    planLabel:
      typeof o.planLabel === "string" && o.planLabel.trim()
        ? o.planLabel.trim()
        : planId,
    expiresOn,
    paymentMode,
    notes: typeof o.notes === "string" ? o.notes : "",
    assignedOn,
  };
}

function normalizeStaffProfile(
  raw: unknown,
  role: UserRole,
): StaffProfile | undefined {
  if (!isStaffLikeRole(role)) return undefined;
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const amt = Number(o.compensationAmount);
  const compensationAmount = Number.isFinite(amt) ? Math.round(amt * 100) / 100 : 0;
  const compType = o.compensationType === "monthly" ? "monthly" : "hourly";
  return {
    alternativeEmail: typeof o.alternativeEmail === "string" ? o.alternativeEmail : "",
    secondaryPhone: typeof o.secondaryPhone === "string" ? o.secondaryPhone : "",
    address: typeof o.address === "string" ? o.address : "",
    idProofFileName: typeof o.idProofFileName === "string" ? o.idProofFileName : "",
    cvFileName: typeof o.cvFileName === "string" ? o.cvFileName : "",
    temporaryStaff: Boolean(o.temporaryStaff),
    compensationType: compType,
    compensationAmount,
  };
}

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
  const staffProfile = normalizeStaffProfile(raw.staffProfile, role);
  const subscription = normalizeUserSubscription(raw.subscription);
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
    strictCustomer: Boolean(raw.strictCustomer),
    staffProfile,
    twoFactorEnabled: Boolean(raw.twoFactorEnabled),
    requirePasswordReset: Boolean(raw.requirePasswordReset),
    lastActivity:
      typeof raw.lastActivity === "string" && raw.lastActivity.length >= 8
        ? raw.lastActivity
        : undefined,
    ...(subscription ? { subscription } : {}),
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
