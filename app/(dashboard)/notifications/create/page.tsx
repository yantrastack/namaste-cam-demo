import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { CreateNotificationClient } from "@/components/notifications/CreateNotificationClient";
import { PageContainer } from "@/components/layout/PageContainer";
import { cn } from "@/lib/cn";

export default function CreateNotificationPage() {
  return (
    <PageContainer
      title="Create notification"
      description="Compose a campaign, choose channels, and preview before you send."
      actions={
        <Link
          href="/notifications/list"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95",
            "bg-surface-container-high text-on-surface ring-1 ring-outline-variant/20 hover:bg-surface-container-high/80",
          )}
        >
          <MaterialIcon name="format_list_bulleted" className="text-xl" />
          View list
        </Link>
      }
    >
      <CreateNotificationClient />
    </PageContainer>
  );
}
