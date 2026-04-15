"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { cn } from "@/lib/cn";

type RowStatus = "check_in" | "checkout" | "late" | "overtime";

type AttendanceRow = {
  id: string;
  category: string;
  name: string;
  /** Matches a role on the check-in/out screen for deep links. */
  defaultPunchRole: string;
  checkIn: string;
  checkOut: string | null;
  totalHours: string | null;
  status: RowStatus;
};

const MOCK_ROWS: AttendanceRow[] = [
  {
    id: "1",
    category: "Kitchen Staff",
    name: "Marcus Chen",
    defaultPunchRole: "Executive sous chef",
    checkIn: "09:30 AM",
    checkOut: null,
    totalHours: "8h 15m",
    status: "check_in",
  },
  {
    id: "2",
    category: "Kitchen Staff",
    name: "Elena Rodriguez",
    defaultPunchRole: "Pastry chef",
    checkIn: "10:15 AM",
    checkOut: null,
    totalHours: null,
    status: "late",
  },
  {
    id: "3",
    category: "Delivery Staff",
    name: "James Wilson",
    defaultPunchRole: "Delivery driver",
    checkIn: "08:45 AM",
    checkOut: "05:00 PM",
    totalHours: "8h 15m",
    status: "checkout",
  },
  {
    id: "4",
    category: "Management",
    name: "Sarah Thompson",
    defaultPunchRole: "Floor manager",
    checkIn: "08:00 AM",
    checkOut: null,
    totalHours: "9h 45m",
    status: "overtime",
  },
];

function statusBadgeTone(s: RowStatus): "success" | "error" | "neutral" | "warning" {
  if (s === "check_in") return "success";
  if (s === "late") return "error";
  if (s === "overtime") return "warning";
  return "neutral";
}

function statusLabel(s: RowStatus): string {
  if (s === "check_in") return "Check-in";
  if (s === "late") return "Late";
  if (s === "overtime") return "Overtime";
  return "Checkout";
}

function checkInOutCheckoutHref(row: AttendanceRow): string {
  const qs = new URLSearchParams({
    staff: row.name,
    role: row.defaultPunchRole,
    intent: "check-out",
  });
  return `/staff/check-in-out?${qs.toString()}`;
}

/** Theme token pairs for initials discs (stable index from row id). */
const INITIALS_SURFACE_STYLES = [
  "bg-primary-fixed text-on-primary-fixed ring-1 ring-outline-variant/15",
  "bg-secondary-container text-on-secondary-container ring-1 ring-outline-variant/15",
  "bg-tertiary-fixed text-on-tertiary-fixed ring-1 ring-outline-variant/15",
  "bg-error-container text-on-error-container ring-1 ring-outline-variant/15",
] as const;

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]!}${parts[parts.length - 1]![0]!}`.toUpperCase();
}

function initialsDiscClass(rowId: string): string {
  const n = Number.parseInt(rowId, 10);
  const idx = Number.isNaN(n) ? 0 : Math.abs(n - 1) % INITIALS_SURFACE_STYLES.length;
  return INITIALS_SURFACE_STYLES[idx]!;
}

const checkoutLinkClass =
  "inline-flex items-center justify-center rounded-full border border-primary bg-transparent px-3 py-1 text-xs font-bold text-primary transition-all hover:bg-primary/5 active:scale-95";

const ROLE_SECTION_ORDER = ["Kitchen Staff", "Delivery Staff", "Management"] as const;

export function StaffAttendanceClient() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("2026-04-14");

  const headerDate = useMemo(() => {
    const d = new Date(date + "T12:00:00");
    if (Number.isNaN(d.getTime())) return date;
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [date]);

  const filtered = useMemo(() => {
    return MOCK_ROWS.filter((row) => {
      const q = query.trim().toLowerCase();
      if (q && !row.name.toLowerCase().includes(q)) return false;
      if (role !== "all" && row.category !== role) return false;
      if (status !== "all" && row.status !== status) return false;
      return true;
    });
  }, [query, role, status]);

  const totals = useMemo(() => {
    const checkedIn = MOCK_ROWS.filter((r) => r.checkOut === null).length;
    const checkedOut = MOCK_ROWS.filter((r) => r.checkOut !== null).length;
    const checkInOnTime = MOCK_ROWS.filter((r) => r.status === "check_in").length;
    return {
      total: MOCK_ROWS.length,
      checkedIn,
      checkedOut,
      checkInOnTime,
    };
  }, []);

  const tableRows = useMemo(() => {
    const rank = (category: string) => {
      const idx = ROLE_SECTION_ORDER.indexOf(category as (typeof ROLE_SECTION_ORDER)[number]);
      return idx === -1 ? 99 : idx;
    };
    return [...filtered].sort((a, b) => {
      const byGroup = rank(a.category) - rank(b.category);
      if (byGroup !== 0) return byGroup;
      return a.name.localeCompare(b.name);
    });
  }, [filtered]);

  return (
    <PageContainer
      title="Staff attendance"
      description="Track staff check-in and check-out activity."
      actions={
        <span className="text-sm font-semibold text-secondary">{headerDate}</span>
      }
    >
      <div className="flex min-w-0 w-full flex-col gap-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <MaterialIcon name="groups" className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Total staff
              </p>
              <p className="font-headline text-2xl font-extrabold text-on-surface">{totals.total}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700 ring-1 ring-green-100">
              <MaterialIcon name="login" className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Checked in
              </p>
              <p className="font-headline text-2xl font-extrabold text-on-surface">
                {totals.checkedIn}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-secondary ring-1 ring-outline-variant/20">
              <MaterialIcon name="logout" className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Checked out
              </p>
              <p className="font-headline text-2xl font-extrabold text-on-surface">
                {totals.checkedOut}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-l-primary p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MaterialIcon name="timer" className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                On time
              </p>
              <p className="font-headline text-2xl font-extrabold text-on-surface">
                {totals.checkInOnTime}
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="min-w-0 flex-1">
              <Input
                placeholder="Search staff name…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                left={<MaterialIcon name="search" className="text-secondary" />}
                aria-label="Search staff by name"
              />
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <SelectField
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="all">All roles</option>
                <option value="Kitchen Staff">Kitchen staff</option>
                <option value="Delivery Staff">Delivery staff</option>
                <option value="Management">Management</option>
              </SelectField>
              <SelectField
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="check_in">Check-in</option>
                <option value="checkout">Checkout</option>
                <option value="late">Late</option>
                <option value="overtime">Overtime</option>
              </SelectField>
              <div className="space-y-2">
                <label
                  htmlFor="attendance-date"
                  className="ml-1 text-xs font-bold uppercase tracking-widest text-secondary"
                >
                  Date
                </label>
                <Input
                  id="attendance-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {filtered.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="font-semibold text-on-surface">No rows match your filters</p>
            <p className="mt-1 text-sm text-secondary">Try clearing search or widening role and status.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b border-outline-variant/20 bg-surface-container-low/60">
                    <tr>
                      <th className="px-4 py-3 font-bold text-secondary">Staff</th>
                      <th className="px-4 py-3 font-bold text-secondary">Role</th>
                      <th className="px-4 py-3 font-bold text-secondary">Check-in</th>
                      <th className="px-4 py-3 font-bold text-secondary">Check-out</th>
                      <th className="px-4 py-3 font-bold text-secondary">Total hours</th>
                      <th className="px-4 py-3 font-bold text-secondary">Status</th>
                      <th className="px-4 py-3 text-right font-bold text-secondary">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/40"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold tracking-tight",
                                initialsDiscClass(row.id),
                              )}
                              aria-hidden="true"
                            >
                              {initialsFromName(row.name)}
                            </span>
                            <span className="font-semibold text-on-surface">{row.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-on-surface">{row.category}</td>
                        <td className="px-4 py-3 font-medium text-on-surface">{row.checkIn}</td>
                        <td className="px-4 py-3 font-medium text-secondary">
                          {row.checkOut ?? "—:—"}
                        </td>
                        <td
                          className={cn(
                            "px-4 py-3 font-semibold",
                            row.totalHours ? "text-primary" : "text-secondary",
                          )}
                        >
                          {row.totalHours ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone={statusBadgeTone(row.status)} className="normal-case">
                            {statusLabel(row.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {row.status === "checkout" ? (
                            <Button type="button" variant="ghost" size="sm" disabled>
                              Checked out
                            </Button>
                          ) : (
                            <Link
                              href={checkInOutCheckoutHref(row)}
                              className={checkoutLinkClass}
                            >
                              Check-out
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
        )}
      </div>
    </PageContainer>
  );
}
