import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
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
  type SalesLocationTrend,
} from "@/lib/restaurants-directory-sample";

function SalesTrendIcon({ trend }: { trend: SalesLocationTrend }) {
  if (trend === "up") {
    return <MaterialIcon name="trending_up" className="text-sm text-green-600" />;
  }
  if (trend === "down") {
    return <MaterialIcon name="trending_down" className="text-sm text-red-600" />;
  }
  return <MaterialIcon name="horizontal_rule" className="text-sm text-on-surface-variant" />;
}

function salesDeltaTone(trend: SalesLocationTrend) {
  if (trend === "up") return "text-green-600";
  if (trend === "down") return "text-red-600";
  return "text-on-surface-variant";
}

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
  return (
    <div className="flex items-center justify-end">
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

export default async function RestaurantsPage() {
  await connection();
  const data = getPartnerDirectorySample();

  return (
    <PageContainer
      title="Manage restaurant"
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
          <div className="border-b border-outline-variant/10 px-6 py-5">
            <h3 className="text-lg font-bold text-on-surface">Restaurant listing</h3>
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
                  <TableCell>{statusPill(row.status)}</TableCell>
                  <TableCell className="text-right">
                    <RowActions row={row} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="col-span-1 space-y-3 lg:col-span-12">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h3 className="text-base font-bold text-on-surface">Sales by location</h3>
            <p className="text-sm text-on-surface-variant">{data.salesByLocation.periodLabel}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.salesByLocation.locations.map((loc) => (
              <Card
                key={loc.id}
                className={cn(
                  "flex flex-col gap-3 p-5",
                  loc.highlight && "border-l-4 border-l-primary",
                )}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {loc.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-on-surface-variant">{loc.serviceMode}</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-on-surface">{loc.revenue}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className={cn("flex items-center gap-1 text-xs font-bold", salesDeltaTone(loc.trend))}>
                      {loc.deltaLabel}
                      <SalesTrendIcon trend={loc.trend} />
                    </span>
                    <span className="text-xs text-on-surface-variant">{loc.deltaCaption}</span>
                  </div>
                </div>
                <p className="mt-auto text-xs font-semibold text-on-surface-variant">{loc.ordersLabel}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
