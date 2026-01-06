"use server"

import { db } from "@/lib/db"
import { privacyPolicy } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

const privacyPolicySchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  content: z.string().min(1, "المحتوى مطلوب"),
  effectiveDate: z.date().optional(),
})

type PrivacyPolicyData = z.infer<typeof privacyPolicySchema>

export async function updatePrivacyPolicyAction(data: PrivacyPolicyData) {
  const parsed = privacyPolicySchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("فشل تحديث سياسة الخصوصية بسبب أخطاء التحقق.")
  }

  try {
    const existing = await db.query.privacyPolicy.findFirst()

    const effectiveDate = parsed.data.effectiveDate || new Date()

    if (existing) {
      await db
        .update(privacyPolicy)
        .set({
          title: parsed.data.title,
          content: parsed.data.content,
          effectiveDate: effectiveDate,
          updatedAt: new Date(),
        })
        .where(eq(privacyPolicy.id, existing.id))
    } else {
      await db.insert(privacyPolicy).values({
        title: parsed.data.title,
        content: parsed.data.content,
        effectiveDate: effectiveDate,
      })
    }
  } catch (error) {
    console.error("خطأ في تحديث سياسة الخصوصية:", error)
    throw new Error("فشل تحديث سياسة الخصوصية.")
  }

  revalidatePath("/privacy-policy")
  revalidatePath("/dashboard/privacy")
  redirect("/dashboard/privacy")
}
