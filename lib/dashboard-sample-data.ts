export type SampleKpi = {
  label: string;
  value: string;
  icon: "shopping_cart" | "payments" | "group" | "receipt_long";
  accent: "primary" | "amber" | "blue" | "purple";
};

/** Fourth dashboard tile: live active ticket count (same source as the Active orders page). */
export function buildActiveOrdersKpi(activeOrderCount: number): SampleKpi {
  return {
    label: "Active orders",
    value: activeOrderCount.toLocaleString("en-US"),
    icon: "receipt_long",
    accent: "purple",
  };
}

export type RevenueCategoryRow = {
  name: string;
  amountLabel: string;
  /** 0–100 for bar width */
  pct: number;
  /** Full Tailwind background class for the bar fill */
  barClass: "bg-primary" | "bg-primary/70" | "bg-primary/50" | "bg-primary/30";
};

export type DashboardSampleData = {
  kpis: SampleKpi[];
  revenueCategories: RevenueCategoryRow[];
  insight: string;
  trendCurrent: number[];
  trendPrevious: number[];
};

const CATEGORY_POOL = [
  "Gourmet Dining",
  "Fast Casual",
  "Desserts & Bakery",
  "Beverages",
  "Street Food",
  "Cafés",
];

const INSIGHTS = [
  "Gourmet Dining has seen strong growth this month. Consider featuring more high-end establishments.",
  "Fast Casual orders peak on weekends. Adjust rider capacity for Friday–Sunday.",
  "Beverage attach rate is up; bundle drinks with mains in featured collections.",
  "Dessert orders cluster after 8pm. Promote late-night bakery partners in-app.",
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)]!;
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatUsdCompact(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}k`;
  return formatUsd(amount);
}

function randomTrendSeries(len: number, base: number, spread: number) {
  const out: number[] = [];
  let y = base;
  for (let i = 0; i < len; i++) {
    y += (Math.random() - 0.45) * spread;
    y = Math.min(200, Math.max(24, y));
    out.push(y);
  }
  return out;
}

export function generateDashboardSampleData(): DashboardSampleData {
  const totalOrders = randInt(9_000, 22_000);
  const totalRevenue = randInt(220_000, 620_000);
  const activeUsers = randInt(14_000, 32_000);

  const kpis: SampleKpi[] = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString("en-US"),
      icon: "shopping_cart",
      accent: "primary",
    },
    {
      label: "Total Revenue",
      value: formatUsd(totalRevenue),
      icon: "payments",
      accent: "amber",
    },
    {
      label: "Active Users",
      value: activeUsers.toLocaleString("en-US"),
      icon: "group",
      accent: "blue",
    },
  ];

  const shuffledCats = [...CATEGORY_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
  const barClasses = ["bg-primary", "bg-primary/70", "bg-primary/50", "bg-primary/30"] as const;
  const revenueCategories: RevenueCategoryRow[] = shuffledCats.map((name, i) => {
    const base = randInt(18_000, 220_000) - i * randInt(2_000, 12_000);
    const pct = Math.max(12, 88 - i * randInt(10, 22));
    return {
      name,
      amountLabel: formatUsdCompact(Math.max(8_000, base)),
      pct,
      barClass: barClasses[i] ?? "bg-primary/30",
    };
  });

  const trendCurrent = randomTrendSeries(7, randInt(80, 140), 28);
  const trendPrevious = trendCurrent.map((y) =>
    Math.min(200, Math.max(24, y + randInt(-35, 45))),
  );

  return {
    kpis,
    revenueCategories,
    insight: pick(INSIGHTS),
    trendCurrent,
    trendPrevious,
  };
}
