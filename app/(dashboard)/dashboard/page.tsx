import {
  getDashboardStats,
  getMonthlyTrends,
  getTopProducts,
  getRecentActivity,
  getActivitySummary,
} from "@/lib/dashboard-queries"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SystemHealth } from "@/components/dashboard/system-health"
import { ExportOptions } from "@/components/dashboard/export-options"
import { TopProducts } from "@/components/dashboard/top-products"
import { ActivitySummary } from "@/components/dashboard/activity-summary"

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const trends = await getMonthlyTrends(7)
  const topProductsData = await getTopProducts(5)
  const recentActivity = await getRecentActivity(10)
  const activitySummaryData = await getActivitySummary()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على أداء المتجر</p>
      </div>

      <QuickActions />

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RecentActivity activity={recentActivity} />
        </div>
        <div className="lg:col-span-3">
          <SystemHealth />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TopProducts products={topProductsData} />
        <ActivitySummary {...activitySummaryData} />
      </div>
    </div>
  )
}
