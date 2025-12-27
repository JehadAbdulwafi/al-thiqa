import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserForm } from "@/components/user-form"

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const { id } = await params

  if (!id) {
    redirect("/admin/users")
  }

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

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  })

  if (!user) {
    redirect("/admin/users")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">تعديل المستخدم</h2>
        <p className="text-muted-foreground mt-1">تحديث تفاصيل حساب المستخدم</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المستخدم</CardTitle>
          <CardDescription>قم بتحديث تفاصيل المستخدم أدناه</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
