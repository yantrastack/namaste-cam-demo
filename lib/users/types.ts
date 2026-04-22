export type UserRole =
  | "user"
  | "admin"
  | "restaurant_admin"
  | "delivery_agent"
  | "customer"
  | "cook"
  | "manager";

export type UserStatus = "active" | "inactive" | "blocked";

export type SubscriptionPaymentMode =
  | "card"
  | "direct_debit"
  | "invoice"
  | "bank_transfer";

/** Meal-plan subscription assigned to a customer by admin (demo persistence). */
export type UserSubscription = {
  planId: string;
  /** Snapshot label when assigned (shown if catalog labels change). */
  planLabel: string;
  /** ISO date YYYY-MM-DD — end of current term. */
  expiresOn: string;
  paymentMode: SubscriptionPaymentMode;
  /** Internal notes (billing, PO, etc.). */
  notes: string;
  /** ISO date YYYY-MM-DD when the plan was first attached. */
  assignedOn: string;
};

export type StaffCompensationType = "hourly" | "monthly";

/** HR / ops fields for staff-like roles (driver, cook, manager, etc.). */
export type StaffProfile = {
  alternativeEmail: string;
  secondaryPhone: string;
  address: string;
  /** Last selected ID document filename (demo persistence). */
  idProofFileName: string;
  /** Optional CV filename (demo persistence). */
  cvFileName: string;
  temporaryStaff: boolean;
  compensationType: StaffCompensationType;
  /** Rate in GBP per hour or per month depending on compensationType. */
  compensationAmount: number;
};

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  /** ISO date string (YYYY-MM-DD) */
  joinDate: string;
  avatarUrl: string;
  notes: string;
  walletBalance: number;
  /** Max spend / overdraft-style cap for the wallet (GBP). */
  creditLimit: number;
  /** Internal note shown with wallet / financials (editable in financials dialog). */
  walletNote: string;
  /** When true, enforce stricter ordering / payment rules (customer-like roles). */
  strictCustomer: boolean;
  /** Present when role is staff-like; omitted for pure customer accounts. */
  staffProfile?: StaffProfile;
  twoFactorEnabled: boolean;
  requirePasswordReset: boolean;
  /** ISO date string for last activity */
  lastActivity?: string;
  /** Customer meal-plan subscription (admin-managed). */
  subscription?: UserSubscription;
};
