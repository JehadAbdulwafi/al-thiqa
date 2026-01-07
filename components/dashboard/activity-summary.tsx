import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, Users } from "lucide-react"

interface ActivitySummaryProps {
  today: number
  thisWeek: number
  thisMonth: number
  actionBreakdown: Record<string, number>
  topUsers: Array<{ name: string; count: number }>
}

export function ActivitySummary({
  today,
  thisWeek,
  thisMonth,
  actionBreakdown,
  topUsers,
}: ActivitySummaryProps) {
  const stats = [
    {
      label: "اليوم",
      value: today,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: "هذا الأسبوع",
      value: thisWeek,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: "هذا الشهر",
      value: thisMonth,
      icon: <Activity className="h-4 w-4" />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>ملخص النشاط</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-muted-foreground">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">أنواع العمليات</h4>
          <div className="space-y-2">
            {Object.entries(actionBreakdown).length === 0 ? (
              <p className="text-sm text-muted-foreground">لا يوجد نشاط</p>
            ) : (
              Object.entries(actionBreakdown).map(([action, count]) => (
                <div
                  key={action}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {action === "CREATE" && "إنشاء"}
                    {action === "UPDATE" && "تحديث"}
                    {action === "DELETE" && "حذف"}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4" />
            أكثر المستخدمين نشاطاً
          </h4>
          <div className="space-y-2">
            {topUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا يوجد مستخدمين</p>
            ) : (
              topUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {index + 1}. {user.name}
                  </span>
                  <span className="font-medium">{user.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
