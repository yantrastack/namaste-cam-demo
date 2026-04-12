import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

export function OrderScreenBreadcrumbs({
  orderCode,
  tail,
  ordersCrumb,
}: {
  orderCode: string;
  /** Optional final crumb (e.g. "Edit"). */
  tail?: string;
  /** Override the default Orders list link (e.g. archive). */
  ordersCrumb?: { href: string; label: string };
}) {
  const ordersLink = ordersCrumb ?? { href: "/orders", label: "Orders" };
  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
      <Link href="/dashboard" className="transition-colors hover:text-primary">
        Admin
      </Link>
      <MaterialIcon name="chevron_right" className="text-sm text-outline" />
      <Link href={ordersLink.href} className="transition-colors hover:text-primary">
        {ordersLink.label}
      </Link>
      <MaterialIcon name="chevron_right" className="text-sm text-outline" />
      <span className="text-primary">#{orderCode}</span>
      {tail ? (
        <>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" />
          <span className="text-on-surface">{tail}</span>
        </>
      ) : null}
    </nav>
  );
}
