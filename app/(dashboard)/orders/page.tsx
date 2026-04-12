import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function OrdersPage() {
  return (
    <PageContainer title="Orders" description="Track and manage delivery orders.">
      <Card className="p-6">
        <p className="text-stone-600">Orders placeholder.</p>
      </Card>
    </PageContainer>
  );
}
