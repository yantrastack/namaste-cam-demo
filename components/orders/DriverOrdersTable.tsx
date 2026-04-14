import { Card } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import type { DriverOrderSummary } from "@/lib/driver-orders-data";

export type DriverOrdersTableProps = {
  rows: DriverOrderSummary[];
};

export function DriverOrdersTable({ rows }: DriverOrdersTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Driver</TableHeaderCell>
            <TableHeaderCell className="text-right">Total</TableHeaderCell>
            <TableHeaderCell className="text-right">Yet to deliver</TableHeaderCell>
            <TableHeaderCell className="text-right">Delivered</TableHeaderCell>
            <TableHeaderCell>Delivered details</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-12 text-center text-sm font-medium text-secondary"
              >
                No driver assignment data yet.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => (
              <TableRow key={r.agentId}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-on-surface">{r.name}</span>
                    <span className="text-sm text-secondary">{r.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-on-surface">
                  {r.total}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-on-surface">
                  {r.yetToDeliver}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-on-surface">
                  {r.delivered}
                </TableCell>
                <TableCell className="max-w-md text-sm text-secondary">
                  {r.deliveredDetails ?? "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
