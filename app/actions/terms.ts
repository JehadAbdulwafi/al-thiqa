"use server"

import { db } from "@/lib/db"
import { termsOfService } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

const termsOfServiceSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  content: z.string().min(1, "المحتوى مطلوب"),
  effectiveDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date()),
})

type TermsOfServiceData = z.infer<typeof termsOfServiceSchema>

export async function updateTermsOfServiceAction(data: TermsOfServiceData) {
  const parsed = termsOfServiceSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("فشل تحديث شروط الخدمة بسبب أخطاء التحقق.")
  }

  try {
    const existing = await db.query.termsOfService.findFirst()

    if (existing) {
      await db
        .update(termsOfService)
        .set({
          title: parsed.data.title,
          content: parsed.data.content,
          effectiveDate: parsed.data.effectiveDate,
          updatedAt: new Date(),
        })
        .where(eq(termsOfService.id, existing.id))
    } else {
      await db.insert(termsOfService).values(parsed.data)
    }
  } catch (error) {
    console.error("خطأ في تحديث شروط الخدمة:", error)
    throw new Error("فشل تحديث شروط الخدمة.")
  }

  revalidatePath("/terms")
  revalidatePath("/dashboard/terms")
  redirect("/dashboard/terms")
}
