"use server"

import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { slugify } from "@/lib/utils"
import { getSession } from "@/lib/auth"

// Schema for validating blog post creation/update
const blogPostSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().optional(), // Auto-generated from title if not provided
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1, "المحتوى مطلوب"),
  coverImage: z.string().nullable().optional(),
  published: z.boolean().default(false),
  publishedAt: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date().optional().nullable()),
})

type BlogPostData = z.infer<typeof blogPostSchema>

// Action to create a new blog post
export async function createBlogPost(data: BlogPostData) {
  const parsed = blogPostSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("فشل إنشاء منشور المدونة بسبب أخطاء التحقق.")
  }

  let blogData = parsed.data
  if (!blogData.slug) {
    blogData.slug = slugify(blogData.title)
  }

  const session = await getSession()
  if (!session) {
    throw new Error("يجب تسجيل الدخول لإنشاء منشور مدونة.")
  }
  blogData.authorId = parseInt(session.user.id)

  try {
    await db.insert(blogPosts).values(blogData)
  } catch (error) {
    console.error("خطأ في إنشاء منشور المدونة:", error)
    throw new Error("فشل إنشاء منشور المدونة.")
  }

  revalidatePath("/dashboard/blog")
  redirect("/dashboard/blog")
}

// Action to update an existing blog post
export async function updateBlogPost(id: number, data: BlogPostData) {
  const parsed = blogPostSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("فشل تحديث منشور المدونة بسبب أخطاء التحقق.")
  }

  let blogData = parsed.data
  if (!blogData.slug) {
    blogData.slug = slugify(blogData.title)
  }

  const session = await getSession()
  if (!session) {
    throw new Error("يجب تسجيل الدخول لتحديث منشور مدونة.")
  }
  blogData.authorId = parseInt(session.user.id)

  try {
    await db.update(blogPosts).set(blogData).where(eq(blogPosts.id, id))
  } catch (error) {
    console.error("خطأ في تحديث منشور المدونة:", error)
    throw new Error("فشل تحديث منشور المدونة.")
  }

  revalidatePath("/dashboard/blog")
  revalidatePath(`/blog/${blogData.slug}`)
  redirect("/dashboard/blog")
}

// Action to delete a blog post
export async function deleteBlogPost(id: number) {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id))
  } catch (error) {
    console.error("خطأ في حذف منشور المدونة:", error)
    throw new Error("فشل حذف منشور المدونة.")
  }

  revalidatePath("/dashboard/blog")
}
