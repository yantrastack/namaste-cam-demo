import type { UserRole } from "./types";

/** End-customer accounts: wallet / credit / strict flags apply. */
export const CUSTOMER_LIKE_ROLES: readonly UserRole[] = ["user", "customer"];

/** Operations staff: extended HR-style fields apply. */
export const STAFF_LIKE_ROLES: readonly UserRole[] = [
  "admin",
  "restaurant_admin",
  "delivery_agent",
  "cook",
  "manager",
];

export function isCustomerLikeRole(role: UserRole): boolean {
  return (CUSTOMER_LIKE_ROLES as readonly string[]).includes(role);
}

export function isStaffLikeRole(role: UserRole): boolean {
  return (STAFF_LIKE_ROLES as readonly string[]).includes(role);
}
