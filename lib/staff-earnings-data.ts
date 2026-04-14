/**
 * Sample staff compensation rows for admin earnings review.
 * Period hours are independent so week vs month filters show realistic variance.
 */

export type StaffPayModel = "hourly" | "monthly";

export type StaffRoleCategory = "Kitchen" | "Front of house" | "Delivery" | "Management";

export type StaffEarningsPeriod = "week" | "month" | "day";

/** Calendar days used to show a daily slice of monthly salary (sample UI). */
export const CALENDAR_DAYS_PER_MONTH = 30;

/** Calendar days in a week for prorating weekly hours / COD in “By day” view. */
export const CALENDAR_DAYS_PER_WEEK = 7;

export type StaffEarningsRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  roleCategory: StaffRoleCategory;
  payModel: StaffPayModel;
  /** GBP per hour when `payModel === "hourly"`. */
  hourlyRateGbp: number | null;
  /** Full monthly salary in GBP when `payModel === "monthly"`. */
  monthlySalaryGbp: number | null;
  hoursWorkedWeek: number;
  hoursWorkedMonth: number;
  /**
   * Cash collected on delivery (COD) still with the driver — remit to venue / finance.
   * Non-drivers should use 0.
   */
  codCashHeldGbp: number;
  /** Short admin-facing note for edge cases. */
  settlementNote?: string;
};

/** ~4.33 weeks per month for salaried weekly accrual display. */
export const WEEKS_PER_MONTH_AVG = 4.333333333333333;

export function getStaffEarningsSample(): StaffEarningsRecord[] {
  return [
    {
      id: "se-1",
      name: "James Wilson",
      email: "j.wilson@namastecam.kitchen",
      role: "Delivery driver",
      roleCategory: "Delivery",
      payModel: "hourly",
      hourlyRateGbp: 12.5,
      monthlySalaryGbp: null,
      hoursWorkedWeek: 38,
      hoursWorkedMonth: 162,
      codCashHeldGbp: 428.6,
      settlementNote: "High COD week — reconcile before Friday payout.",
    },
    {
      id: "se-2",
      name: "Priya Nair",
      email: "p.nair@namastecam.kitchen",
      role: "Delivery driver",
      roleCategory: "Delivery",
      payModel: "hourly",
      hourlyRateGbp: 12.5,
      monthlySalaryGbp: null,
      hoursWorkedWeek: 22,
      hoursWorkedMonth: 96,
      codCashHeldGbp: 0,
      settlementNote: "Card-only routes this period.",
    },
    {
      id: "se-3",
      name: "Omar Hassan",
      email: "o.hassan@namastecam.kitchen",
      role: "Delivery driver",
      roleCategory: "Delivery",
      payModel: "monthly",
      hourlyRateGbp: null,
      monthlySalaryGbp: 2400,
      hoursWorkedWeek: 45,
      hoursWorkedMonth: 188,
      codCashHeldGbp: 119.4,
      settlementNote: "Monthly pay + logged overtime (not auto-calculated).",
    },
    {
      id: "se-4",
      name: "Marcus Chen",
      email: "m.chen@namastecam.kitchen",
      role: "Cook",
      roleCategory: "Kitchen",
      payModel: "hourly",
      hourlyRateGbp: 11.75,
      monthlySalaryGbp: null,
      hoursWorkedWeek: 40,
      hoursWorkedMonth: 168,
      codCashHeldGbp: 0,
    },
    {
      id: "se-5",
      name: "Elena Rodriguez",
      email: "e.rodriguez@namastecam.kitchen",
      role: "Cook",
      roleCategory: "Kitchen",
      payModel: "hourly",
      hourlyRateGbp: 14.2,
      monthlySalaryGbp: null,
      hoursWorkedWeek: 28,
      hoursWorkedMonth: 118,
      codCashHeldGbp: 0,
      settlementNote: "Part-time schedule — under monthly FT threshold.",
    },
    {
      id: "se-6",
      name: "Sarah Thompson",
      email: "s.thompson@namastecam.kitchen",
      role: "Manager",
      roleCategory: "Management",
      payModel: "monthly",
      hourlyRateGbp: null,
      monthlySalaryGbp: 3200,
      hoursWorkedWeek: 44,
      hoursWorkedMonth: 176,
      codCashHeldGbp: 0,
    },
    {
      id: "se-7",
      name: "Alex Morgan",
      email: "a.morgan@namastecam.kitchen",
      role: "Helper",
      roleCategory: "Kitchen",
      payModel: "hourly",
      hourlyRateGbp: 10.9,
      monthlySalaryGbp: null,
      hoursWorkedWeek: 18,
      hoursWorkedMonth: 78,
      codCashHeldGbp: 0,
    },
    {
      id: "se-8",
      name: "David Okonkwo",
      email: "d.okonkwo@namastecam.kitchen",
      role: "Helper",
      roleCategory: "Kitchen",
      payModel: "hourly",
      hourlyRateGbp: 10.42,
      monthlySalaryGbp: null,
      hoursWorkedWeek: 42,
      hoursWorkedMonth: 165,
      codCashHeldGbp: 0,
    },
  ];
}

/** Typical hours attributed to one calendar day from the weekly sample total. */
export function hoursForDay(row: StaffEarningsRecord): number {
  const h = row.hoursWorkedWeek / CALENDAR_DAYS_PER_WEEK;
  return Math.round(h * 10) / 10;
}

export function hoursForPeriod(row: StaffEarningsRecord, period: StaffEarningsPeriod): number {
  if (period === "day") return hoursForDay(row);
  return period === "week" ? row.hoursWorkedWeek : row.hoursWorkedMonth;
}

/** Labor cost for the selected period (GBP). */
export function periodLaborGbp(row: StaffEarningsRecord, period: StaffEarningsPeriod): number {
  if (period === "day") {
    if (row.payModel === "hourly") {
      const rate = row.hourlyRateGbp ?? 0;
      return hoursForDay(row) * rate;
    }
    const monthly = row.monthlySalaryGbp ?? 0;
    return monthly / CALENDAR_DAYS_PER_MONTH;
  }
  if (row.payModel === "hourly") {
    const rate = row.hourlyRateGbp ?? 0;
    return hoursForPeriod(row, period) * rate;
  }
  const monthly = row.monthlySalaryGbp ?? 0;
  return period === "week" ? monthly / WEEKS_PER_MONTH_AVG : monthly;
}

/** COD attributed to the period (full week/month sample, or prorated for one day). */
export function codCashHeldForPeriod(row: StaffEarningsRecord, period: StaffEarningsPeriod): number {
  if (period === "day") {
    return Math.round((row.codCashHeldGbp / CALENDAR_DAYS_PER_WEEK) * 100) / 100;
  }
  return row.codCashHeldGbp;
}
