export type DiscountMode = "percent" | "flat";

export type BillLineInput = {
  quantity: number;
  unitPriceExTax: number;
};

export type OrderFulfillmentForBill = "delivery" | "collection";

/** Flat courier / packaging fee (GBP) added for delivery tickets. */
export const DELIVERY_FLAT_FEE_GBP = 5;

/** Extra discount on food subtotal for pickup-at-store orders. */
export const COLLECTION_PROMO_PERCENT = 5;

export type BillComputationInput = {
  lines: BillLineInput[];
  taxIncluded: boolean;
  discountMode: DiscountMode;
  discountValue: number;
  /** When omitted, no fulfillment-based fee or promo is applied. */
  fulfillmentType?: OrderFulfillmentForBill;
};

export type BillComputation = {
  subtotal: number;
  /** Manual discount from discountMode / discountValue. */
  discountAmount: number;
  /** Automatic 5% off subtotal when fulfillment is collection. */
  fulfillmentCollectionDiscount: number;
  /** Flat £5 when fulfillment is delivery. */
  deliveryFee: number;
  taxableAfterDiscount: number;
  gst: number;
  serviceCharge: number;
  totalPayable: number;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function computeRestaurantBill(input: BillComputationInput): BillComputation {
  const qtySum = (line: BillLineInput) => line.quantity * line.unitPriceExTax;

  let subtotal = 0;
  for (const line of input.lines) {
    subtotal += input.taxIncluded ? qtySum(line) * 1.15 : qtySum(line);
  }
  subtotal = round2(subtotal);

  let discountAmount = 0;
  if (input.discountMode === "percent") {
    discountAmount = round2(subtotal * (Math.max(0, input.discountValue) / 100));
  } else {
    discountAmount = round2(Math.min(Math.max(0, input.discountValue), subtotal));
  }

  const fulfillment = input.fulfillmentType;
  const fulfillmentCollectionDiscount =
    fulfillment === "collection"
      ? round2(subtotal * (COLLECTION_PROMO_PERCENT / 100))
      : 0;
  const deliveryFee = fulfillment === "delivery" ? DELIVERY_FLAT_FEE_GBP : 0;

  const taxableAfterDiscount = round2(
    Math.max(0, subtotal - discountAmount - fulfillmentCollectionDiscount),
  );

  if (input.taxIncluded) {
    const gst = round2(taxableAfterDiscount * (5 / 115));
    const serviceCharge = round2(taxableAfterDiscount * (10 / 115));
    const totalPayable = round2(taxableAfterDiscount + deliveryFee);
    return {
      subtotal,
      discountAmount,
      fulfillmentCollectionDiscount,
      deliveryFee,
      taxableAfterDiscount,
      gst,
      serviceCharge,
      totalPayable,
    };
  }

  const gst = round2(taxableAfterDiscount * 0.05);
  const serviceCharge = round2(taxableAfterDiscount * 0.1);
  const totalPayable = round2(taxableAfterDiscount + gst + serviceCharge + deliveryFee);

  return {
    subtotal,
    discountAmount,
    fulfillmentCollectionDiscount,
    deliveryFee,
    taxableAfterDiscount,
    gst,
    serviceCharge,
    totalPayable,
  };
}

/** GBP display for UK restaurant / order flows. */
export function formatGbp(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
