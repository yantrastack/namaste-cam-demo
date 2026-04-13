import Link from "next/link";
import { RestaurantOnboardForm } from "@/components/restaurants/RestaurantOnboardForm";
import { PageContainer } from "@/components/layout/PageContainer";

export default function RestaurantCreatePage() {
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm font-medium">
        <ol className="flex flex-wrap items-center gap-2 text-on-surface-variant">
          <li>
            <Link href="/dashboard" className="transition-colors hover:text-primary">
              Dashboard
            </Link>
          </li>
          <li aria-hidden className="text-on-surface-variant/60">
            /
          </li>
          <li>
            <Link href="/restaurants" className="transition-colors hover:text-primary">
              Restaurant management
            </Link>
          </li>
          <li aria-hidden className="text-on-surface-variant/60">
            /
          </li>
          <li className="font-bold text-primary">Create new</li>
        </ol>
      </nav>

      <PageContainer
        title="Create new"
        description="Create a new restaurant profile in the Namaste Cam network."
      >
        <RestaurantOnboardForm />
      </PageContainer>
    </div>
  );
}
