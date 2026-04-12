import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function MenuPage() {
  return (
    <PageContainer title="Menu" description="Restaurant menus and items.">
      <Card className="p-6">
        <p className="text-stone-600">Menu placeholder.</p>
      </Card>
    </PageContainer>
  );
}
