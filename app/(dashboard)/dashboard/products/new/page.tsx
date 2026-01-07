import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { getCollectionsForForm } from "@/lib/queries"

export default async function NewProductPage() {
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

  const collections = await getCollectionsForForm()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إضافة منتج جديد</h2>
        <p className="text-muted-foreground mt-1">إنشاء منتج جديد</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المنتج</CardTitle>
          <CardDescription>املأ التفاصيل للمنتج الجديد</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm collections={collections} />
        </CardContent>
      </Card>
    </div>
  )
}
