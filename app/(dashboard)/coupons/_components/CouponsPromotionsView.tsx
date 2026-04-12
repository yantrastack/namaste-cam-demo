"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { Modal } from "@/components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import { formatCouponValue, formatDisplayDate } from "@/lib/coupons/format";
import { loadCouponStore, newCouponId, saveCouponStore } from "@/lib/coupons/store";
import type { Coupon, CouponStatus, CouponType, ScheduledCampaign } from "@/lib/coupons/types";

const PAGE_SIZE = 4;

const FILTER_TABS: { id: "all" | CouponStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "expired", label: "Expired" },
  { id: "draft", label: "Draft" },
];

function typeLabel(t: CouponType): string {
  if (t === "percentage") return "Percentage";
  if (t === "fixed_amount") return "Fixed Amount";
  return "Product Bundle";
}

function statusTone(s: CouponStatus): "success" | "neutral" | "warning" {
  if (s === "active") return "success";
  if (s === "draft") return "warning";
  return "neutral";
}

function campaignAccentClasses(accent: ScheduledCampaign["accent"]) {
  if (accent === "amber")
    return {
      border: "border-l-tertiary-container",
      iconBg: "bg-tertiary-fixed/40 text-tertiary",
    };
  if (accent === "blue")
    return {
      border: "border-l-secondary-container",
      iconBg: "bg-secondary-container/60 text-on-secondary-container",
    };
  return {
    border: "border-l-tertiary",
    iconBg: "bg-tertiary-container/20 text-tertiary",
  };
}

export function CouponsPromotionsView() {
  const [ready, setReady] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<ScheduledCampaign[]>([]);
  const [filter, setFilter] = useState<"all" | CouponStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [moreOpen, setMoreOpen] = useState(false);
  const [minRedemptions, setMinRedemptions] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    code: string;
    campaignName: string;
  } | null>(null);

  const refresh = useCallback(() => {
    const s = loadCouponStore();
    setCoupons(s.coupons);
    setCampaigns(s.campaigns);
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const persist = useCallback((nextCoupons: Coupon[], nextCampaigns?: ScheduledCampaign[]) => {
    const s = loadCouponStore();
    const next = {
      coupons: nextCoupons,
      campaigns: nextCampaigns ?? s.campaigns,
    };
    saveCouponStore(next);
    setCoupons(next.coupons);
    setCampaigns(next.campaigns);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const minR = minRedemptions.trim() === "" ? null : Number(minRedemptions);
    return coupons.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (minR != null && !Number.isNaN(minR) && c.redemptions < minR) return false;
      if (!q) return true;
      const hay = `${c.code} ${c.campaignName} ${c.description ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [coupons, filter, search, minRedemptions]);

  useEffect(() => {
    setPage(1);
  }, [filter, search, minRedemptions]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const kpis = useMemo(() => {
    const active = coupons.filter((c) => c.status === "active").length;
    const redemptions = coupons.reduce((a, c) => a + c.redemptions, 0);
    const revenue = coupons.reduce((a, c) => a + c.revenueFromDiscount, 0);
    return { active, redemptions, revenue };
  }, [coupons]);

  const confirmDeleteCoupon = () => {
    if (!deleteTarget) return;
    persist(coupons.filter((c) => c.id !== deleteTarget.id));
  };

  const handleDuplicate = (c: Coupon) => {
    const copy: Coupon = {
      ...c,
      id: newCouponId(),
      code: `${c.code}-COPY`.slice(0, 32),
      status: "draft",
      redemptions: 0,
      revenueFromDiscount: 0,
      campaignName: `${c.campaignName} (copy)`,
    };
    persist([copy, ...coupons]);
  };

  const exportCsv = () => {
    const headers = [
      "code",
      "campaign",
      "type",
      "value",
      "expiry",
      "status",
      "redemptions",
      "revenue_gbp",
    ];
    const rows = filtered.map((c) => [
      c.code,
      c.campaignName,
      typeLabel(c.type),
      formatCouponValue(c),
      formatDisplayDate(c.expiryDate),
      c.status,
      String(c.redemptions),
      String(c.revenueFromDiscount),
    ]);
    const body = [headers, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "namaste-cam-coupons.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!ready) {
    return (
      <PageContainer title="Coupons & Promotions" description="Loading your marketing data…">
        <Card className="p-10 text-center text-secondary">Loading…</Card>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer
        title="Coupons & Promotions"
        description="Manage and monitor your restaurant marketing campaigns."
        actions={
          <Link
            href="/coupons/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-on-primary shadow-primary-soft transition-all hover:bg-primary/90 active:scale-95"
          >
            <MaterialIcon name="add" className="text-xl" />
            Add new coupon
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="group relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-4 -top-4 text-primary/10 transition-colors group-hover:text-primary/15">
              <MaterialIcon name="confirmation_number" className="text-9xl" />
            </div>
            <p className="relative z-10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary">
              Active coupons
            </p>
            <p className="relative z-10 mt-2 font-headline text-4xl font-extrabold text-on-surface">
              {kpis.active}
            </p>
            <p className="relative z-10 mt-4 flex items-center gap-2 text-sm font-bold text-green-600">
              <MaterialIcon name="trending_up" className="text-lg" />
              Live from your list
            </p>
          </Card>
          <Card className="relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-4 -top-4 text-primary/10">
              <MaterialIcon name="shopping_cart_checkout" className="text-9xl" />
            </div>
            <p className="relative z-10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary">
              Total redemptions
            </p>
            <p className="relative z-10 mt-2 font-headline text-4xl font-extrabold text-on-surface">
              {kpis.redemptions.toLocaleString()}
            </p>
            <p className="relative z-10 mt-4 flex items-center gap-2 text-sm font-bold text-green-600">
              <MaterialIcon name="trending_up" className="text-lg" />
              Summed across coupons
            </p>
          </Card>
          <Card className="relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-4 -top-4 text-primary/10">
              <MaterialIcon name="payments" className="text-9xl" />
            </div>
            <p className="relative z-10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary">
              Revenue from discounts
            </p>
            <p className="relative z-10 mt-2 font-headline text-4xl font-extrabold text-on-surface">
              £{kpis.revenue.toLocaleString()}
            </p>
            <p className="relative z-10 mt-4 flex items-center gap-2 text-sm font-bold text-secondary">
              <MaterialIcon name="horizontal_rule" className="text-lg" />
              Demo totals from seed data
            </p>
          </Card>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-4 border-b border-outline-variant/15 p-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <h2 className="font-headline text-lg font-bold text-on-surface">Active promotions</h2>
              <div className="flex flex-wrap gap-1 rounded-full bg-surface-container-high/80 p-1">
                {FILTER_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFilter(t.id)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                      filter === t.id
                        ? "bg-surface-container-lowest text-primary shadow-sm ring-1 ring-outline-variant/20"
                        : "text-secondary hover:text-primary",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setMoreOpen(true)}>
                <MaterialIcon name="filter_list" className="text-lg" />
                More filters
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
                <MaterialIcon name="download" className="text-lg" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="border-b border-outline-variant/10 px-6 py-4">
            <Input
              label="Search"
              placeholder="Search coupons, codes, or campaigns…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              left={<MaterialIcon name="search" className="text-xl text-secondary" />}
            />
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="px-8">Coupon code</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell className="text-right">Value</TableHeaderCell>
                <TableHeaderCell>Expiry date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="px-8 text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageSlice.map((c) => {
                const muted = c.status === "expired";
                return (
                  <TableRow key={c.id}>
                    <TableCell className="px-8">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={cn(
                            "font-bold tracking-wider text-on-surface",
                            muted && "text-secondary line-through",
                          )}
                        >
                          {c.code}
                        </span>
                        <span className="text-xs text-secondary">{c.campaignName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-sm font-medium", muted ? "text-secondary" : "text-on-surface-variant")}>
                        {typeLabel(c.type)}
                      </span>
                    </TableCell>
                    <TableCell className={cn("text-right font-bold", muted ? "text-secondary" : "text-primary")}>
                      {formatCouponValue(c)}
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-sm", muted ? "text-secondary" : "text-on-surface-variant")}>
                        {formatDisplayDate(c.expiryDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge tone={statusTone(c.status)} className="gap-1.5 tracking-wider">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            c.status === "active" && "bg-green-500",
                            c.status === "draft" && "bg-amber-500",
                            c.status === "expired" && "bg-stone-400",
                          )}
                          aria-hidden
                        />
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <div className="flex justify-end gap-1 text-secondary">
                        <button
                          type="button"
                          title="Duplicate"
                          className="rounded-full p-2 transition-colors hover:bg-surface-container-high hover:text-primary"
                          onClick={() => handleDuplicate(c)}
                        >
                          <MaterialIcon name="content_copy" className="text-lg" />
                        </button>
                        <Link
                          href={`/coupons/new?edit=${encodeURIComponent(c.id)}`}
                          title="Edit"
                          className="rounded-full p-2 transition-colors hover:bg-surface-container-high hover:text-primary"
                        >
                          <MaterialIcon name="edit" className="text-lg" />
                        </Link>
                        <button
                          type="button"
                          title="Delete"
                          className="rounded-full p-2 transition-colors hover:bg-surface-container-high hover:text-error"
                          onClick={() =>
                            setDeleteTarget({
                              id: c.id,
                              code: c.code,
                              campaignName: c.campaignName,
                            })
                          }
                        >
                          <MaterialIcon name="delete" className="text-lg" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-4 border-t border-outline-variant/10 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-secondary">
              Showing{" "}
              <span className="font-bold text-on-surface">
                {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} –{" "}
                {Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-bold text-on-surface">{filtered.length}</span> coupons
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full border border-outline-variant/30 text-secondary transition-colors hover:bg-surface-container-high disabled:opacity-40"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <MaterialIcon name="chevron_left" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full font-bold transition-colors",
                    n === safePage
                      ? "bg-primary text-on-primary shadow-primary-soft"
                      : "border border-outline-variant/30 text-on-surface hover:bg-surface-container-high",
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full border border-outline-variant/30 text-secondary transition-colors hover:bg-surface-container-high disabled:opacity-40"
                disabled={safePage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                aria-label="Next page"
              >
                <MaterialIcon name="chevron_right" />
              </button>
            </div>
          </div>
        </Card>

        <section className="space-y-6">
          <h3 className="font-headline text-xl font-extrabold text-on-surface">Upcoming scheduled campaigns</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((camp) => {
              const ac = campaignAccentClasses(camp.accent);
              return (
                <Card key={camp.id} className={cn("flex gap-4 border-l-4 p-5", ac.border)}>
                  <div
                    className={cn(
                      "flex size-16 shrink-0 items-center justify-center rounded-xl",
                      ac.iconBg,
                    )}
                  >
                    <MaterialIcon name={camp.icon} className="text-3xl" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-headline font-bold text-on-surface">{camp.title}</h4>
                    <p className="mt-1 text-sm text-secondary">{camp.description}</p>
                    <p className="mt-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                      <MaterialIcon name="calendar_today" className="text-sm" />
                      Starts {formatDisplayDate(camp.startsAt)}
                    </p>
                  </div>
                </Card>
              );
            })}
            <Link
              href="/coupons/new"
              className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-lowest/50 p-5 text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              <MaterialIcon name="add_circle" className="text-3xl" />
              <span className="text-sm font-bold">Schedule new campaign</span>
            </Link>
          </div>
        </section>
      </PageContainer>

      <DeleteConfirmModal
        open={deleteTarget != null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteCoupon}
        title="Delete coupon?"
        description={
          deleteTarget
            ? `Remove “${deleteTarget.code}” (${deleteTarget.campaignName})? This cannot be undone in the demo store.`
            : undefined
        }
        confirmLabel="Delete coupon"
      />

      <Modal
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="More filters"
        description="Refine the table. These apply together with the status chips and search."
      >
        <div className="space-y-4">
          <Input
            label="Minimum redemptions"
            type="number"
            min={0}
            placeholder="e.g. 100"
            value={minRedemptions}
            onChange={(e) => setMinRedemptions(e.target.value)}
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setMinRedemptions("");
                setMoreOpen(false);
              }}
            >
              Clear
            </Button>
            <Button type="button" size="sm" onClick={() => setMoreOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
