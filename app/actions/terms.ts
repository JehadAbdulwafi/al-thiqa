"use server"

import { db } from "@/lib/db"
import { termsOfService } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { logActivity } from "./activity"

const termsOfServiceSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  content: z.string().min(1, "المحتوى مطلوب"),
  effectiveDate: z.date().optional(),
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

    const effectiveDate = parsed.data.effectiveDate || new Date()

    if (existing) {
      await db
        .update(termsOfService)
        .set({
          title: parsed.data.title,
          content: parsed.data.content,
          effectiveDate: effectiveDate,
          updatedAt: new Date(),
        })
        .where(eq(termsOfService.id, existing.id))
      await logActivity("UPDATE", "TERMS_OF_SERVICE", existing.id.toString(), `Updated terms of service`)
    } else {
      const [newTerms] = await db.insert(termsOfService).values({
        title: parsed.data.title,
        content: parsed.data.content,
        effectiveDate: effectiveDate,
      }).returning()
      await logActivity("CREATE", "TERMS_OF_SERVICE", newTerms.id.toString(), `Created terms of service`)
    }
  } catch (error) {
    console.error("خطأ في تحديث شروط الخدمة:", error)
    throw new Error("فشل تحديث شروط الخدمة.")
  }

  revalidatePath("/terms")
  revalidatePath("/dashboard/terms")
  redirect("/dashboard/terms")
}
