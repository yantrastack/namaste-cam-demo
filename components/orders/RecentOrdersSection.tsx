import Link from "next/link";
import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/dashboard-sample-data";

export type RecentOrderRow = {
  orderId: string;
  customerName: string;
  restaurant: string;
  status: OrderStatus;
  amountFormatted: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? parts[parts.length - 1]![0] : parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
}

function statusBadge(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return <Badge tone="success">Delivered</Badge>;
    case "in_transit":
      return <Badge tone="warning">In transit</Badge>;
    case "preparing":
      return <Badge tone="info">Preparing</Badge>;
    case "cancelled":
      return <Badge tone="error">Cancelled</Badge>;
  }
}

const avatarStyles = [
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-primary-container text-on-primary-container",
  "bg-surface-container-highest text-on-surface-variant",
];

export type RecentOrdersSectionProps = {
  orders: RecentOrderRow[];
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  /** Extra toolbar content beside the title (optional). */
  toolbarEnd?: ReactNode;
};

export function RecentOrdersSection({
  orders,
  title = "Recent Orders",
  viewAllHref = "/orders",
  viewAllLabel = "View All Orders",
  className,
  toolbarEnd,
}: RecentOrdersSectionProps) {
  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      <div className="flex flex-col gap-3 border-b border-surface-container-low px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <h2 className="text-lg font-bold text-on-surface">{title}</h2>
        <div className="flex flex-wrap items-center gap-3">
          {toolbarEnd}
          <Link
            href={viewAllHref}
            className="text-sm font-bold text-primary hover:underline"
          >
            {viewAllLabel}
          </Link>
        </div>
      </div>
      <Table>
        <TableHead className="bg-surface-container-low/50">
          <tr>
            <TableHeaderCell className="px-6 sm:px-8">Order ID</TableHeaderCell>
            <TableHeaderCell className="px-6 sm:px-8">Customer</TableHeaderCell>
            <TableHeaderCell className="px-6 sm:px-8">Restaurant</TableHeaderCell>
            <TableHeaderCell className="px-6 sm:px-8">Status</TableHeaderCell>
            <TableHeaderCell className="px-6 sm:px-8">Amount</TableHeaderCell>
            <TableHeaderCell className="px-6 py-5 text-right sm:px-8">
              Action
            </TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody className="divide-y divide-surface-container-low">
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="px-6 py-10 text-center text-sm text-on-surface-variant sm:px-8"
              >
                No orders to show.
              </TableCell>
            </TableRow>
          ) : null}
          {orders.map((row, i) => (
            <TableRow key={`${row.orderId}-${i}`} className="hover:bg-surface-container-low/30">
              <TableCell className="px-6 py-5 text-sm font-bold text-on-surface sm:px-8">
                {row.orderId}
              </TableCell>
              <TableCell className="px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      avatarStyles[i % avatarStyles.length],
                    )}
                  >
                    {initials(row.customerName)}
                  </div>
                  <span className="text-sm font-medium text-on-surface">
                    {row.customerName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-5 text-sm text-on-surface-variant sm:px-8">
                {row.restaurant}
              </TableCell>
              <TableCell className="px-6 py-5 sm:px-8">{statusBadge(row.status)}</TableCell>
              <TableCell className="px-6 py-5 text-sm font-bold text-on-surface sm:px-8">
                {row.amountFormatted}
              </TableCell>
              <TableCell className="px-6 py-5 text-right sm:px-8">
                <button
                  type="button"
                  className="inline-flex rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                  aria-label={`More actions for ${row.orderId}`}
                >
                  <MaterialIcon name="more_vert" className="text-xl" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
