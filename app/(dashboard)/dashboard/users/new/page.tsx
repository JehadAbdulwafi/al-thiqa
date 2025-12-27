import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "@/components/user-form"

export default async function NewUserPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check if user is admin
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { role: true },
  })
  if (currentUser?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إضافة مستخدم جديد</h2>
        <p className="text-muted-foreground mt-1">إنشاء حساب مستخدم جديد</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المستخدم</CardTitle>
          <CardDescription>املأ التفاصيل للمستخدم الجديد</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  )
}
