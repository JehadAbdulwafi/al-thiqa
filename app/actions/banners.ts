"use server"

import { db } from "@/lib/db"
import { banners } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { logActivity } from "./activity"
import { z } from "zod"
import { deleteImageFromStorage, deleteOldImageIfChanged, getStorageBucketPath } from "@/lib/supabase-storage-utils"

const bannerSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  subtitle: z.string().nullable().optional(),
  cta: z.string().nullable().optional(),
  image: z.string().url("الصورة مطلوبة"),
  isActive: z.boolean().default(true),
  order: z.number().min(0, "الترتيب يجب أن يكون رقماً موجباً"),
})

type BannerData = z.infer<typeof bannerSchema>

export async function createBanner(data: BannerData) {
  const parsed = bannerSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("Failed to create banner due to validation errors.")
  }

  try {
    await db.insert(banners).values(parsed.data)
  } catch (error) {
    console.error("Error creating banner:", error)
    throw new Error("Failed to create banner.")
  }

  await logActivity("CREATE", "BANNER", null, `Created banner: ${parsed.data.title}`)
  revalidatePath("/dashboard/banners")
}

export async function updateBanner(id: number, data: BannerData) {
  const parsed = bannerSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("Failed to update banner due to validation errors.")
  }

  try {
    const existingBanner = await db.query.banners.findFirst({
      where: eq(banners.id, id)
    })

    if (existingBanner) {
      await deleteOldImageIfChanged(
        existingBanner.image,
        parsed.data.image,
        getStorageBucketPath('banner')
      )
    }

    await db.update(banners).set(parsed.data).where(eq(banners.id, id))
  } catch (error) {
    console.error("Error updating banner:", error)
    throw new Error("Failed to update banner.")
  }

  await logActivity("UPDATE", "BANNER", id.toString(), `Updated banner: ${parsed.data.title}`)
  revalidatePath("/dashboard/banners")
}

export async function deleteBanner(id: number) {
  try {
    const banner = await db.query.banners.findFirst({
      where: eq(banners.id, id)
    })

    if (banner?.image) {
      await deleteImageFromStorage(banner.image, getStorageBucketPath('banner'))
    }

    await db.delete(banners).where(eq(banners.id, id))
  } catch (error) {
    console.error("Error deleting banner:", error)
    throw new Error("Failed to delete banner.")
  }

  await logActivity("DELETE", "BANNER", id.toString(), `Deleted banner with id: ${id}`)
  revalidatePath("/dashboard/banners")
}
