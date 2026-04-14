"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { CampaignNotificationItem } from "@/lib/notifications-dashboard-sample-data";

export type NotificationCampaignFeedCardProps = {
  notification: CampaignNotificationItem;
  onAction?: (notificationId: string, label: string) => void;
};

export function NotificationCampaignFeedCard({
  notification,
  onAction,
}: NotificationCampaignFeedCardProps) {
  const { id, type, title, description, time, unread, icon, badge, image, actions } =
    notification;

  return (
    <Card
      className={cn(
        "p-4 sm:p-5 transition-all hover:shadow-md",
        unread ? "border-l-4 border-primary bg-surface-container-lowest" : "bg-surface-container-low",
      )}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center",
            type === "promotion" && badge ? "rounded-xl" : "rounded-full",
            type === "promotion"
              ? "bg-tertiary-fixed"
              : icon === "restaurant"
                ? "bg-primary-fixed"
                : "bg-secondary-container",
          )}
        >
          <MaterialIcon
            name={icon}
            className={cn(
              "text-xl",
              type === "promotion"
                ? "text-on-tertiary-fixed"
                : icon === "restaurant"
                  ? "text-primary"
                  : "text-secondary",
            )}
            filled={type === "promotion"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-headline text-base font-bold leading-tight">{title}</h3>
            <span
              className={cn(
                "shrink-0 text-[10px] uppercase tracking-wider",
                unread ? "font-semibold text-primary" : "font-medium text-on-secondary-container",
              )}
            >
              {time}
            </span>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-on-surface-variant">{description}</p>

          {image ? (
            <div className="relative mt-4 h-32 overflow-hidden rounded-lg">
              <img className="h-full w-full object-cover" alt="" src={image} />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                {badge ? (
                  <span className="text-xs font-bold text-white">{badge}</span>
                ) : null}
              </div>
            </div>
          ) : null}

          {actions?.length ? (
            <div className="mt-3 flex flex-wrap gap-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => onAction?.(id, action.label)}
                  className={cn(
                    "text-xs font-semibold transition-opacity hover:opacity-80",
                    action.primary ? "text-primary" : "text-on-surface-variant",
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
