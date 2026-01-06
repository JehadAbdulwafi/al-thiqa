import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users as usersTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTermsOfService } from "@/lib/queries"
import { TermsOfServiceForm } from "@/components/dashboard/terms/terms-form"
import { FileText } from "lucide-react"

export default async function TermsPage() {
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

  const termsOfServiceData = await getTermsOfService()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">شروط الخدمة</h2>
        <p className="text-muted-foreground mt-1">إدارة وتحديث شروط الخدمة</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تحديث شروط الخدمة
          </CardTitle>
          <CardDescription>
            قم بتحديث العنوان والمحتوى وتاريخ السريان لشروط الخدمة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TermsOfServiceForm termsOfServiceData={termsOfServiceData || undefined} />
        </CardContent>
      </Card>
    </div>
  )
}
