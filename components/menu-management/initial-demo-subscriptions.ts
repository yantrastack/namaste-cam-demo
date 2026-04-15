import type { SubscriptionMenuDraft } from "./subscription-menu-model";
import { subscriptionDemoFoodItems } from "./subscription-menu-model";

export type SubscriptionMenuRecord = {
  id: string;
  active: boolean;
  createdAt: number;
  menu: SubscriptionMenuDraft;
};

/** One active demo plan so “Create menu” shows a subscription card out of the box. */
export const INITIAL_DEMO_SUBSCRIPTIONS: SubscriptionMenuRecord[] = [
  {
    id: "demo-subscription-weekly",
    active: true,
    createdAt: 0,
    menu: {
      name: "Weekly office meals",
      totalDays: 7,
      expiry: "2026-12-31",
      price: "2499",
      discount: "100",
      bannerText: "Includes lunch mains + add-ons",
      bannerImage: null,
      sections: [
        {
          id: "demo-sec-1",
          title: "Choose curry",
          selectionType: "single",
          maxSelection: 1,
          items: [subscriptionDemoFoodItems[2], subscriptionDemoFoodItems[1]],
        },
        {
          id: "demo-sec-2",
          title: "Select rice",
          selectionType: "single",
          maxSelection: 1,
          items: [subscriptionDemoFoodItems[3]],
        },
      ],
    },
  },
];
