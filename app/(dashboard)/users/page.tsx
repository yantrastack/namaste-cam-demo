import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function UsersPage() {
  return (
    <PageContainer title="Users" description="Staff and customer accounts.">
      <Card className="p-6">
        <p className="text-stone-600">Users placeholder.</p>
      </Card>
    </PageContainer>
  );
}
