import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { blogPosts } from "@/lib/db/schema"
import { BlogForm } from "@/components/dashboard/blog/blog-form"
import { notFound } from "next/navigation"

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const { id } = await params
  if (!id) {
    notFound()
  }

  const blogPost = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, parseInt(id)),
  })

  if (!blogPost) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">تعديل منشور المدونة</h2>
      <BlogForm blogPost={blogPost} />
    </div>
  )
}
