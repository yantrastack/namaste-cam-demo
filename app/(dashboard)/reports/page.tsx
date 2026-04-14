import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { MaterialIcon } from "@/components/MaterialIcon";
import { ReportsToolbar } from "@/components/reports/ReportsToolbar";

export const metadata: Metadata = {
  title: "Reports",
  description: "Read-only analytics and exports across operations.",
};

const LINKS: { href: string; title: string; description: string; icon: string }[] = [
  {
    href: "/reports/sales",
    title: "Sales & revenue",
    description: "KPIs, category mix, and order trend versus the prior window.",
    icon: "payments",
  },
  {
    href: "/reports/orders",
    title: "Orders analytics",
    description: "Closed ticket volume, cancellations, and delivery vs collection mix.",
    icon: "shopping_cart",
  },
  {
    href: "/reports/delivery",
    title: "Delivery performance",
    description: "On-time rate, route time, and late-cluster notes (sample).",
    icon: "local_shipping",
  },
  {
    href: "/reports/menu",
    title: "Menu performance",
    description: "Top movers, slow sellers, and attach-rate hints from demo data.",
    icon: "restaurant_menu",
  },
  {
    href: "/reports/staff",
    title: "Staff & labor",
    description: "Worked vs scheduled hours and punctuality rollups (sample).",
    icon: "badge",
  },
];

export default function ReportsHubPage() {
  return (
    <PageContainer
      title="Reports"
      description="Time-scoped analytics and exports. Operational edits stay on their own screens."
      actions={<ReportsToolbar />}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="group block min-h-0">
            <Card className="h-full border border-transparent p-6 transition-all hover:border-primary/10 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-primary-fixed/50 p-2 text-primary ring-1 ring-outline-variant/15">
                <MaterialIcon name={item.icon} className="text-2xl" />
              </div>
              <h2 className="font-headline text-lg font-extrabold tracking-tight text-on-surface group-hover:text-primary">
                {item.title}
              </h2>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
