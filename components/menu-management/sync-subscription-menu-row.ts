import type { MenuRow, SelectedLine } from "./model";
import { createEmptyDayMap } from "./model";
import type { SubscriptionMenuDraft } from "./subscription-menu-model";

/** Keep Master Menu `MenuRow` in sync after edits in the subscription combo builder. */
export function patchMenuRowWithSubscriptionDraft(row: MenuRow, draft: SubscriptionMenuDraft): MenuRow {
  if (row.tableType !== "subscription") return row;

  const foodIds = new Set<number>();
  for (const sec of draft.sections) {
    for (const item of sec.items) foodIds.add(item.id);
  }
  const day1Lines: SelectedLine[] =
    foodIds.size > 0
      ? [...foodIds].map((foodId) => ({ foodId, quantity: 1 }))
      : [{ foodId: 3, quantity: 1 }];

  const itemsByDay: Record<number, SelectedLine[]> = {
    ...createEmptyDayMap(draft.totalDays),
    1: day1Lines,
  };

  const imageUrl =
    draft.bannerImage && draft.bannerImage.length > 0 ? draft.bannerImage : row.imageUrl;

  return {
    ...row,
    name: draft.name.trim() || row.name,
    availability: `${draft.totalDays}-day plan · renew by ${draft.expiry || "—"}`,
    imageUrl,
    subscriptionDetails: {
      daysCount: draft.totalDays,
      expiryDate: draft.expiry,
      price: draft.price,
      discount: draft.discount,
      bannerText: draft.bannerText,
      itemsByDay,
    },
  };
}
