export type CampaignNotificationType = "order" | "promotion";

export type CampaignNotificationItem = {
  id: string;
  type: CampaignNotificationType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: string;
  badge?: string;
  image?: string;
  actions?: { label: string; primary: boolean }[];
};

export type AdminSystemNotification = {
  id: string;
  event: string;
  orderId: string;
  actor: string;
  occurredAt: string;
  detail: string;
};

export type DeliveredNotificationRow = {
  id: string;
  orderId: string;
  customer: string;
  driver: string;
  deliveredAt: string;
  area: string;
};

/** Unified in-app style rows for header popover + admin feed (swap for Novu later). */
export type AdminActivityNotificationKind =
  | "order"
  | "payment"
  | "delivery"
  | "refund"
  | "system";

export type AdminActivityNotification = {
  id: string;
  kind: AdminActivityNotificationKind;
  title: string;
  description: string;
  timeLabel: string;
  unread: boolean;
  orderId?: string;
};

/** How many items to show in the dashboard header popover. */
export const ADMIN_HEADER_NOTIFICATION_LIMIT = 5;

/** Full sample feed length for the admin notifications screen. */
export const ADMIN_ACTIVITY_FEED_DISPLAY_LIMIT = 15;

export const campaignNotificationsSample: CampaignNotificationItem[] = [
  {
    id: "c1",
    type: "order",
    title: "Weekend tasting — seats filling fast",
    description:
      "Push reminder for guests who saved the weekend tasting menu. Chef confirmations close Friday 6pm.",
    time: "12 min ago",
    unread: true,
    icon: "restaurant",
    actions: [{ label: "View campaign", primary: true }, { label: "Edit draft", primary: false }],
  },
  {
    id: "c2",
    type: "promotion",
    title: "30% off editorial picks",
    description:
      "Curated collection discount for loyalty tier Gold and above. Copy approved by marketing.",
    time: "3 hr ago",
    unread: false,
    icon: "star",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDZK3tdQTZotJ_jiwyi1FE0lWmrSoNlpbsjF_QfzbIpIsSj3qfheRwjWdNIb3OC6Wze4kL6xmuQuia3OXj0jb3WZeYigdASjQwvhu5khgEylKbKbrQvlsn329yENOlEB2TJYQp7xZFPxOzQAZTMwgwVR0CUYrTuzazRSE-KJ1Tn9tfEM6EXM64qF0WAq6T3VynWFjcn03R-uuQEXuCenzfrDWCUBLldsPpkuksUtqL4fP9ZxTtZbqn0zBt4XLdmNNZqrTbXG5kG3o",
    badge: "LIMITED TIME",
  },
  {
    id: "c3",
    type: "order",
    title: "Driver handoff completed",
    description:
      "Automated ping when drivers mark arrival at the handoff bay. Used for SLA dashboards.",
    time: "Yesterday",
    unread: false,
    icon: "receipt_long",
  },
];

export const adminSystemNotificationsSample: AdminSystemNotification[] = [
  {
    id: "a1",
    event: "Order created",
    orderId: "ORD-99102",
    actor: "Web · guest checkout",
    occurredAt: "Apr 14, 2026 · 2:41 PM",
    detail: "Basket submitted, payment authorized",
  },
  {
    id: "a2",
    event: "Order created",
    orderId: "ORD-99101",
    actor: "App · Priya Sharma",
    occurredAt: "Apr 14, 2026 · 2:38 PM",
    detail: "Scheduled for 6:30 PM pickup",
  },
  {
    id: "a3",
    event: "Refund requested",
    orderId: "ORD-99088",
    actor: "Support · agent m.chen",
    occurredAt: "Apr 14, 2026 · 1:12 PM",
    detail: "Partial refund · missing side dish",
  },
  {
    id: "a4",
    event: "Order created",
    orderId: "ORD-99072",
    actor: "POS · The Parisian Bistro",
    occurredAt: "Apr 13, 2026 · 9:05 PM",
    detail: "Walk-in converted to delivery",
  },
  {
    id: "a5",
    event: "Payment captured",
    orderId: "ORD-99055",
    actor: "Stripe · webhook",
    occurredAt: "Apr 13, 2026 · 7:22 PM",
    detail: "Charge succeeded · £42.80",
  },
  {
    id: "a6",
    event: "Checkout abandoned",
    orderId: "—",
    actor: "Web · session cart",
    occurredAt: "Apr 13, 2026 · 6:10 PM",
    detail: "Cart held 28m then expired",
  },
  {
    id: "a7",
    event: "Order created",
    orderId: "ORD-99031",
    actor: "App · Daniel Hughes",
    occurredAt: "Apr 13, 2026 · 1:45 PM",
    detail: "Leave at door · contactless",
  },
  {
    id: "a8",
    event: "Refund completed",
    orderId: "ORD-99012",
    actor: "Finance · auto rule",
    occurredAt: "Apr 12, 2026 · 4:02 PM",
    detail: "Full refund after SLA breach",
  },
  {
    id: "a9",
    event: "Order created",
    orderId: "ORD-98998",
    actor: "Web · guest checkout",
    occurredAt: "Apr 12, 2026 · 11:18 AM",
    detail: "Large order · kitchen flagged",
  },
  {
    id: "a10",
    event: "Payout scheduled",
    orderId: "—",
    actor: "Ledger · weekly batch",
    occurredAt: "Apr 12, 2026 · 8:00 AM",
    detail: "Restaurant batch #448 queued",
  },
];

export const deliveredNotificationsSample: DeliveredNotificationRow[] = [
  {
    id: "d1",
    orderId: "ORD-99102",
    customer: "Alex Morgan",
    driver: "Jamal Rivers",
    deliveredAt: "Apr 14, 2026 · 3:02 PM",
    area: "Cambridge — CB2",
  },
  {
    id: "d2",
    orderId: "ORD-99064",
    customer: "Wei Chen",
    driver: "Sofia Alvarez",
    deliveredAt: "Apr 14, 2026 · 2:51 PM",
    area: "Cambridge — CB1",
  },
  {
    id: "d3",
    orderId: "ORD-99041",
    customer: "Hannah Okafor",
    driver: "Jamal Rivers",
    deliveredAt: "Apr 14, 2026 · 1:18 PM",
    area: "Cambridge — CB5",
  },
  {
    id: "d4",
    orderId: "ORD-99012",
    customer: "Noah Patel",
    driver: "Elena Rossi",
    deliveredAt: "Apr 13, 2026 · 8:44 PM",
    area: "Cambridge — CB3",
  },
  {
    id: "d5",
    orderId: "ORD-98988",
    customer: "Iris Campbell",
    driver: "Jamal Rivers",
    deliveredAt: "Apr 13, 2026 · 6:12 PM",
    area: "Cambridge — CB4",
  },
  {
    id: "d6",
    orderId: "ORD-98971",
    customer: "Marcus Webb",
    driver: "Sofia Alvarez",
    deliveredAt: "Apr 13, 2026 · 12:30 PM",
    area: "Cambridge — CB2",
  },
  {
    id: "d7",
    orderId: "ORD-98955",
    customer: "Yuki Tanaka",
    driver: "Elena Rossi",
    deliveredAt: "Apr 12, 2026 · 7:55 PM",
    area: "Cambridge — CB1",
  },
  {
    id: "d8",
    orderId: "ORD-98940",
    customer: "Samira Khan",
    driver: "Jamal Rivers",
    deliveredAt: "Apr 12, 2026 · 1:05 PM",
    area: "Cambridge — CB5",
  },
];

export const adminActivityFeedSample: AdminActivityNotification[] = [
  {
    id: "f1",
    kind: "order",
    title: "New order",
    description: "Guest checkout · basket submitted and payment authorized.",
    timeLabel: "2 min ago",
    unread: true,
    orderId: "ORD-99102",
  },
  {
    id: "f2",
    kind: "order",
    title: "New order",
    description: "App customer scheduled pickup for 6:30 PM.",
    timeLabel: "5 min ago",
    unread: true,
    orderId: "ORD-99101",
  },
  {
    id: "f3",
    kind: "payment",
    title: "Payment captured",
    description: "Stripe charge succeeded for scheduled order.",
    timeLabel: "6 min ago",
    unread: true,
    orderId: "ORD-99101",
  },
  {
    id: "f4",
    kind: "delivery",
    title: "Out for delivery",
    description: "Driver picked up from The Parisian Bistro.",
    timeLabel: "18 min ago",
    unread: false,
    orderId: "ORD-99088",
  },
  {
    id: "f5",
    kind: "delivery",
    title: "Delivered",
    description: "Handoff confirmed · contactless drop-off.",
    timeLabel: "24 min ago",
    unread: false,
    orderId: "ORD-99102",
  },
  {
    id: "f6",
    kind: "refund",
    title: "Refund requested",
    description: "Support opened partial refund · missing side.",
    timeLabel: "1 hr ago",
    unread: false,
    orderId: "ORD-99088",
  },
  {
    id: "f7",
    kind: "order",
    title: "New order",
    description: "POS walk-in converted to delivery.",
    timeLabel: "3 hr ago",
    unread: false,
    orderId: "ORD-99072",
  },
  {
    id: "f8",
    kind: "payment",
    title: "Payment captured",
    description: "Wallet debit · loyalty discount applied.",
    timeLabel: "3 hr ago",
    unread: false,
    orderId: "ORD-99072",
  },
  {
    id: "f9",
    kind: "system",
    title: "Webhook delivery failed",
    description: "Partner POS sync · retry scheduled.",
    timeLabel: "5 hr ago",
    unread: false,
  },
  {
    id: "f10",
    kind: "delivery",
    title: "Delivered",
    description: "Customer signature on tablet.",
    timeLabel: "6 hr ago",
    unread: false,
    orderId: "ORD-99064",
  },
  {
    id: "f11",
    kind: "order",
    title: "New order",
    description: "Large order · kitchen prep time extended.",
    timeLabel: "Yesterday",
    unread: false,
    orderId: "ORD-99031",
  },
  {
    id: "f12",
    kind: "payment",
    title: "Payout completed",
    description: "Weekly restaurant settlement posted.",
    timeLabel: "Yesterday",
    unread: false,
  },
  {
    id: "f13",
    kind: "delivery",
    title: "Delivered",
    description: "Driver photo proof uploaded.",
    timeLabel: "Yesterday",
    unread: false,
    orderId: "ORD-99041",
  },
  {
    id: "f14",
    kind: "refund",
    title: "Refund completed",
    description: "Full refund after SLA breach.",
    timeLabel: "Apr 12",
    unread: false,
    orderId: "ORD-99012",
  },
  // {
  //   id: "f15",
  //   kind: "system",
  //   title: "Rate limit warning",
  //   description: "Public menu API · 90% of hourly quota.",
  //   timeLabel: "Apr 12",
  //   unread: false,
  // },
];
