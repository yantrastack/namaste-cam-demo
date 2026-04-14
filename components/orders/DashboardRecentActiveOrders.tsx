"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { RestaurantOrderRecord } from "@/lib/orders-restaurant-data";
import { ORDER_ARCHIVES_EVENT, filterActiveOrdersWithArchives, readOrderArchivesMap } from "@/lib/order-session-archives";
import { ActiveOrdersDataTable } from "./ActiveOrdersDataTable";

const DASHBOARD_RECENT_MAX = 10;

export type DashboardRecentActiveOrdersProps = {
  orders: RestaurantOrderRecord[];
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
};

export function DashboardRecentActiveOrders({
  orders,
  title = "Recent Orders",
  viewAllHref = "/orders",
  viewAllLabel = "View All Orders",
  className,
}: DashboardRecentActiveOrdersProps) {
  const [archiveMap, setArchiveMap] = useState<Record<string, RestaurantOrderRecord>>(() =>
    typeof window !== "undefined" ? readOrderArchivesMap() : {},
  );
  useEffect(() => {
    const sync = () => setArchiveMap(readOrderArchivesMap());
    sync();
    window.addEventListener(ORDER_ARCHIVES_EVENT, sync);
    return () => window.removeEventListener(ORDER_ARCHIVES_EVENT, sync);
  }, []);

  const previewOrders = useMemo(() => {
    const visible = filterActiveOrdersWithArchives(orders, archiveMap);
    return visible.slice(0, DASHBOARD_RECENT_MAX);
  }, [orders, archiveMap]);

  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      <div className="flex flex-col gap-3 border-b border-surface-container-low px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <h2 className="text-lg font-bold text-on-surface">{title}</h2>
        <Link href={viewAllHref} className="text-sm font-bold text-primary hover:underline">
          {viewAllLabel}
        </Link>
      </div>
      <ActiveOrdersDataTable
        orders={previewOrders}
        emptyMessage="No active orders to show."
      />
    </Card>
  );
}
