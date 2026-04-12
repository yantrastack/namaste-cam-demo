import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function OrdersHistoryPage() {
  return (
    <PageContainer title="Order history" description="Past orders and archived activity.">
      <Card className="p-6">
        <p className="font-medium text-secondary">History placeholder.</p>
      </Card>
    </PageContainer>
  );
}
