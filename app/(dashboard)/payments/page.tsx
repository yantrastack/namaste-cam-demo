import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function PaymentsPage() {
  return (
    <PageContainer title="Payments" description="Transactions and payouts.">
      <Card className="p-6">
        <p className="text-stone-600">Payments placeholder.</p>
      </Card>
    </PageContainer>
  );
}
