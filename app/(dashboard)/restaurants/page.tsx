import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  getPartnerDirectorySample,
  type PartnerDirectoryRow,
  type PartnerRestaurantStatus,
} from "@/lib/restaurants-directory-sample";

function statusPill(status: PartnerRestaurantStatus) {
  const styles: Record<PartnerRestaurantStatus, { dot: string; wrap: string; text: string }> = {
    active: {
      dot: "bg-green-500",
      wrap: "bg-green-50 text-green-700 ring-1 ring-green-100",
      text: "Active",
    },
    pending: {
      dot: "bg-amber-500",
      wrap: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
      text: "Pending",
    },
    inactive: {
      dot: "bg-stone-400",
      wrap: "bg-stone-100 text-stone-600 ring-1 ring-stone-200/80",
      text: "Inactive",
    },
  };
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
        s.wrap,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", s.dot)} />
      {s.text}
    </span>
  );
}

function RowActions({ row }: { row: PartnerDirectoryRow }) {
  if (row.actionKind === "pending_review") {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="primary" size="sm" type="button" className="min-w-0 rounded-full px-3 py-1.5 text-[11px]">
          Approve
        </Button>
        <Button variant="secondary" size="sm" type="button" className="min-w-0 rounded-full px-3 py-1.5 text-[11px]">
          Reject
        </Button>
      </div>
    );
  }
  if (row.actionKind === "inactive") {
    return (
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-full px-2 py-2 text-xs font-bold uppercase text-primary hover:underline"
        >
          Activate
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
          aria-label={`Edit ${row.name}`}
        >
          <MaterialIcon name="edit" className="text-lg" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        aria-label={`Edit ${row.name}`}
      >
        <MaterialIcon name="edit" className="text-lg" />
      </button>
      <button
        type="button"
        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        aria-label={`Suspend ${row.name}`}
      >
        <MaterialIcon name="block" className="text-lg" />
      </button>
      <button
        type="button"
        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        aria-label={`More actions for ${row.name}`}
      >
        <MaterialIcon name="more_vert" className="text-lg" />
      </button>
    </div>
  );
}

export default async function RestaurantsPage() {
  await connection();
  const data = getPartnerDirectorySample();

  return (
    <PageContainer
      title="Restaurant management"
      description="Monitor, verify, and manage culinary partners across the Namaste Cam network."
      actions={
        <>
          <Button variant="secondary" size="sm" type="button">
            <MaterialIcon name="download" className="text-lg" />
            Export data
          </Button>
          <Link
            href="/restaurants/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-md shadow-primary-soft transition-all hover:bg-primary/90 active:scale-95"
          >
            <MaterialIcon name="add" className="text-lg" />
            Onboard new
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="flex flex-col overflow-hidden p-0 lg:col-span-12">
          <div className="flex flex-col gap-3 border-b border-outline-variant/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-on-surface">Partner directory</h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed">
                {data.pendingCount} pending
              </span>
              <span className="rounded-md bg-surface-container-high px-3 py-1 text-xs font-bold text-on-surface-variant">
                {data.totalCount.toLocaleString()} total
              </span>
            </div>
          </div>
          <Table>
            <TableHead className="bg-surface-container-low/50">
              <tr>
                <TableHeaderCell className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  Restaurant
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  Owner
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  Location
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  Cuisine
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  Status
                </TableHeaderCell>
                <TableHeaderCell className="py-5 text-right text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  Actions
                </TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody className="divide-y divide-outline-variant/10">
              {data.rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-surface-container-low/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={row.imageSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{row.name}</p>
                        <p className="text-[10px] italic text-on-surface-variant">ID: #{row.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-on-surface">{row.owner}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-on-surface-variant">{row.location}</p>
                  </TableCell>
                  <TableCell>
                    <Badge tone="info" className="normal-case tracking-normal">
                      {row.cuisine}
                    </Badge>
                  </TableCell>
                  <TableCell>{statusPill(row.status)}</TableCell>
                  <TableCell className="text-right">
                    <RowActions row={row} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="col-span-1 grid gap-6 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4">
          <Card className="border-l-4 border-l-primary p-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              New applications
            </p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-extrabold text-on-surface">{data.kpis.newApplications.value}</p>
              <span className="flex items-center text-xs font-bold text-green-600">
                {data.kpis.newApplications.delta}{" "}
                <MaterialIcon name="trending_up" className="text-sm" />
              </span>
            </div>
          </Card>
          <Card className="p-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Total revenue share
            </p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-extrabold text-on-surface">{data.kpis.revenueShare.value}</p>
              <span className="flex items-center text-xs font-bold text-green-600">
                {data.kpis.revenueShare.delta}{" "}
                <MaterialIcon name="trending_up" className="text-sm" />
              </span>
            </div>
          </Card>
          <Card className="p-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Partner satisfaction
            </p>
            <div className="flex items-end justify-between gap-2">
              <p className="text-3xl font-extrabold text-on-surface">{data.kpis.satisfaction.value}</p>
              <div className="flex text-tertiary" aria-hidden>
                {[1, 2, 3, 4].map((i) => (
                  <MaterialIcon key={i} name="star" className="text-sm" style={{ fontVariationSettings: "'FILL' 1" }} />
                ))}
                <MaterialIcon name="star_half" className="text-sm" style={{ fontVariationSettings: "'FILL' 1" }} />
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Churn rate
            </p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-extrabold text-on-surface">{data.kpis.churn.value}</p>
              <span className="text-xs font-bold text-on-surface-variant">{data.kpis.churn.note}</span>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
