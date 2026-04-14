"use client";

import {
  ADMIN_ACTIVITY_FEED_DISPLAY_LIMIT,
  adminActivityFeedSample,
  adminSystemNotificationsSample,
  deliveredNotificationsSample,
} from "@/lib/notifications-dashboard-sample-data";
import { NotificationFeedList } from "@/components/notifications/NotificationFeedList";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";

/** Set to `true` to show sample “System events” and “Delivered orders” tables below the activity feed. */
const SHOW_LEGACY_ADMIN_NOTIFICATION_TABLES = false;

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-3 font-headline text-base font-bold text-on-surface">{children}</h2>
  );
}

export function AdminNotificationsClient() {
  const activityFeed = adminActivityFeedSample.slice(0, ADMIN_ACTIVITY_FEED_DISPLAY_LIMIT);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden p-0 sm:p-0">
        <div className="border-b border-outline-variant/15 px-5 py-4">
          <SectionTitle>Recent activity</SectionTitle>
          <p className="text-sm text-on-surface-variant">
            Last {ADMIN_ACTIVITY_FEED_DISPLAY_LIMIT} signals (orders, payments, deliveries)—replace with Novu when
            ready.
          </p>
        </div>
        <div className="max-h-[min(70vh,32rem)] overflow-y-auto">
          <NotificationFeedList items={activityFeed} />
        </div>
      </Card>

      {SHOW_LEGACY_ADMIN_NOTIFICATION_TABLES ? (
        <>
          <Card className="overflow-hidden p-0 sm:p-0">
            <div className="border-b border-outline-variant/15 px-5 py-4">
              <SectionTitle>System events</SectionTitle>
              <p className="text-sm text-on-surface-variant">
                Order creation, refunds, checkout milestones, and other back-office signals.
              </p>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Event</TableHeaderCell>
                  <TableHeaderCell>Order</TableHeaderCell>
                  <TableHeaderCell>Source</TableHeaderCell>
                  <TableHeaderCell>Time</TableHeaderCell>
                  <TableHeaderCell>Detail</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminSystemNotificationsSample.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-semibold text-on-surface">{row.event}</TableCell>
                    <TableCell className="font-mono text-sm text-primary">{row.orderId}</TableCell>
                    <TableCell className="text-sm text-on-surface-variant">{row.actor}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-on-surface-variant">
                      {row.occurredAt}
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-on-surface">{row.detail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="overflow-hidden p-0 sm:p-0">
            <div className="border-b border-outline-variant/15 px-5 py-4">
              <SectionTitle>Delivered orders</SectionTitle>
              <p className="text-sm text-on-surface-variant">
                Driver completion timestamps and handoff confirmations for fulfilled orders.
              </p>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Order</TableHeaderCell>
                  <TableHeaderCell>Customer</TableHeaderCell>
                  <TableHeaderCell>Driver</TableHeaderCell>
                  <TableHeaderCell>Delivered at</TableHeaderCell>
                  <TableHeaderCell>Area</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveredNotificationsSample.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-sm font-semibold text-primary">{row.orderId}</TableCell>
                    <TableCell className="text-sm text-on-surface">{row.customer}</TableCell>
                    <TableCell className="text-sm text-on-surface-variant">{row.driver}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-on-surface-variant">
                      {row.deliveredAt}
                    </TableCell>
                    <TableCell className="text-sm text-on-surface">{row.area}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      ) : null}
    </div>
  );
}
