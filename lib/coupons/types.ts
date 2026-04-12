export type CouponStatus = "active" | "expired" | "draft";

export type CouponType = "percentage" | "fixed_amount" | "product_bundle";

export type Coupon = {
  id: string;
  code: string;
  campaignName: string;
  description?: string;
  type: CouponType;
  percentOff?: number;
  fixedAmount?: number;
  freeItemLabel?: string;
  startsAt?: string;
  expiryDate: string;
  status: CouponStatus;
  redemptions: number;
  revenueFromDiscount: number;
  oncePerUser?: boolean;
  usageLimit?: number;
  minPurchase?: number;
  allMenu?: boolean;
  categories?: string[];
};

export type ScheduledCampaign = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  accent: "amber" | "blue" | "tertiary";
  icon: string;
};

export type CouponPromotionsSeed = {
  coupons: Coupon[];
  campaigns: ScheduledCampaign[];
};
