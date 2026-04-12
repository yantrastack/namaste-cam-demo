export type UserRole =
  | "user"
  | "admin"
  | "restaurant_admin"
  | "delivery_agent"
  | "customer";

export type UserStatus = "active" | "inactive" | "blocked";

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
  /** Max spend / overdraft-style cap for the wallet (USD). */
  creditLimit: number;
  /** Internal note shown with wallet / financials (editable in financials dialog). */
  walletNote: string;
  twoFactorEnabled: boolean;
  requirePasswordReset: boolean;
  /** ISO date string for last activity */
  lastActivity?: string;
};
