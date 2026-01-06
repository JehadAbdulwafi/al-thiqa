import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users as usersTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getActivityLogs } from "@/app/actions/activity"
import { ActivityLogsList } from "@/components/dashboard/activity-logs-list"
import { History } from "lucide-react"

export default async function ActivityPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await db.query.users.findFirst({
    where: eq(usersTable.id, Number(session.user.id)),
  })

  if (!user) {
    redirect("/login")
  }

  const logs = await getActivityLogs()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">سجل النشاطات</h2>
        <p className="text-muted-foreground mt-1">عرض وتتبع جميع أنشطة المستخدمين في النظام</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            سجل النشاطات الأخير
          </CardTitle>
          <CardDescription>
            يعرض هذا القائمة جميع العمليات التي قام بها المستخدمون في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityLogsList logs={logs} />
        </CardContent>
      </Card>
    </div>
  )
}
