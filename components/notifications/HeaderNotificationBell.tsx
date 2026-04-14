"use client";

import {
  ADMIN_HEADER_NOTIFICATION_LIMIT,
  adminActivityFeedSample,
} from "@/lib/notifications-dashboard-sample-data";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { NotificationFeedList } from "@/components/notifications/NotificationFeedList";

export function HeaderNotificationBell() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const preview = adminActivityFeedSample.slice(0, ADMIN_HEADER_NOTIFICATION_LIMIT);
  const unreadCount = adminActivityFeedSample.filter((n) => n.unread).length;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn(
          "relative rounded-full p-2 text-stone-500 transition-colors hover:bg-surface-container-high hover:text-primary",
          open && "bg-surface-container-high text-primary",
        )}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <MaterialIcon name="notifications" />
        {unreadCount > 0 ? (
          <span
            className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-on-primary"
            aria-hidden
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Recent notifications"
          className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl bg-surface shadow-lg shadow-primary-soft ring-1 ring-outline-variant/20"
        >
          <div className="border-b border-outline-variant/10 px-4 py-3">
            <p className="font-headline text-sm font-bold text-on-surface">Notifications</p>
            <p className="text-xs text-on-surface-variant">Sample feed for layout—wire Novu here later.</p>
          </div>
          <div className="max-h-[min(70vh,22rem)] overflow-y-auto">
            <NotificationFeedList items={preview} />
          </div>
          <div className="border-t border-outline-variant/10 p-2">
            <Link
              href="/notifications/admin"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-surface-container-high active:scale-[0.98]"
            >
              View all activity
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
