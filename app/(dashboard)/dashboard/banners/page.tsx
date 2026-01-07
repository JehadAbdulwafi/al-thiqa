import { db } from "@/lib/db"
import { banners } from "@/lib/db/schema"
import { eq, desc, asc } from "drizzle-orm"
import { BannersTable } from "@/components/dashboard/banners/banners-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default async function BannersPage() {
  const allBanners = await db.query.banners.findMany({
    orderBy: [asc(banners.order)],
  })

  const formattedBanners = allBanners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    cta: banner.cta,
    image: banner.image,
    isActive: banner.isActive ?? false,
    order: banner.order ?? 0,
    createdAt: banner.createdAt,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">اللافتات</h1>
        <Button asChild>
          <Link href="/dashboard/banners/new">إضافة لافتة جديدة</Link>
        </Button>
      </div>

      <BannersTable banners={formattedBanners} />
    </div>
  )
}
