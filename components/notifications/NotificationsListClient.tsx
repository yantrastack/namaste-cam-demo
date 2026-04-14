"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import {
  campaignNotificationsSample,
  type CampaignNotificationType,
} from "@/lib/notifications-dashboard-sample-data";
import { NotificationCampaignFeedCard } from "@/components/notifications/NotificationCampaignFeedCard";

export function NotificationsListClient() {
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState<"all" | CampaignNotificationType>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return campaignNotificationsSample;
    return campaignNotificationsSample.filter((n) => n.type === activeFilter);
  }, [activeFilter]);

  return (
    <div className="space-y-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(
          [
            ["all", "All updates"],
            ["order", "Orders & ops"],
            ["promotion", "Promotions"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveFilter(key)}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all",
              activeFilter === key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((n) => (
          <NotificationCampaignFeedCard
            key={n.id}
            notification={n}
            onAction={(_, label) => showToast(`${label} (demo)`, "info")}
          />
        ))}
      </div>
    </div>
  );
}
