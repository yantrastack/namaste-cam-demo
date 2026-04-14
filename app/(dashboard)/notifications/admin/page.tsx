import { AdminNotificationsClient } from "@/components/notifications/AdminNotificationsClient";
import { PageContainer } from "@/components/layout/PageContainer";

export default function AdminNotificationsPage() {
  return (
    <PageContainer
      title="Admin notifications"
      description="System events and delivery completions—order lifecycle signals in one place."
    >
      <AdminNotificationsClient />
    </PageContainer>
  );
}
