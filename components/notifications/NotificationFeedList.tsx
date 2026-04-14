import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";
import type { AdminActivityNotification } from "@/lib/notifications-dashboard-sample-data";

const kindIcon: Record<AdminActivityNotification["kind"], string> = {
  order: "receipt_long",
  payment: "payments",
  delivery: "local_shipping",
  refund: "undo",
  system: "info",
};

export function NotificationFeedList({
  items,
  className,
}: {
  items: AdminActivityNotification[];
  className?: string;
}) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-on-surface-variant">
        No notifications yet.
      </p>
    );
  }

  return (
    <ul className={cn("divide-y divide-outline-variant/10", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <div
            className={cn(
              "flex gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-container-low",
              item.unread && "bg-primary/[0.04]",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-primary ring-1 ring-outline-variant/15",
              )}
            >
              <MaterialIcon name={kindIcon[item.kind]} className="text-xl" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-headline text-sm font-bold text-on-surface">{item.title}</p>
                {item.unread ? (
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                ) : null}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-on-surface-variant">
                {item.description}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-secondary">
                {item.orderId ? (
                  <span className="font-mono font-semibold text-primary">{item.orderId}</span>
                ) : null}
                <span className="text-on-surface-variant">{item.timeLabel}</span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
