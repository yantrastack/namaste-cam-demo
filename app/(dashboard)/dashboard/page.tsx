import { MaterialIcon } from "@/components/MaterialIcon";
import { DashboardKpiGrid } from "@/components/dashboard/DashboardKpiGrid";
import { OrdersTrendPanel } from "@/components/dashboard/OrdersTrendPanel";
import { RevenueByCategoryPanel } from "@/components/dashboard/RevenueByCategoryPanel";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardRecentActiveOrders } from "@/components/orders/DashboardRecentActiveOrders";
import { Button } from "@/components/ui/Button";
import { buildActiveOrdersKpi, generateDashboardSampleData } from "@/lib/dashboard-sample-data";
import { listActiveRestaurantOrders } from "@/lib/orders-restaurant-data";

export default async function DashboardPage() {
  const data = generateDashboardSampleData();
  const activeOrders = listActiveRestaurantOrders();
  const kpis = [...data.kpis, buildActiveOrdersKpi(activeOrders.length)];

  return (
    <>
      <PageContainer
        title="Dashboard overview"
        description="Welcome back. Here is what is happening today."
        actions={
          <>
            <Button variant="secondary" size="sm" type="button">
              <MaterialIcon name="calendar_today" className="text-lg" />
              Last 30 days
            </Button>
            <Button variant="primary" size="sm" type="button">
              <MaterialIcon name="download" className="text-lg" />
              Export report
            </Button>
          </>
        }
      >
        <div className="space-y-10">
          <DashboardKpiGrid kpis={kpis} />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <OrdersTrendPanel
              className="lg:col-span-2"
              current={data.trendCurrent}
              previous={data.trendPrevious}
            />
            <RevenueByCategoryPanel rows={data.revenueCategories} insight={data.insight} />
          </div>
          <DashboardRecentActiveOrders orders={activeOrders} />
        </div>
      </PageContainer>
      <Button
        variant="primary"
        size="sm"
        type="button"
        aria-label="New entry"
        className="fixed bottom-8 right-8 z-40 size-14 min-w-0 rounded-full p-0 shadow-lg shadow-primary-soft"
      >
        <MaterialIcon name="add" className="text-2xl" />
      </Button>
    </>
  );
}
