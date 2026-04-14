import type { KitchenIngredientRow } from "@/lib/inventory-data";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";

function statusBadge(status: KitchenIngredientRow["status"]) {
  if (status === "in_stock") return <Badge tone="success">In stock</Badge>;
  if (status === "low") return <Badge tone="warning">Low</Badge>;
  return <Badge tone="error">Out</Badge>;
}

export function KitchenIngredientsTable({ rows }: { rows: KitchenIngredientRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/10">
      <Table>
        <TableHead>
          <TableRow className="hover:bg-transparent">
            <TableHeaderCell>Ingredient</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Level</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div>
                  <p className="font-bold text-on-surface">{row.name}</p>
                  {row.batchLabel ? (
                    <p className="text-xs font-medium text-on-surface-variant">{row.batchLabel}</p>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-sm text-on-surface-variant">{row.category}</TableCell>
              <TableCell>{statusBadge(row.status)}</TableCell>
              <TableCell className="min-w-[140px]">
                <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      row.status === "out"
                        ? "bg-error/80"
                        : row.status === "low"
                          ? "bg-tertiary"
                          : "bg-primary",
                    )}
                    style={{ width: `${row.levelPct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-medium text-on-surface-variant">{row.levelPct}%</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
