import { db } from "@/lib/db"
import { banners } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { BannerForm } from "@/components/dashboard/banners/banner-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type BannerEditPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function BannerEditPage({ params }: BannerEditPageProps) {
  const { id } = await params
  const banner = await db.query.banners.findFirst({
    where: eq(banners.id, parseInt(id, 10)),
  })

  if (!banner) {
    return <div className="container mx-auto px-4 py-8">اللافتة غير موجودة</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard/banners" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى اللوفتات
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">تحديث اللافتة</h1>
      <BannerForm banner={banner} />
    </div>
  )
}
