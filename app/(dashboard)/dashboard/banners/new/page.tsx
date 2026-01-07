import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { BannerForm } from "@/components/dashboard/banners/banner-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function BannerNewPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check if user is admin
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, parseInt(session.user.id)),
    columns: { role: true },
  })

  if (currentUser?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إضافة لافتة جديدة</h2>
        <p className="text-muted-foreground mt-1">إنشاء لافتة جديدة</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات اللافتة</CardTitle>
          <CardDescription>املأ التفاصيل للافتة الجديدة</CardDescription>
        </CardHeader>
        <CardContent>
          <BannerForm />
        </CardContent>
      </Card>
    </div>
  )
}
