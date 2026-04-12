import { MaterialIcon } from "@/components/MaterialIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";

export function DsInventory() {
  return (
    <section className="space-y-12" id="tables">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight">
          05 Inventory Management
        </h2>
      </div>
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <Table>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              <TableHeaderCell>Ingredient</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Stock Level</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 font-bold text-primary">
                    SF
                  </div>
                  <div>
                    <p className="font-bold">Iranian Saffron</p>
                    <p className="text-xs text-stone-400">Batch #4421</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">Premium Spices</TableCell>
              <TableCell>
                <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-green-600">
                  In Stock
                </span>
              </TableCell>
              <TableCell>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full w-4/5 rounded-full bg-primary" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="p-2 text-stone-400 transition-colors hover:text-primary"
                    aria-label="Edit"
                  >
                    <MaterialIcon name="edit" className="text-xl" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-stone-400 transition-colors hover:text-error"
                    aria-label="Delete"
                  >
                    <MaterialIcon name="delete" className="text-xl" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 font-bold text-primary">
                    WT
                  </div>
                  <div>
                    <p className="font-bold">White Truffle Oil</p>
                    <p className="text-xs text-stone-400">Batch #9901</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">Oils &amp; Vinegars</TableCell>
              <TableCell>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-600">
                  Low Stock
                </span>
              </TableCell>
              <TableCell>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full w-1/4 rounded-full bg-amber-500" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="p-2 text-stone-400 transition-colors hover:text-primary"
                    aria-label="Edit"
                  >
                    <MaterialIcon name="edit" className="text-xl" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-stone-400 transition-colors hover:text-error"
                    aria-label="Delete"
                  >
                    <MaterialIcon name="delete" className="text-xl" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t border-stone-200/50 bg-stone-50 px-6 py-4">
          <span className="text-xs text-stone-400">Showing 2 of 24 items</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition-all hover:bg-stone-50"
              aria-label="Previous page"
            >
              <MaterialIcon name="chevron_left" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white transition-all"
            >
              1
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition-all hover:bg-stone-50"
            >
              2
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition-all hover:bg-stone-50"
              aria-label="Next page"
            >
              <MaterialIcon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
