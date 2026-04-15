import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { RestaurantOnboardForm } from "@/components/restaurants/RestaurantOnboardForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { getPartnerDirectoryRowById } from "@/lib/restaurants-directory-sample";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RestaurantEditPage({ params }: Props) {
  await connection();
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const row = getPartnerDirectoryRowById(decodedId);
  if (!row) notFound();

  const serviceMode = row.serviceMode.toLowerCase();
  const deliveryOnly = serviceMode === "delivery only";

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
              Manage restaurant
            </Link>
          </li>
          <li aria-hidden className="text-on-surface-variant/60">
            /
          </li>
          <li className="font-bold text-primary">Edit</li>
        </ol>
      </nav>

      <PageContainer
        title={`Edit ${row.location}`}
        description={`Update ${row.name} (${row.id}) on the Namaste Cam network.`}
      >
        <RestaurantOnboardForm
          key={row.id}
          variant="edit"
          restaurantId={row.id}
          defaults={{
            restaurantName: row.name,
            operationalActive: row.status === "active",
            deliveryOnly,
            managerName: row.manager,
          }}
        />
      </PageContainer>
    </div>
  );
}
