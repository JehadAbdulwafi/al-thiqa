import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users as usersTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { PasswordForm } from "@/components/dashboard/password-form"
import { User, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await db.query.users.findFirst({
    where: eq(usersTable.id, session.user.id),
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الإعدادات</h2>
        <p className="text-muted-foreground mt-1">إدارة إعدادات حسابك وتفضيلاتك</p>
      </div>

      <Tabs defaultValue="profile" dir="rtl" className="space-y-4">
        <TabsList dir="rtl">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            الأمان
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الملف الشخصي</CardTitle>
              <CardDescription>تحديث معلوماتك الشخصية وعنوان بريدك الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الحساب</CardTitle>
              <CardDescription>معلومات حسابك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-sm font-medium">الدور</p>
                  <p className="text-sm text-muted-foreground">دور حسابك</p>
                </div>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">تاريخ الانضمام</p>
                  <p className="text-sm text-muted-foreground">تاريخ إنشاء الحساب</p>
                </div>
                <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تغيير كلمة المرور</CardTitle>
              <CardDescription>تحديث كلمة مرورك للحفاظ على أمان حسابك</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
