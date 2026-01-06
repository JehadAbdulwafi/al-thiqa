import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users as usersTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPrivacyPolicy } from "@/lib/queries"
import { PrivacyPolicyForm } from "@/components/dashboard/privacy/privacy-form"
import { Shield } from "lucide-react"

export default async function PrivacyPage() {
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

  const privacyPolicyData = await getPrivacyPolicy()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">سياسة الخصوصية</h2>
        <p className="text-muted-foreground mt-1">إدارة وتحديث سياسة الخصوصية</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            تحديث سياسة الخصوصية
          </CardTitle>
          <CardDescription>
            قم بتحديث العنوان والمحتوى وتاريخ السريان لسياسة الخصوصية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PrivacyPolicyForm privacyPolicyData={privacyPolicyData || undefined} />
        </CardContent>
      </Card>
    </div>
  )
}
