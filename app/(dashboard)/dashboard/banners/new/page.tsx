import { db } from "@/lib/db"
import { banners } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { BannerForm } from "@/components/dashboard/banners/banner-form"

export default async function BannerNewPage() {
  const maxOrderBanner = await db.query.banners.findFirst({
    orderBy: [desc(banners.order)],
  })
  const nextOrder = maxOrderBanner ? (maxOrderBanner.order ?? 0) + 1 : 1

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">إنشاء لافتة جديدة</h1>
      <BannerForm />
    </div>
  )
}
