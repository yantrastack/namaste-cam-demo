export type OrderStatus = "delivered" | "in_transit" | "preparing" | "cancelled";

export type SampleRecentOrder = {
  orderId: string;
  customerName: string;
  restaurant: string;
  status: OrderStatus;
  amountFormatted: string;
};

export type KpiDelta =
  | { kind: "percent"; value: string }
  | { kind: "stable" }
  | { kind: "count"; value: number; label: string };

export type SampleKpi = {
  label: string;
  value: string;
  icon: "shopping_cart" | "payments" | "group" | "storefront";
  delta: KpiDelta;
  accent: "primary" | "amber" | "blue" | "purple";
};

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
  orders: SampleRecentOrder[];
  trendCurrent: number[];
  trendPrevious: number[];
};

const FIRST_NAMES = [
  "Jane",
  "Michael",
  "Elena",
  "Robert",
  "Priya",
  "James",
  "Sofia",
  "Daniel",
  "Aisha",
  "Chris",
];

const LAST_NAMES = [
  "Doe",
  "Scott",
  "Hunt",
  "King",
  "Nair",
  "Lee",
  "Martinez",
  "Patel",
  "Brown",
  "Nguyen",
];

const RESTAURANTS = [
  "The Silver Plate",
  "Dunder Bistro",
  "Kyoto Sushi",
  "Burger Palace",
  "Namaste Thali House",
  "Coastal Catch",
  "Urban Greens",
  "Fireside Grill",
];

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

function randomOrderId() {
  return `#ORD-${randInt(8000, 9999)}`;
}

function randomStatus(): OrderStatus {
  const r = Math.random();
  if (r < 0.35) return "delivered";
  if (r < 0.55) return "in_transit";
  if (r < 0.85) return "preparing";
  return "cancelled";
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
  const activeRestaurants = randInt(420, 1_800);

  const kpis: SampleKpi[] = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString("en-US"),
      icon: "shopping_cart",
      delta:
        Math.random() > 0.2
          ? { kind: "percent", value: `+${(Math.random() * 18 + 2).toFixed(1)}%` }
          : { kind: "stable" },
      accent: "primary",
    },
    {
      label: "Total Revenue",
      value: formatUsd(totalRevenue),
      icon: "payments",
      delta:
        Math.random() > 0.25
          ? { kind: "percent", value: `+${(Math.random() * 12 + 1).toFixed(1)}%` }
          : { kind: "stable" },
      accent: "amber",
    },
    {
      label: "Active Users",
      value: activeUsers.toLocaleString("en-US"),
      icon: "group",
      delta: Math.random() > 0.4 ? { kind: "stable" } : { kind: "percent", value: `+${(Math.random() * 6 + 0.5).toFixed(1)}%` },
      accent: "blue",
    },
    {
      label: "Active Restaurants",
      value: activeRestaurants.toLocaleString("en-US"),
      icon: "storefront",
      delta:
        Math.random() > 0.35
          ? { kind: "count", value: randInt(1, 12), label: "new" }
          : { kind: "percent", value: `+${(Math.random() * 8 + 0.5).toFixed(1)}%` },
      accent: "purple",
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

  const orderCount = randInt(4, 8);
  const orders: SampleRecentOrder[] = Array.from({ length: orderCount }, () => {
    const fn = pick(FIRST_NAMES);
    const ln = pick(LAST_NAMES);
    return {
      orderId: randomOrderId(),
      customerName: `${fn} ${ln}`,
      restaurant: pick(RESTAURANTS),
      status: randomStatus(),
      amountFormatted: formatUsd(randInt(899, 89900) / 100),
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
    orders,
    trendCurrent,
    trendPrevious,
  };
}
