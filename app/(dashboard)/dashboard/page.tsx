import {
  getDashboardStats,
  getMonthlyTrends,
  getTopProducts,
  getRecentActivity,
  getPendingTasks,
  getActivitySummary,
  getUserActivityByRole,
} from "@/lib/dashboard-queries"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { TopProducts } from "@/components/dashboard/top-products"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActivitySummary } from "@/components/dashboard/activity-summary"
import { PendingTasks } from "@/components/dashboard/pending-tasks"
import { SystemHealth } from "@/components/dashboard/system-health"
import { QuickSearch } from "@/components/dashboard/quick-search"
import { ExportOptions } from "@/components/dashboard/export-options"
import { TimeRangeFilter } from "@/components/dashboard/time-range-filter"
import { UserActivity } from "@/components/dashboard/user-activity"

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const trends = await getMonthlyTrends(7)
  const topProducts = await getTopProducts(5)
  const recentActivity = await getRecentActivity(10)
  const pendingTasks = await getPendingTasks()
  const activitySummary = await getActivitySummary()
  const userActivityData = await getUserActivityByRole(6)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على أداء المتجر</p>
      </div>

      <QuickActions />

      <StatsCards stats={stats} />

      <PendingTasks tasks={pendingTasks} />

      <div className="flex justify-end">
        <TimeRangeFilter />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesChart data={trends} />
        </div>
        <div className="lg:col-span-3">
          <UserActivity data={userActivityData} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TopProducts products={topProducts} />
        <ActivitySummary {...activitySummary} />
      </div>

      <RecentActivity activity={recentActivity} />

      <div className="grid gap-6 md:grid-cols-2">
        <SystemHealth />
        <ExportOptions />
      </div>

      <QuickSearch />
    </div>
  )
}
