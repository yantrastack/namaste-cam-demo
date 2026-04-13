import type { UserRole } from "./types";

export const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "customer", label: "Customer" },
  { value: "delivery_agent", label: "Driver / Delivery" },
  { value: "cook", label: "Cook" },
  { value: "manager", label: "Manager" },
  { value: "restaurant_admin", label: "Restaurant Admin" },
  { value: "admin", label: "Admin" },
];

export function formatUserRole(role: UserRole): string {
  const found = USER_ROLE_OPTIONS.find((o) => o.value === role);
  return found?.label ?? role;
}
