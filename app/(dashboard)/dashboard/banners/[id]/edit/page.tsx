import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { BannerForm } from "@/components/dashboard/banners/banner-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBannerById } from "@/lib/queries"

interface EditBannerPageProps {
  params: {
    id: string
  }
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const session = await auth()
  const { id } = await params

  if (!id) {
    redirect("/dashboard/banners")
  }

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

  const bannerId = parseInt(id, 10)
  if (isNaN(bannerId)) {
    redirect("/dashboard/banners")
  }

  const banner = await getBannerById(bannerId)
  if (!banner) {
    redirect("/dashboard/banners")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">تعديل اللافتة: {banner.title}</h2>
        <p className="text-muted-foreground mt-1">تحديث تفاصيل اللافتة</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات اللافتة</CardTitle>
          <CardDescription>قم بتحديث تفاصيل اللافتة أدناه</CardDescription>
        </CardHeader>
        <CardContent>
          <BannerForm banner={{
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle,
            cta: banner.cta,
            image: banner.image,
            isActive: banner.isActive ?? false,
            order: banner.order ?? 0,
          }} />
        </CardContent>
      </Card>
    </div>
  )
}
