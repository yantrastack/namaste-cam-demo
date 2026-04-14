import type { RestaurantOrderRecord } from "@/lib/orders-restaurant-data";
import { generateDashboardSampleData } from "@/lib/dashboard-sample-data";

export type ReportMetricCard = {
  label: string;
  value: string;
  hint?: string;
};

export type DeliveryPerformanceSample = {
  onTimePct: string;
  avgRouteMin: string;
  ordersPerDriver: string;
  lateDeliveries: string;
  insight: string;
};

export type StaffLaborSummarySample = {
  hoursScheduled: string;
  hoursWorked: string;
  lateArrivals: string;
  noShows: string;
  insight: string;
};

export type PromotionsReportSample = {
  couponsRedeemed: string;
  discountValue: string;
  uniqueCustomers: string;
  topCampaign: string;
  insight: string;
};

export type MenuPerformanceSample = {
  topItem: string;
  topItemOrders: string;
  worstItem: string;
  attachRateDrinks: string;
  insight: string;
};

/** Deterministic slice from archived orders — stable between requests for the same seed set. */
export function buildOrdersReportMetrics(orders: RestaurantOrderRecord[]): {
  cards: ReportMetricCard[];
  completed: number;
  cancelled: number;
} {
  const completed = orders.filter((o) => o.status === "completed").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const delivery = orders.filter((o) => o.fulfillmentType === "delivery").length;
  const collection = orders.filter((o) => o.fulfillmentType !== "delivery").length;
  const total = orders.length;
  const cancelRate = total > 0 ? `${Math.round((cancelled / total) * 100)}%` : "—";

  const cards: ReportMetricCard[] = [
    { label: "Closed tickets", value: total.toLocaleString("en-US"), hint: "Completed + cancelled in archive" },
    { label: "Completed", value: completed.toLocaleString("en-US") },
    { label: "Cancelled", value: cancelled.toLocaleString("en-US"), hint: `Cancellation rate ${cancelRate}` },
    { label: "Delivery handoff", value: delivery.toLocaleString("en-US"), hint: `Collection ${collection.toLocaleString("en-US")}` },
  ];

  return { cards, completed, cancelled };
}

export function buildSalesReportFromDashboard() {
  const data = generateDashboardSampleData();
  return {
    kpis: data.kpis,
    revenueCategories: data.revenueCategories,
    insight: data.insight,
    trendCurrent: data.trendCurrent,
    trendPrevious: data.trendPrevious,
  };
}

export function getDeliveryPerformanceSample(): DeliveryPerformanceSample {
  return {
    onTimePct: "94.2%",
    avgRouteMin: "28 min",
    ordersPerDriver: "11.4",
    lateDeliveries: "6",
    insight:
      "Late clusters map to Friday dinner rush; consider an extra rider 17:00–20:00 for CB2 postcodes.",
  };
}

export function getStaffLaborSummarySample(): StaffLaborSummarySample {
  return {
    hoursScheduled: "1,248",
    hoursWorked: "1,189",
    lateArrivals: "23",
    noShows: "4",
    insight: "Attendance is strongest mid-week; Sunday brunch shift shows the most late arrivals.",
  };
}

export function getPromotionsReportSample(): PromotionsReportSample {
  return {
    couponsRedeemed: "1,842",
    discountValue: "£4,960",
    uniqueCustomers: "1,103",
    topCampaign: "Weekend curry bundle",
    insight: "Bundled mains + drinks outperform flat percentage codes for average basket size.",
  };
}

export function getMenuPerformanceSample(): MenuPerformanceSample {
  return {
    topItem: "Butter chicken & naan",
    topItemOrders: "428",
    worstItem: "Seasonal pickle tray",
    attachRateDrinks: "38%",
    insight: "Wing starters show the highest repeat rate; consider featuring them in push notifications.",
  };
}
