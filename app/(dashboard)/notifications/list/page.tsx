import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { NotificationsListClient } from "@/components/notifications/NotificationsListClient";
import { PageContainer } from "@/components/layout/PageContainer";
import { cn } from "@/lib/cn";

export default function NotificationsListPage() {
  return (
    <PageContainer
      title="Notifications list"
      description="Campaigns and operational pings your team has queued or sent to guests."
      actions={
        <Link
          href="/notifications/create"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold shadow-md transition-all active:scale-95",
            "bg-primary text-on-primary shadow-primary-soft hover:bg-primary/90",
          )}
        >
          <MaterialIcon name="add" className="text-xl" />
          Create notification
        </Link>
      }
    >
      <NotificationsListClient />
    </PageContainer>
  );
}
