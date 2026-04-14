"use client";

import { useMemo, useRef, useState } from "react";
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
import { formatGbp } from "@/lib/order-bill-math";
import { cn } from "@/lib/cn";
import {
  codCashHeldForPeriod,
  getStaffEarningsSample,
  hoursForPeriod,
  periodLaborGbp,
  type StaffEarningsPeriod,
  type StaffEarningsRecord,
  type StaffPayModel,
  type StaffRoleCategory,
} from "@/lib/staff-earnings-data";

function periodHeading(period: StaffEarningsPeriod, dateIso: string): string {
  if (period === "week") return "This week";
  if (period === "month") return "This month";
  if (!dateIso.trim()) return "By day";
  const d = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "By day";
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function dayBadgeLabel(dateIso: string): string {
  if (!dateIso.trim()) return "By day";
  const d = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "By day";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function openNativeDatePicker(input: HTMLInputElement | null) {
  if (!input) return;
  try {
    if (typeof input.showPicker === "function") {
      void input.showPicker();
      return;
    }
  } catch {
    /* showPicker can throw if not user-initiated in strict browsers */
  }
  input.focus();
  input.click();
}

const PERIOD_OPTIONS: { value: Exclude<StaffEarningsPeriod, "day">; label: string }[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];
const ROLE_FILTER_ALL = "all" as const;
const PAY_FILTER_ALL = "all" as const;

type RoleFilter = typeof ROLE_FILTER_ALL | StaffRoleCategory;
type PayFilter = typeof PAY_FILTER_ALL | StaffPayModel;

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

export function StaffEarningsClient() {
  const baseRows = useMemo(() => getStaffEarningsSample(), []);
  const [period, setPeriod] = useState<StaffEarningsPeriod>("week");
  const [selectedDate, setSelectedDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(ROLE_FILTER_ALL);
  const [payFilter, setPayFilter] = useState<PayFilter>(PAY_FILTER_ALL);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseRows.filter((row) => {
      if (roleFilter !== ROLE_FILTER_ALL && row.roleCategory !== roleFilter) return false;
      if (payFilter !== PAY_FILTER_ALL && row.payModel !== payFilter) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q) ||
        row.roleCategory.toLowerCase().includes(q)
      );
    });
  }, [baseRows, payFilter, query, roleFilter]);

  const totals = useMemo(() => {
    let labor = 0;
    let cod = 0;
    for (const row of filtered) {
      labor += periodLaborGbp(row, period);
      cod += codCashHeldForPeriod(row, period);
    }
    return { labor, cod };
  }, [filtered, period]);

  const periodLabel = useMemo(
    () => periodHeading(period, selectedDate),
    [period, selectedDate],
  );

  return (
    <PageContainer
      title="Staff earnings"
      description="Labor cost by period, pay model, and hours. Delivery COD shows cash still with drivers for settlement."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">Payroll ({periodLabel})</p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-on-surface">
            {formatGbp(totals.labor)}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">Filtered rows only</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">COD with drivers</p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-on-surface">
            {formatGbp(totals.cod)}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">Awaiting remittance</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-on-surface-variant">People in view</p>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-on-surface">
            {filtered.length}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">After filters</p>
        </Card>
      </div>

      <Card className="p-5">
        <input
          ref={dateInputRef}
          id="staff-earnings-date"
          name="staff-earnings-date"
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setPeriod("day");
          }}
          tabIndex={-1}
          className="sr-only"
          aria-hidden="true"
        />
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Earnings period"
        >
          {PERIOD_OPTIONS.map(({ value, label }) => {
            const selected = period === value;
            return (
              <button
                key={value}
                type="button"
                className={cn(
                  "rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest",
                )}
                aria-pressed={selected}
                aria-label={label}
                onClick={() => {
                  setPeriod(value);
                  setSelectedDate("");
                }}
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
          <button
            type="button"
            className={cn(
              "rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest",
            )}
            aria-pressed={period === "day"}
            aria-controls="staff-earnings-date"
            aria-label={
              selectedDate.trim()
                ? `By day, ${dayBadgeLabel(selectedDate)}. Change date`
                : "By day, choose date"
            }
            onClick={() => {
              setPeriod("day");
              queueMicrotask(() => openNativeDatePicker(dateInputRef.current));
            }}
          >
            <Badge
              size="md"
              tone={period === "day" ? "primary" : "neutral"}
              className={cn(
                "max-w-[12rem] truncate normal-case tracking-normal font-bold",
                period !== "day" && "opacity-80",
              )}
            >
              {dayBadgeLabel(selectedDate)}
            </Badge>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Search"
            name="staff-earnings-search"
            placeholder="Name, email, or role"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SelectField
            label="Team"
            name="staff-earnings-role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          >
            <option value={ROLE_FILTER_ALL}>All teams</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Front of house">Front of house</option>
            <option value="Delivery">Delivery</option>
            <option value="Management">Management</option>
          </SelectField>
          <SelectField
            label="Pay model"
            name="staff-earnings-pay"
            value={payFilter}
            onChange={(e) => setPayFilter(e.target.value as PayFilter)}
          >
            <option value={PAY_FILTER_ALL}>All</option>
            <option value="hourly">Hourly</option>
            <option value="monthly">Monthly</option>
          </SelectField>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Staff</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Pay</TableHeaderCell>
              <TableHeaderCell className="text-right">Hours ({periodLabel})</TableHeaderCell>
              <TableHeaderCell className="text-right">Rate / salary</TableHeaderCell>
              <TableHeaderCell className="text-right">Labor ({periodLabel})</TableHeaderCell>
              <TableHeaderCell className="text-right">COD held</TableHeaderCell>
              <TableHeaderCell className="text-right">Net</TableHeaderCell>
              <TableHeaderCell>Notes</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-12 text-center text-sm font-medium text-secondary"
                >
                  No staff match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => {
                const hours = hoursForPeriod(row, period);
                const labor = periodLaborGbp(row, period);
                const cod = codCashHeldForPeriod(row, period);
                const netAfterCod = labor - cod;
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-on-surface">{row.name}</span>
                        <span className="text-sm text-secondary">{row.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-on-surface">{row.role}</span>
                    </TableCell>
                    <TableCell>
                      <Badge tone={row.payModel === "hourly" ? "success" : "neutral"}>
                        {payModelLabel(row.payModel)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-on-surface">
                      {formatHours(hours)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold tabular-nums text-on-surface">
                      {rateColumnLabel(row)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-on-surface">
                      {formatGbp(labor)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-on-surface">
                      {cod > 0 ? formatGbp(cod) : "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        netAfterCod < 0 ? "text-error" : "text-on-surface",
                      )}
                    >
                      {formatGbp(netAfterCod)}
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-secondary">
                      {row.settlementNote ?? "—"}
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
