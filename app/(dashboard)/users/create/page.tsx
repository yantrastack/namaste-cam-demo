import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function UserCreatePage() {
  return (
    <PageContainer title="Create user" description="Invite or register a new user account.">
      <Card className="p-6">
        <p className="font-medium text-secondary">User form placeholder.</p>
      </Card>
    </PageContainer>
  );
}
