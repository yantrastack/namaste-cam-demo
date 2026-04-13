import type { Metadata } from "next";
import { StaffAttendanceClient } from "@/components/staff/StaffAttendanceClient";

export const metadata: Metadata = {
  title: "Staff attendance",
  description: "Track staff check-in and check-out activity",
};

export default function StaffAttendancePage() {
  return <StaffAttendanceClient />;
}
