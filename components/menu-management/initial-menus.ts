import { createEmptyDayMap, type MenuRow } from "./model";

const few = (ids: { foodId: number; quantity: number }[]) => ids;

export const INITIAL_MENUS: MenuRow[] = [
  {
    id: "demo-mon-lunch",
    name: "Monday Lunch",
    tableType: "lunch",
    availability: "Mon",
    imageUrl: "https://picsum.photos/seed/mon-lunch/96/96",
    active: true,
    normalDetails: {
      category: "lunch",
      days: ["Mon"],
      items: few([
        { foodId: 3, quantity: 20 },
        { foodId: 4, quantity: 20 },
      ]),
    },
  },
  {
    id: "demo-mon-dinner",
    name: "Monday Dinner",
    tableType: "dinner",
    availability: "Mon",
    imageUrl: "https://picsum.photos/seed/mon-dinner/96/96",
    active: true,
    normalDetails: {
      category: "dinner",
      days: ["Mon"],
      items: few([
        { foodId: 1, quantity: 12 },
        { foodId: 2, quantity: 15 },
      ]),
    },
  },
  {
    id: "demo-tue-lunch",
    name: "Tuesday Lunch",
    tableType: "lunch",
    availability: "Tue",
    imageUrl: "https://picsum.photos/seed/tue-lunch/96/96",
    active: true,
    normalDetails: {
      category: "lunch",
      days: ["Tue"],
      items: few([
        { foodId: 2, quantity: 14 },
        { foodId: 3, quantity: 14 },
      ]),
    },
  },
  {
    id: "demo-tue-dinner",
    name: "Tuesday Dinner",
    tableType: "dinner",
    availability: "Tue",
    imageUrl: "https://picsum.photos/seed/tue-dinner/96/96",
    active: false,
    normalDetails: {
      category: "dinner",
      days: ["Tue"],
      items: few([
        { foodId: 1, quantity: 10 },
        { foodId: 4, quantity: 18 },
      ]),
    },
  },
  {
    id: "demo-wed-lunch",
    name: "Wednesday Lunch",
    tableType: "lunch",
    availability: "Wed",
    imageUrl: "https://picsum.photos/seed/wed-lunch/96/96",
    active: true,
    normalDetails: {
      category: "lunch",
      days: ["Wed"],
      items: few([{ foodId: 3, quantity: 16 }]),
    },
  },
  {
    id: "demo-wed-dinner",
    name: "Wednesday Dinner",
    tableType: "dinner",
    availability: "Wed",
    imageUrl: "https://picsum.photos/seed/wed-dinner/96/96",
    active: true,
    normalDetails: {
      category: "dinner",
      days: ["Wed"],
      items: few([
        { foodId: 1, quantity: 8 },
        { foodId: 2, quantity: 8 },
      ]),
    },
  },
  {
    id: "demo-spring-chef-series",
    name: "Spring Chef Series",
    tableType: "special",
    availability: "Apr 1 → Apr 30",
    imageUrl:
      "https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2022-04/Food%20Menu.jpg",
    active: true,
    specialDetails: {
      description: "Limited spring tasting with seasonal produce and lighter mains.",
      imagePreview: null,
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      items: few([
        { foodId: 2, quantity: 8 },
        { foodId: 3, quantity: 8 },
        { foodId: 4, quantity: 8 },
      ]),
    },
  },
  {
    id: "demo-weekend-special",
    name: "Weekend Chef Special",
    tableType: "special",
    availability: "Fri → Sun",
    imageUrl: "https://picsum.photos/seed/weekend-special/96/96",
    active: true,
    specialDetails: {
      description: "Rotating chef picks for Fri–Sun seatings.",
      imagePreview: null,
      startDate: "2026-10-01",
      endDate: "2026-12-31",
      items: few([
        { foodId: 1, quantity: 6 },
        { foodId: 2, quantity: 6 },
      ]),
    },
  },
  {
    id: "demo-diwali-feast",
    name: "Diwali Feast",
    tableType: "special",
    availability: "Nov 1 → Nov 15",
    imageUrl: "https://picsum.photos/seed/diwali-menu/96/96",
    active: false,
    specialDetails: {
      description: "Seven-course festive menu with mithai box.",
      imagePreview: null,
      startDate: "2026-11-01",
      endDate: "2026-11-15",
      items: few([
        { foodId: 2, quantity: 25 },
        { foodId: 3, quantity: 25 },
        { foodId: 4, quantity: 25 },
      ]),
    },
  },
  // {
  //   id: "demo-default-all-days",
  //   name: "Default Menu (All Days)",
  //   tableType: "dinner",
  //   availability: "Mon – Sun",
  //   imageUrl: "https://picsum.photos/seed/default-menu/96/96",
  //   active: true,
  //   normalDetails: {
  //     category: "dinner",
  //     days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //     items: few([
  //       { foodId: 2, quantity: 15 },
  //       { foodId: 3, quantity: 15 },
  //       { foodId: 4, quantity: 15 },
  //     ]),
  //   },
  // },
  {
    id: "demo-office-weekly",
    name: "Office Weekly Subscription",
    tableType: "subscription",
    subscriptionPlanId: "demo-subscription-weekly",
    availability: "7-day plan · renew by 2026-12-31",
    imageUrl: "https://picsum.photos/seed/subscription-box/96/96",
    active: true,
    subscriptionDetails: {
      daysCount: 7,
      expiryDate: "2026-12-31",
      price: "4,999",
      discount: "10%",
      bannerText: "Fuel the work week",
      itemsByDay: {
        ...createEmptyDayMap(7),
        1: [{ foodId: 3, quantity: 10 }],
        2: [{ foodId: 4, quantity: 10 }],
        3: [{ foodId: 2, quantity: 10 }],
      },
    },
  },
];
