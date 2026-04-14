"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
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
import {
  computeDeliveryAreaStats,
  computeDeliveryCollectionSummary,
  filterDeliveryOrdersByAreaSearch,
  type DeliveryOrder,
} from "@/lib/delivery-ops-data";

function Num({ n, tone }: { n: number; tone?: "default" | "warn" | "muted" }) {
  return (
    <span
      className={cn(
        "tabular-nums font-headline text-base font-extrabold",
        tone === "warn" && n > 0 && "text-primary",
        tone === "muted" && "text-secondary",
        (!tone || tone === "default") && "text-on-surface",
      )}
    >
      {n}
    </span>
  );
}

type DeliveryOverviewClientProps = {
  orders: DeliveryOrder[];
};

export function DeliveryOverviewClient({ orders }: DeliveryOverviewClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(
    () => filterDeliveryOrdersByAreaSearch(orders, query),
    [orders, query],
  );

  const filtered = useMemo(
    () => computeDeliveryAreaStats(filteredOrders),
    [filteredOrders],
  );

  const collectionSummary = useMemo(
    () => computeDeliveryCollectionSummary(filteredOrders),
    [filteredOrders],
  );

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => ({
        total: acc.total + r.total,
        unassigned: acc.unassigned + r.unassigned,
        assigned: acc.assigned + r.assigned,
        enRoute: acc.enRoute + r.enRoute,
        delivered: acc.delivered + r.delivered,
      }),
      { total: 0, unassigned: 0, assigned: 0, enRoute: 0, delivered: 0 },
    );
  }, [filtered]);

  return (
    <PageContainer
      title="Delivery by area"
      description="Postcode patches with live dispatch counts so control can see backlog, assigned load, drivers en route, and completed drops at a glance."
      actions={
        <div className="relative w-full min-w-[min(100%,18rem)] sm:w-72">
          <MaterialIcon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-secondary"
          />
          <input
            type="search"
            placeholder="Filter by area or outward code…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              "w-full rounded-xl border-none py-3 pl-11 pr-4 font-body text-sm font-semibold text-on-surface outline-none transition-all",
              "bg-surface ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary",
            )}
            aria-label="Filter areas"
          />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Total tickets</p>
          <p className="mt-2 font-headline text-3xl font-extrabold tabular-nums text-on-surface">
            {totals.total}
          </p>
        </Card>
        <Card className="p-4 ring-1 ring-amber-100/80">
          <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Need driver</p>
          <p className="mt-2 font-headline text-3xl font-extrabold tabular-nums text-primary">{totals.unassigned}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">In progress</p>
          <p className="mt-2 font-headline text-3xl font-extrabold tabular-nums text-on-surface">
            {totals.assigned + totals.enRoute}
          </p>
          <p className="mt-1 text-xs font-medium text-secondary">
            {totals.assigned} assigned · {totals.enRoute} out
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Delivered</p>
          <p className="mt-2 font-headline text-3xl font-extrabold tabular-nums text-on-surface">
            {totals.delivered}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHead className="bg-surface-container-low/50">
            <TableRow className="hover:bg-transparent">
              <TableHeaderCell className="px-5 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                Area / outward code
              </TableHeaderCell>
              <TableHeaderCell className="px-5 py-4 text-right text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                Orders
              </TableHeaderCell>
              <TableHeaderCell className="hidden px-5 py-4 text-right text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant sm:table-cell">
                Unassigned
              </TableHeaderCell>
              <TableHeaderCell className="hidden px-5 py-4 text-right text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant md:table-cell">
                Assigned
              </TableHeaderCell>
              <TableHeaderCell className="hidden px-5 py-4 text-right text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant lg:table-cell">
                Out for delivery
              </TableHeaderCell>
              <TableHeaderCell className="px-5 py-4 text-right text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                Delivered
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-5 py-10 text-center text-sm font-medium text-secondary">
                  No areas match this filter.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow
                  key={r.outcode}
                  tabIndex={0}
                  role="link"
                  aria-label={`Assign orders for ${r.outcode} ${r.areaLabel}`}
                  className="cursor-pointer hover:bg-surface-container-low/30"
                  onClick={() =>
                    router.push(
                      `/delivery/assign?pin=${encodeURIComponent(r.outcode.toUpperCase())}`,
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(
                        `/delivery/assign?pin=${encodeURIComponent(r.outcode.toUpperCase())}`,
                      );
                    }
                  }}
                >
                  <TableCell className="px-5 py-4">
                    <span className="font-headline text-lg font-extrabold text-on-surface">{r.outcode}</span>
                    <div className="text-sm font-medium text-secondary">{r.areaLabel}</div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right">
                    <Num n={r.total} />
                  </TableCell>
                  <TableCell className="hidden px-5 py-4 text-right sm:table-cell">
                    <Num n={r.unassigned} tone="warn" />
                  </TableCell>
                  <TableCell className="hidden px-5 py-4 text-right md:table-cell">
                    <Num n={r.assigned} />
                  </TableCell>
                  <TableCell className="hidden px-5 py-4 text-right lg:table-cell">
                    <Num n={r.enRoute} tone="muted" />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right">
                    <Num n={r.delivered} />
                  </TableCell>
                </TableRow>
              ))
            )}
            {filtered.length > 0 ? (
              <TableRow className="bg-surface-container-low/40 font-bold hover:bg-surface-container-low/50">
                <TableCell className="px-5 py-4 text-sm uppercase tracking-widest text-on-surface-variant">
                  All filtered areas
                </TableCell>
                <TableCell className="px-5 py-4 text-right">
                  <Num n={totals.total} />
                </TableCell>
                <TableCell className="hidden px-5 py-4 text-right sm:table-cell">
                  <Num n={totals.unassigned} tone="warn" />
                </TableCell>
                <TableCell className="hidden px-5 py-4 text-right md:table-cell">
                  <Num n={totals.assigned} />
                </TableCell>
                <TableCell className="hidden px-5 py-4 text-right lg:table-cell">
                  <Num n={totals.enRoute} />
                </TableCell>
                <TableCell className="px-5 py-4 text-right">
                  <Num n={totals.delivered} />
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-headline text-lg font-extrabold text-on-surface">Collections</h2>
            <p className="mt-1 text-sm font-medium text-secondary">
              Customer pickup tickets — handoff at counter or kerbside, separate from courier drops.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-container-low/50 p-4 ring-1 ring-outline-variant/10">
            <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Total</p>
            <p className="mt-2 font-headline text-3xl font-extrabold tabular-nums text-on-surface">
              {collectionSummary.total}
            </p>
          </div>
          <div className="rounded-xl bg-surface-container-low/50 p-4 ring-1 ring-amber-100/80">
            <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Yet to collect</p>
            <p className="mt-2 font-headline text-3xl font-extrabold tabular-nums text-primary">
              {collectionSummary.yetToCollect}
            </p>
          </div>
          <div className="rounded-xl bg-surface-container-low/50 p-4 ring-1 ring-outline-variant/10">
            <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">Collected</p>
            <p className="mt-2 font-headline text-3xl font-extrabold tabular-nums text-on-surface">
              {collectionSummary.collected}
            </p>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
