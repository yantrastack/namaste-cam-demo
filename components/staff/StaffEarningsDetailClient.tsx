"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import {
  enumerateIsoDatesInclusive,
  formatDayHeading,
  formatRangeHeading,
  getThisMonthRange,
  getThisWeekRange,
} from "@/lib/staff-earnings-date-ranges";
import { formatGbp } from "@/lib/order-bill-math";
import {
  getStaffEarningsSample,
  sampleStaffDayBreakdown,
  type StaffEarningsRecord,
  type StaffPayModel,
} from "@/lib/staff-earnings-data";

type RangePreset = "this-week" | "this-month" | "custom";

const PRESETS: { id: RangePreset; label: string }[] = [
  { id: "this-week", label: "This week" },
  { id: "this-month", label: "This month" },
];

function payModelLabel(m: StaffPayModel): string {
  return m === "hourly" ? "Hourly" : "Monthly";
}

function formatHours(h: number): string {
  return `${h % 1 === 0 ? h.toFixed(0) : h.toFixed(1)}h`;
}

function rateColumnLabel(row: StaffEarningsRecord): string {
  if (row.payModel === "hourly" && row.hourlyRateGbp != null) {
    return `${formatGbp(row.hourlyRateGbp)}/h`;
  }
  if (row.payModel === "monthly" && row.monthlySalaryGbp != null) {
    return `${formatGbp(row.monthlySalaryGbp)}/mo`;
  }
  return "—";
}

export function StaffEarningsDetailClient({ staffId }: { staffId: string }) {
  const router = useRouter();
  const allStaff = useMemo(() => getStaffEarningsSample(), []);
  const staff = useMemo(() => allStaff.find((r) => r.id === staffId), [allStaff, staffId]);

  const initialRange = useMemo(() => getThisWeekRange(), []);
  const [fromIso, setFromIso] = useState(initialRange.from);
  const [toIso, setToIso] = useState(initialRange.to);
  const [preset, setPreset] = useState<RangePreset>("this-week");

  const days = useMemo(() => enumerateIsoDatesInclusive(fromIso, toIso), [fromIso, toIso]);

  const rangeLabel = useMemo(() => formatRangeHeading(fromIso, toIso), [fromIso, toIso]);

  const totals = useMemo(() => {
    if (!staff || days.length === 0) return { labor: 0, cod: 0 };
    let labor = 0;
    let cod = 0;
    for (const iso of days) {
      const d = sampleStaffDayBreakdown(staff, iso);
      labor += d.payrollGbp;
      cod += d.codGbp;
    }
    return { labor, cod };
  }, [staff, days]);

  if (!staff) {
    return null;
  }

  function applyPreset(id: RangePreset) {
    setPreset(id);
    if (id === "this-week") {
      const r = getThisWeekRange();
      setFromIso(r.from);
      setToIso(r.to);
      return;
    }
    if (id === "this-month") {
      const r = getThisMonthRange();
      setFromIso(r.from);
      setToIso(r.to);
    }
  }

  return (
    <PageContainer
      title={staff.name}
      description={
        <span>
          Daily payroll and COD for <span className="text-on-surface">{staff.email}</span> ·{" "}
          {staff.role}
        </span>
      }
      breadcrumbs={
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium" aria-label="Breadcrumb">
          <Link href="/staff/earnings" className="transition-colors hover:text-primary">
            Staff earnings
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" />
          <span className="text-on-surface">Daily breakdown</span>
        </nav>
      }
      actions={
        <Link
          href="/staff/earnings"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95",
          )}
        >
          Back to list
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Payroll ({rangeLabel})</p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-on-surface">
            {formatGbp(totals.labor)}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">{days.length} day(s) in range</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">COD with driver</p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-on-surface">
            {formatGbp(totals.cod)}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">Prorated by day in sample data</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Net after COD</p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-on-surface">
            {formatGbp(totals.labor - totals.cod)}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">Across selected days</p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">
          Staff member
        </p>
        <div className="mt-3 max-w-md">
          <SelectField
            label="View earnings for"
            name="staff-earnings-detail-staff"
            value={staffId}
            onChange={(e) => {
              router.push(`/staff/earnings/${e.target.value}`);
            }}
          >
            {allStaff.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div
          className="mt-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Date range presets"
        >
          {PRESETS.map(({ id, label }) => {
            const selected = preset === id;
            return (
              <button
                key={id}
                type="button"
                className={cn(
                  "rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest",
                )}
                aria-pressed={selected}
                aria-label={label}
                onClick={() => applyPreset(id)}
              >
                <Badge
                  size="md"
                  tone={selected ? "primary" : "neutral"}
                  className={cn(
                    "normal-case tracking-normal font-bold",
                    !selected && "opacity-80",
                  )}
                >
                  {label}
                </Badge>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="From"
            name="staff-earnings-from"
            type="date"
            value={fromIso}
            onChange={(e) => {
              setPreset("custom");
              setFromIso(e.target.value);
            }}
          />
          <Input
            label="To"
            name="staff-earnings-to"
            type="date"
            value={toIso}
            onChange={(e) => {
              setPreset("custom");
              setToIso(e.target.value);
            }}
          />
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Day</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Pay</TableHeaderCell>
              <TableHeaderCell className="tabular-nums">Check-in</TableHeaderCell>
              <TableHeaderCell className="tabular-nums">Check-out</TableHeaderCell>
              <TableHeaderCell className="text-right">Hours (day)</TableHeaderCell>
              <TableHeaderCell className="text-right">Rate / salary</TableHeaderCell>
              <TableHeaderCell className="text-right">Payroll (day)</TableHeaderCell>
              <TableHeaderCell className="text-right">COD held</TableHeaderCell>
              <TableHeaderCell className="text-right">Net</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-12 text-center text-sm font-medium text-secondary"
                >
                  Choose a valid date range.
                </TableCell>
              </TableRow>
            ) : (
              days.map((iso) => {
                const d = sampleStaffDayBreakdown(staff, iso);
                const netAfterCod = d.payrollGbp - d.codGbp;
                const absent = d.kind === "absent";
                return (
                  <TableRow key={iso}>
                    <TableCell>
                      <span className="font-semibold text-on-surface">{formatDayHeading(iso)}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          absent ? "text-secondary" : "text-on-surface",
                        )}
                      >
                        {staff.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {absent ? (
                        <Badge tone="neutral">Absent</Badge>
                      ) : (
                        <Badge tone={staff.payModel === "hourly" ? "success" : "neutral"}>
                          {payModelLabel(staff.payModel)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        absent ? "text-secondary" : "text-on-surface",
                      )}
                    >
                      {d.checkIn ?? "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        absent ? "text-secondary" : "text-on-surface",
                      )}
                    >
                      {d.checkOut ?? "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        absent ? "text-secondary" : "text-on-surface",
                      )}
                    >
                      {absent ? "—" : formatHours(d.hours)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold tabular-nums text-on-surface">
                      {rateColumnLabel(staff)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        absent ? "text-secondary" : "text-on-surface",
                      )}
                    >
                      {formatGbp(d.payrollGbp)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-on-surface">
                      {d.codGbp > 0 ? formatGbp(d.codGbp) : "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        netAfterCod < 0 ? "text-error" : "text-on-surface",
                      )}
                    >
                      {formatGbp(netAfterCod)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </PageContainer>
  );
}
