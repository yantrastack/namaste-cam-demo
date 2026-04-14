import type { Metadata } from "next";
import { StaffEarningsClient } from "@/components/staff/StaffEarningsClient";

export const metadata: Metadata = {
  title: "Staff earnings",
  description: "Payroll, hours, and delivery COD held by staff (sample)",
};

export default function StaffEarningsPage() {
  return <StaffEarningsClient />;
}
