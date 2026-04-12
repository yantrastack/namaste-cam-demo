import type { UserRole } from "./types";

export const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "restaurant_admin", label: "Restaurant Admin" },
  { value: "delivery_agent", label: "Delivery Agent" },
  { value: "customer", label: "Customer" },
];

export function formatUserRole(role: UserRole): string {
  const found = USER_ROLE_OPTIONS.find((o) => o.value === role);
  return found?.label ?? role;
}
