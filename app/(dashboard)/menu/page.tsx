import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export default function MenuPage() {
  return (
    <PageContainer
      title="Menu"
      description="Restaurant menus and items."
      actions={
        <Link
          href="/menu/new"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold shadow-md transition-all active:scale-95",
            "bg-primary text-on-primary shadow-primary-soft hover:bg-primary/90",
          )}
        >
          <MaterialIcon name="add" className="text-xl" />
          Add product
        </Link>
      }
    >
      <Card className="p-6">
        <p className="font-medium text-secondary">Menu overview placeholder.</p>
      </Card>
    </PageContainer>
  );
}
