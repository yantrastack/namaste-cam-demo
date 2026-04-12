import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function RestaurantCreatePage() {
  return (
    <PageContainer
      title="Create or edit restaurant"
      description="Add a partner location or update its details."
    >
      <Card className="p-6">
        <p className="font-medium text-secondary">Form placeholder.</p>
      </Card>
    </PageContainer>
  );
}
