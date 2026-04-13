import type { DiscountMode } from "@/lib/order-bill-math";

export type OrderStatus = "draft" | "active" | "preparing" | "ready" | "completed" | "cancelled";

export type OrderCancellationMeta = {
  reason: string;
  /** Finance / POS: refund or return payment to guest. */
  returnPayment: boolean;
  cancelledAtLabel: string;
};

export type CatalogProduct = {
  id: string;
  name: string;
  detail: string;
  category: string;
  unitPriceExTax: number;
};

export type OrderBillLine = {
  id: string;
  productId: string;
  quantity: number;
  unitPriceExTax: number;
  /** When true, kitchen should prepare this line. Omitted lines infer from product category (Bar → false). */
  needsKitchen?: boolean;
};

export type PaymentMethod = "card" | "cash" | "wallet";

/** Settled tender shown on history / receipt (broader than split-line `PaymentMethod`). */
export type CheckoutPaymentSummary =
  | "cash"
  | "card"
  | "wallet"
  | "subscription"
  | "multiple"
  | "credit"
  | "upi";

export type PaymentSplitRow = {
  id: string;
  method: PaymentMethod;
  amount: string;
};

/** Guest-requested handoff: courier delivery vs pickup at the store. */
export type OrderFulfillmentType = "delivery" | "collection";

export type RestaurantOrderRecord = {
  id: string;
  code: string;
  status: OrderStatus;
  /** Delivery to address vs collection at venue. Defaults to collection when omitted (older archives). */
  fulfillmentType?: OrderFulfillmentType;
  venueLabel: string;
  /** UK postcode (e.g. SW1A 1AA, CB2 1TP). */
  postcode: string;
  /** ISO-ish display string */
  placedAtLabel: string;
  serverName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  /** Table, room, or pass (in-house substitute for delivery map). */
  serviceLocation?: string;
  serviceLocationNote?: string;
  /** Shown in the priority callout on the detail screen. */
  priorityNote?: string;
  lines: OrderBillLine[];
  internalNotes: string;
  taxIncluded: boolean;
  discountMode: DiscountMode;
  discountValue: number;
  payments: PaymentSplitRow[];
  /** Filled for closed tickets — delivery or hand-off time for history. */
  completedAtLabel?: string;
  /** How the guest settled (history table + archive detail). */
  checkoutPaymentSummary?: CheckoutPaymentSummary;
  /** Present when the ticket was voided or declined after confirmation. */
  cancellation?: OrderCancellationMeta;
};

export const RESTAURANT_PRODUCT_CATALOG: CatalogProduct[] = [
  {
    id: "prd-ribeye",
    name: "Grilled Ribeye Steak",
    detail: "Chef's special • Medium rare",
    category: "Main Course",
    unitPriceExTax: 52,
  },
  {
    id: "prd-truffle-pasta",
    name: "Black Truffle Tagliatelle",
    detail: "Butter emulsion • Aged parmesan",
    category: "Pasta",
    unitPriceExTax: 38,
  },
  {
    id: "prd-saffron-old",
    name: "Saffron Old Fashioned",
    detail: "Bourbon • Saffron bitters • Orange zest",
    category: "Bar",
    unitPriceExTax: 16,
  },
  {
    id: "prd-burrata",
    name: "Heirloom Burrata",
    detail: "Stone fruit • Basil oil • Sourdough",
    category: "Starter",
    unitPriceExTax: 18,
  },
  {
    id: "prd-tandoori",
    name: "Tandoori Cauliflower Steak",
    detail: "Mint chutney • Pickled onion",
    category: "Main Course",
    unitPriceExTax: 26,
  },
  {
    id: "prd-gulab",
    name: "Gulab Jamun Brûlée",
    detail: "Pistachio crumble • Rose cream",
    category: "Dessert",
    unitPriceExTax: 12,
  },
  {
    id: "prd-masala-chai",
    name: "Smoked Masala Chai",
    detail: "Oat milk • Black cardamom",
    category: "Bar",
    unitPriceExTax: 6.5,
  },
  {
    id: "prd-dosa",
    name: "Paper Masala Dosa",
    detail: "Sambar • Coconut chutney",
    category: "Main Course",
    unitPriceExTax: 14,
  },
];

const catalogById = new Map(RESTAURANT_PRODUCT_CATALOG.map((p) => [p.id, p]));

export function getCatalogProduct(id: string): CatalogProduct | undefined {
  return catalogById.get(id);
}

/** Normalise for sorting / matching (removes spaces, uppercases). */
export function normalizeUkPostcode(postcode: string) {
  return postcode.replace(/\s+/g, "").toUpperCase();
}

function line(id: string, productId: string, quantity: number, needsKitchen?: boolean): OrderBillLine {
  const p = catalogById.get(productId);
  if (!p) throw new Error(`Unknown product ${productId}`);
  const kitchen = needsKitchen ?? p.category !== "Bar";
  return {
    id,
    productId,
    quantity,
    unitPriceExTax: p.unitPriceExTax,
    needsKitchen: kitchen,
  };
}

export function getOrderFulfillmentType(order: RestaurantOrderRecord): OrderFulfillmentType {
  return order.fulfillmentType ?? "collection";
}

export function formatOrderFulfillmentType(order: RestaurantOrderRecord): string {
  return getOrderFulfillmentType(order) === "delivery" ? "Delivery" : "Collection";
}

export function resolveLineNeedsKitchen(line: OrderBillLine, productCategory: string): boolean {
  if (line.needsKitchen !== undefined) return line.needsKitchen;
  return productCategory !== "Bar";
}

export const RESTAURANT_ORDERS_SEED: RestaurantOrderRecord[] = [
  {
    id: "ord-ss-8291",
    code: "SS-8291",
    status: "active",
    fulfillmentType: "delivery",
    venueLabel: "Flagship dining",
    postcode: "SW1A 1AA",
    placedAtLabel: "Today, 14:22",
    serverName: "Marc A.",
    customerName: "Benjamin Harrison",
    customerPhone: "+44 20 7123 4567",
    customerEmail: "benjamin.harrison@example.com",
    serviceLocation: "Table 12 · Window banquette",
    serviceLocationNote: "Host has been notified for birthday dessert.",
    priorityNote: "Premium seating — keep coursing within 45 minutes.",
    lines: [
      line("ln-1", "prd-ribeye", 1),
      line("ln-2", "prd-truffle-pasta", 1),
      line("ln-3", "prd-saffron-old", 1),
    ],
    internalNotes: "Guest prefers still water. Birthday candle on dessert course.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    payments: [
      { id: "pay-1", method: "card", amount: "100.00" },
      { id: "pay-2", method: "cash", amount: "" },
    ],
  },
  {
    id: "ord-ss-8292",
    code: "SS-8292",
    status: "preparing",
    fulfillmentType: "collection",
    venueLabel: "Flagship dining",
    postcode: "E1 6AN",
    placedAtLabel: "Today, 14:05",
    serverName: "Priya K.",
    customerName: "Elena Rostova",
    customerPhone: "+44 20 7946 0958",
    customerEmail: "elena.rostova@example.com",
    serviceLocation: "Chef's counter · Seat 3",
    lines: [
      line("ln-4", "prd-burrata", 2),
      line("ln-5", "prd-tandoori", 1),
      line("ln-6", "prd-masala-chai", 2),
    ],
    internalNotes: "",
    taxIncluded: false,
    discountMode: "flat",
    discountValue: 4,
    payments: [{ id: "pay-3", method: "wallet", amount: "" }],
  },
  {
    id: "ord-ss-8288",
    code: "SS-8288",
    status: "ready",
    fulfillmentType: "collection",
    venueLabel: "Patio & bar",
    postcode: "CB2 1TP",
    placedAtLabel: "Today, 13:40",
    serverName: "Marc A.",
    customerName: "Jordan Lee",
    customerPhone: "+44 1223 461234",
    customerEmail: "jordan.lee@example.com",
    serviceLocation: "Bar pickup · North pass",
    lines: [line("ln-7", "prd-dosa", 2), line("ln-8", "prd-gulab", 1)],
    internalNotes: "Pickup at bar — guest waiting.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 5,
    payments: [],
  },
  {
    id: "ord-ss-8280",
    code: "SS-8280",
    status: "draft",
    fulfillmentType: "delivery",
    venueLabel: "Private dining",
    postcode: "CB5 8RX",
    placedAtLabel: "Today, 13:12",
    serverName: "Sam R.",
    customerName: "Walk-in",
    customerPhone: "—",
    lines: [line("ln-9", "prd-burrata", 1)],
    internalNotes: "Hold fire until guest returns from patio.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    payments: [],
  },
  {
    id: "ord-ss-8275",
    code: "SS-8275",
    status: "active",
    fulfillmentType: "collection",
    venueLabel: "Cambridge lab kitchen",
    postcode: "CB2 1TP",
    placedAtLabel: "Today, 12:58",
    serverName: "Priya K.",
    customerName: "Amelia Grant",
    customerPhone: "+44 1223 902881",
    customerEmail: "amelia.grant@example.com",
    serviceLocation: "Tasting counter",
    lines: [line("ln-10", "prd-burrata", 1), line("ln-11", "prd-masala-chai", 1)],
    internalNotes: "Cambridge guest — same postcode as SS-8288 for filter demos.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    payments: [],
  },
  {
    id: "ord-ss-8142",
    code: "SS-8142",
    status: "cancelled",
    fulfillmentType: "collection",
    venueLabel: "Flagship dining",
    postcode: "W1D 4FA",
    placedAtLabel: "Tue, 8 Apr · 18:40",
    serverName: "Marc A.",
    customerName: "Riley Brooks",
    customerPhone: "+44 20 7123 2210",
    serviceLocation: "Table 8",
    lines: [line("ln-c1", "prd-burrata", 1)],
    internalNotes: "No-show — released table.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    checkoutPaymentSummary: "card",
    payments: [],
    cancellation: {
      reason: "Guest no-show after 20 minutes wait.",
      returnPayment: false,
      cancelledAtLabel: "Tue, 8 Apr · 19:05",
    },
  },
  {
    id: "ord-ss-8138",
    code: "SS-8138",
    status: "cancelled",
    fulfillmentType: "delivery",
    venueLabel: "Cambridge lab kitchen",
    postcode: "CB2 3QZ",
    placedAtLabel: "Mon, 7 Apr · 12:48",
    serverName: "Sam R.",
    customerName: "Studio Catering Ltd",
    customerPhone: "+44 1223 550001",
    lines: [line("ln-c2", "prd-tandoori", 6)],
    internalNotes: "Kitchen decline — deposit handling with finance.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    checkoutPaymentSummary: "multiple",
    payments: [{ id: "pay-c1", method: "card", amount: "40.00" }],
    cancellation: {
      reason: "Could not fulfil volume — deposit to be returned per finance.",
      returnPayment: true,
      cancelledAtLabel: "Mon, 7 Apr · 13:12",
    },
  },
  {
    id: "ord-ss-8195",
    code: "SS-8195",
    status: "completed",
    fulfillmentType: "collection",
    venueLabel: "Flagship dining",
    postcode: "SW1A 2AB",
    placedAtLabel: "Fri, 11 Apr · 12:10",
    completedAtLabel: "Fri, 11 Apr · 12:58",
    serverName: "Marc A.",
    customerName: "Oliver Chen",
    customerPhone: "+44 20 7123 8891",
    customerEmail: "oliver.chen@example.com",
    serviceLocation: "Table 4",
    lines: [line("ln-h1", "prd-burrata", 1), line("ln-h2", "prd-ribeye", 1)],
    internalNotes: "Split dessert comp — manager approved.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    checkoutPaymentSummary: "card",
    payments: [{ id: "pay-h1", method: "card", amount: "98.50" }],
  },
  {
    id: "ord-ss-8190",
    code: "SS-8190",
    status: "completed",
    fulfillmentType: "delivery",
    venueLabel: "Patio & bar",
    postcode: "E1 6AN",
    placedAtLabel: "Fri, 11 Apr · 11:02",
    completedAtLabel: "Fri, 11 Apr · 11:34",
    serverName: "Priya K.",
    customerName: "Samira Khan",
    customerPhone: "+44 20 7946 2210",
    serviceLocation: "Bar pickup",
    lines: [line("ln-h3", "prd-dosa", 1), line("ln-h4", "prd-masala-chai", 2)],
    internalNotes: "",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 10,
    checkoutPaymentSummary: "cash",
    payments: [{ id: "pay-h2", method: "cash", amount: "28.00" }],
  },
  {
    id: "ord-ss-8182",
    code: "SS-8182",
    status: "completed",
    fulfillmentType: "delivery",
    venueLabel: "Cambridge lab kitchen",
    postcode: "CB2 1TP",
    placedAtLabel: "Thu, 10 Apr · 19:15",
    completedAtLabel: "Thu, 10 Apr · 20:02",
    serverName: "Sam R.",
    customerName: "The Cambridge Society",
    customerPhone: "+44 1223 902100",
    customerEmail: "events@cam-soc.example.org",
    serviceLocation: "Private room B",
    lines: [
      line("ln-h5", "prd-tandoori", 4),
      line("ln-h6", "prd-gulab", 4),
      line("ln-h7", "prd-masala-chai", 4),
    ],
    internalNotes: "Corporate — invoice on file.",
    taxIncluded: false,
    discountMode: "flat",
    discountValue: 0,
    checkoutPaymentSummary: "subscription",
    payments: [],
  },
  {
    id: "ord-ss-8171",
    code: "SS-8171",
    status: "completed",
    fulfillmentType: "delivery",
    venueLabel: "Flagship dining",
    postcode: "EC1A 1BB",
    placedAtLabel: "Thu, 10 Apr · 13:48",
    completedAtLabel: "Thu, 10 Apr · 14:55",
    serverName: "Marc A.",
    customerName: "Noah Williams",
    customerPhone: "+44 20 7123 3344",
    serviceLocation: "Table 22",
    lines: [line("ln-h8", "prd-truffle-pasta", 1), line("ln-h9", "prd-saffron-old", 2)],
    internalNotes: "Loyalty £15 applied at close.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 5,
    checkoutPaymentSummary: "multiple",
    payments: [
      { id: "pay-h3", method: "card", amount: "45.00" },
      { id: "pay-h4", method: "cash", amount: "12.50" },
    ],
  },
  {
    id: "ord-ss-8165",
    code: "SS-8165",
    status: "completed",
    fulfillmentType: "collection",
    venueLabel: "Patio & bar",
    postcode: "CB5 8RX",
    placedAtLabel: "Wed, 9 Apr · 18:20",
    completedAtLabel: "Wed, 9 Apr · 18:52",
    serverName: "Priya K.",
    customerName: "Alex Morgan",
    customerPhone: "+44 1223 461999",
    checkoutPaymentSummary: "wallet",
    lines: [line("ln-h10", "prd-burrata", 1), line("ln-h11", "prd-dosa", 1)],
    internalNotes: "",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    payments: [{ id: "pay-h5", method: "wallet", amount: "32.40" }],
  },
  {
    id: "ord-ss-8158",
    code: "SS-8158",
    status: "completed",
    fulfillmentType: "collection",
    venueLabel: "Flagship dining",
    postcode: "SW1A 1AA",
    placedAtLabel: "Wed, 9 Apr · 12:05",
    completedAtLabel: "Wed, 9 Apr · 12:40",
    serverName: "Sam R.",
    customerName: "Guest — walk-out",
    customerPhone: "—",
    serviceLocation: "Counter",
    lines: [line("ln-h12", "prd-masala-chai", 2)],
    internalNotes: "House account.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    checkoutPaymentSummary: "credit",
    payments: [],
  },
  {
    id: "ord-ss-8295",
    code: "SS-8295",
    status: "active",
    fulfillmentType: "delivery",
    venueLabel: "Namaste Cam — Dispatch",
    postcode: "NW1 8NH",
    placedAtLabel: "Today, 15:01",
    serverName: "Marc A.",
    customerName: "Chris Patel",
    customerPhone: "+44 20 7123 8890",
    customerEmail: "chris.patel@example.com",
    serviceLocation: "Ring on arrival — Gate C",
    lines: [line("ln-d1", "prd-ribeye", 1), line("ln-d2", "prd-gulab", 1)],
    internalNotes: "Leave with concierge if no answer.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    payments: [{ id: "pay-d1", method: "card", amount: "" }],
  },
  {
    id: "ord-ss-8296",
    code: "SS-8296",
    status: "active",
    fulfillmentType: "delivery",
    venueLabel: "Namaste Cam — Dispatch",
    postcode: "SE10 9NF",
    placedAtLabel: "Today, 15:18",
    serverName: "Priya K.",
    customerName: "Morgan Ellis",
    customerPhone: "+44 20 7946 7781",
    customerEmail: "morgan.ellis@example.com",
    serviceLocation: "Ground floor lobby",
    lines: [line("ln-d3", "prd-dosa", 2), line("ln-d4", "prd-burrata", 1)],
    internalNotes: "Contactless — knock twice.",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    payments: [],
  },
  {
    id: "ord-ss-8297",
    code: "SS-8297",
    status: "preparing",
    fulfillmentType: "delivery",
    venueLabel: "Namaste Cam — Dispatch",
    postcode: "W2 3XA",
    placedAtLabel: "Today, 15:26",
    serverName: "Sam R.",
    customerName: "Taylor Brooks",
    customerPhone: "+44 20 7123 6602",
    lines: [line("ln-d5", "prd-tandoori", 2), line("ln-d6", "prd-masala-chai", 1)],
    internalNotes: "Bike courier — thermal bag.",
    taxIncluded: false,
    discountMode: "flat",
    discountValue: 0,
    payments: [{ id: "pay-d2", method: "wallet", amount: "" }],
  },
];

const ordersById = new Map(RESTAURANT_ORDERS_SEED.map((o) => [o.id, o]));

const CHECKOUT_PAYMENT_LABELS: Record<CheckoutPaymentSummary, string> = {
  cash: "Cash",
  card: "Card",
  wallet: "Apple Pay / Google Pay",
  subscription: "Subscription",
  multiple: "Multiple",
  credit: "Store credit",
  upi: "UPI",
};

export function formatCheckoutPaymentSummary(order: RestaurantOrderRecord): string {
  if (order.checkoutPaymentSummary) return CHECKOUT_PAYMENT_LABELS[order.checkoutPaymentSummary];
  const methods = [...new Set(order.payments.map((p) => p.method))];
  if (methods.length === 0) return "—";
  if (methods.length > 1) return CHECKOUT_PAYMENT_LABELS.multiple;
  const m = methods[0]!;
  if (m === "card") return CHECKOUT_PAYMENT_LABELS.card;
  if (m === "cash") return CHECKOUT_PAYMENT_LABELS.cash;
  if (m === "wallet") return CHECKOUT_PAYMENT_LABELS.wallet;
  return CHECKOUT_PAYMENT_LABELS.upi;
}

export function listRestaurantOrders(): RestaurantOrderRecord[] {
  return [...RESTAURANT_ORDERS_SEED];
}

export function getRestaurantOrder(id: string): RestaurantOrderRecord | undefined {
  return ordersById.get(id);
}

export function listActiveRestaurantOrders(): RestaurantOrderRecord[] {
  return RESTAURANT_ORDERS_SEED.filter((o) => o.status !== "completed" && o.status !== "cancelled");
}

/** Completed and cancelled tickets for order history. */
export function listOrderHistory(): RestaurantOrderRecord[] {
  return RESTAURANT_ORDERS_SEED.filter((o) => o.status === "completed" || o.status === "cancelled");
}

/** @deprecated Use {@link listOrderHistory} */
export function listCompletedRestaurantOrders(): RestaurantOrderRecord[] {
  return listOrderHistory();
}

export function emptyDraftOrder(): RestaurantOrderRecord {
  return {
    id: "new",
    code: "NEW",
    status: "draft",
    fulfillmentType: "collection",
    venueLabel: "Namaste Cam — Floor",
    postcode: "EC1A 1BB",
    placedAtLabel: "Just now",
    serverName: "You",
    customerName: "",
    customerPhone: "",
    lines: [],
    internalNotes: "",
    taxIncluded: true,
    discountMode: "percent",
    discountValue: 0,
    payments: [{ id: "pay-new-1", method: "card", amount: "" }],
  };
}

