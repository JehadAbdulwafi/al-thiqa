import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CollectionForm } from "@/components/dashboard/collections/collection-form"

export default async function NewCollectionPage() {
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
        <h2 className="text-3xl font-bold tracking-tight">إضافة مجموعة جديدة</h2>
        <p className="text-muted-foreground mt-1">إنشاء مجموعة جديدة</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المجموعة</CardTitle>
          <CardDescription>املأ التفاصيل للمجموعة الجديدة</CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionForm />
        </CardContent>
      </Card>
    </div>
  )
}
