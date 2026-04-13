"use client";

import Image from "next/image";
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

type RowStatus = "active" | "late" | "completed";

type AttendanceRow = {
  id: string;
  category: string;
  name: string;
  /** Matches a role on the check-in/out screen for deep links. */
  defaultPunchRole: string;
  avatarUrl: string;
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
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHLajKyimQyGESuCj0IGy-hUkCqUx0Aah7NaAKNQwDHGOzAQQ2GuFvIU5_7X67qvpa4Mklf5c0YJOFXGj4f1KfTlxHzGNyW6OnqiIVT68OfceeY4ktfe7JufYcFQHHCLx71USAqSW863DTWFAES_6wRisnPYGZdLC9FTNoiFtvElVJCGlbfqFVSObJhEbmRr4ZOFlN8q9RimhIjlvgoBaSaA5EMRtvBMlAb9yNYZEdEgEBXds_vRW4y7-M_o78xqWy1GuTllZwYN0",
    checkIn: "09:30 AM",
    checkOut: null,
    totalHours: "8h 15m",
    status: "active",
  },
  {
    id: "2",
    category: "Kitchen Staff",
    name: "Elena Rodriguez",
    defaultPunchRole: "Pastry chef",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEffu9YXH9aruk8Sd2T9AP9r7sW69FBve9bqUSq7ILQshbwEnFBtx4TEF4mCANtYWyDUz7W5ELelrZMuw9k_coZnNhpzckG472vZTgDmvGwQasUhwFluIQvXQ-asnfU52RXDDFU5p_gAMNsjTjWYcScoXNXRWp8INMUevmTPc2FJSQeWRf9FPeiZJdJqvHnz9no7foPp83tWvY5oSePbjV44WF_gP6s80WQ5g-RM8S4ISXD1YGUTAF35RQlPA8yyrk9c5wkUvi_aQ",
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
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSRWzZK2RnD7KG1rvGCaQY1lGLU0voJXQQGTtzbDSExfxFTvjatFRFa0DPyH83ZBBwqZ0sgW0gWJQOekQbES_5DOAmchuKS3ClyPmk62gndv5wG8PulMRaecsKZKkST9bXWLT50zbXpv556qp6x9MZUjdiLz3-YeWJJIwj8hdo8kK5XqRMyHsgMyzjNrg1oFhTsdPH3zQ-3sz8emZiA_vZxCkZ0s8LPOf1N9FMke9aWCJ6E76aUd29M4xE_a36ew2lMczlr0QCl2M",
    checkIn: "08:45 AM",
    checkOut: "05:00 PM",
    totalHours: "8h 15m",
    status: "completed",
  },
  {
    id: "4",
    category: "Management",
    name: "Sarah Thompson",
    defaultPunchRole: "Floor manager",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCto_nrbq5CccRRrPYdgXFD_1Lk4M2sw7kdPrASoR0xwTBseo36K285FVqHbEtRt-_BmwL9z_kVjOyX3DbIPuus2SIpf3vfpAlrZii5s49glEkYanRMxfdDuiUf025LNZA2iIPAMcR16LQpjAHHdDfWsef3bC6kf_w19wOZv45IiV5m74rAnFae4GzZnKh9T1zQK3cxij58vsOyTjbk7X1jtog2sVK9VtPEHo-1SO5enEKNA3X2ZAzuwBRRNhVXjkAlciRXItCkLoE",
    checkIn: "08:00 AM",
    checkOut: null,
    totalHours: "7h 30m",
    status: "active",
  },
];

function statusBadgeTone(s: RowStatus): "success" | "error" | "neutral" {
  if (s === "active") return "success";
  if (s === "late") return "error";
  return "neutral";
}

function statusLabel(s: RowStatus): string {
  if (s === "active") return "Active";
  if (s === "late") return "Late";
  return "Completed";
}

function checkInOutCheckoutHref(row: AttendanceRow): string {
  const qs = new URLSearchParams({
    staff: row.name,
    role: row.defaultPunchRole,
    intent: "check-out",
  });
  return `/staff/check-in-out?${qs.toString()}`;
}

const checkoutLinkClass =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary bg-transparent px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95";

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
    const activeNow = MOCK_ROWS.filter((r) => r.status === "active").length;
    return {
      total: MOCK_ROWS.length,
      checkedIn,
      checkedOut,
      activeNow,
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, AttendanceRow[]>();
    for (const row of filtered) {
      const key = row.category;
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    return map;
  }, [filtered]);

  return (
    <PageContainer
      title="Staff attendance"
      description="Track staff check-in and check-out activity."
      actions={
        <span className="text-sm font-semibold text-secondary">{headerDate}</span>
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
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
                Active now
              </p>
              <p className="font-headline text-2xl font-extrabold text-on-surface">
                {totals.activeNow}
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
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="late">Late</option>
                <option value="completed">Completed</option>
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

        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([title, rows]) => (
            <section key={title} className="space-y-3">
              <h2 className="font-headline text-lg font-extrabold text-on-surface">{title}</h2>
              <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="border-b border-outline-variant/20 bg-surface-container-low/60">
                      <tr>
                        <th className="px-4 py-3 font-bold text-secondary">Staff</th>
                        <th className="px-4 py-3 font-bold text-secondary">Check-in</th>
                        <th className="px-4 py-3 font-bold text-secondary">Check-out</th>
                        <th className="px-4 py-3 font-bold text-secondary">Total hours</th>
                        <th className="px-4 py-3 font-bold text-secondary">Status</th>
                        <th className="px-4 py-3 text-right font-bold text-secondary">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/40"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Image
                                src={row.avatarUrl}
                                alt=""
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover ring-1 ring-outline-variant/20"
                              />
                              <span className="font-semibold text-on-surface">{row.name}</span>
                            </div>
                          </td>
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
                            {row.status === "completed" ? (
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
            </section>
          ))}
          {filtered.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="font-semibold text-on-surface">No rows match your filters</p>
              <p className="mt-1 text-sm text-secondary">Try clearing search or widening role and status.</p>
            </Card>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}
