import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

export function MenuItemDetailBreadcrumbs({
  listHref,
  itemName,
}: {
  /** Catalog list route, e.g. `/menu/item-list` */
  listHref: string;
  itemName: string;
}) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 text-sm font-semibold"
      aria-label="Breadcrumb"
    >
      <Link
        href="/dashboard"
        className="text-secondary transition-colors hover:text-primary"
      >
        Admin
      </Link>
      <MaterialIcon name="chevron_right" className="!text-base text-outline" aria-hidden />
      <Link
        href={listHref}
        className="text-secondary transition-colors hover:text-primary"
      >
        Product list
      </Link>
      <MaterialIcon name="chevron_right" className="!text-base text-outline" aria-hidden />
      <span className="min-w-0 truncate text-on-surface" title={itemName}>
        {itemName}
      </span>
    </nav>
  );
}
