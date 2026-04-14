"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MENU_CATALOG_EVENT, mergeMenuWithLocal } from "@/lib/menu-local-catalog";
import { listSellableStockRows } from "@/lib/inventory-data";
import type { MenuDocument } from "@/components/menu/types";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { MaterialIcon } from "@/components/MaterialIcon";

export function InventoryStockClient({ initialDocument }: { initialDocument: MenuDocument }) {
  const [doc, setDoc] = useState(initialDocument);

  useEffect(() => {
    setDoc(mergeMenuWithLocal(initialDocument));
  }, [initialDocument]);

  useEffect(() => {
    const bump = () => setDoc(mergeMenuWithLocal(initialDocument));
    window.addEventListener(MENU_CATALOG_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(MENU_CATALOG_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, [initialDocument]);

  const rows = useMemo(() => listSellableStockRows(doc), [doc]);

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/10">
      <Table>
        <TableHead>
          <TableRow className="hover:bg-transparent">
            <TableHeaderCell>Item</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Availability</TableHeaderCell>
            <TableHeaderCell>Qty</TableHeaderCell>
            <TableHeaderCell>Note</TableHeaderCell>
            <TableHeaderCell className="text-right">Catalog</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-bold text-on-surface">{r.name}</TableCell>
              <TableCell className="text-sm text-on-surface-variant">{r.category}</TableCell>
              <TableCell>
                {r.available ? (
                  <Badge tone={r.isLow ? "warning" : "success"}>{r.isLow ? "Low stock" : "Selling"}</Badge>
                ) : (
                  <Badge tone="neutral">Off</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-on-surface-variant">
                {r.availableQty === null ? "—" : r.availableQty.toLocaleString("en-US")}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-on-surface-variant">
                {r.stockNote ?? "—"}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/menu/item-list/${encodeURIComponent(r.id)}`}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full font-bold text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-primary active:scale-95",
                  )}
                  aria-label="Open in menu catalog"
                >
                  <MaterialIcon name="open_in_new" className="text-lg" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
