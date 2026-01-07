import {
  getDashboardStats,
  getTopProducts,
  getRecentActivity,
} from "@/lib/dashboard-queries"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SystemHealth } from "@/components/dashboard/system-health"
import { ExportOptions } from "@/components/dashboard/export-options"
import { TopProducts } from "@/components/dashboard/top-products"

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const topProductsData = await getTopProducts(5)
  const recentActivity = await getRecentActivity(10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على أداء المتجر</p>
      </div>

      <QuickActions />

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <TopProducts products={topProductsData} />
        <SystemHealth />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity activity={recentActivity} />
        <ExportOptions />
      </div>
    </div>
  )
}
