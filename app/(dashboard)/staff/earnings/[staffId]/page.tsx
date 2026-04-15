import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaffEarningsDetailClient } from "@/components/staff/StaffEarningsDetailClient";
import { getStaffEarningsById } from "@/lib/staff-earnings-data";

type Props = {
  params: Promise<{ staffId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { staffId } = await params;
  const row = getStaffEarningsById(staffId);
  return {
    title: row ? `${row.name} · daily earnings` : "Staff earnings detail",
    description: row
      ? `Day-by-day labor and COD for ${row.name} (sample)`
      : "Staff earnings detail",
  };
}

export default async function StaffEarningsDetailPage({ params }: Props) {
  const { staffId } = await params;
  if (!getStaffEarningsById(staffId)) notFound();
  return <StaffEarningsDetailClient staffId={staffId} />;
}
