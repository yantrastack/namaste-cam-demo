import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function OrderCreatePage() {
  return (
    <PageContainer title="Create order" description="Start a new order on behalf of a customer.">
      <Card className="p-6">
        <p className="font-medium text-secondary">Create order placeholder.</p>
      </Card>
    </PageContainer>
  );
}
