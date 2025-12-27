import { db } from "@/lib/db"
import { blogPosts, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { BlogPostsTable } from "@/components/dashboard/blog/blog-posts-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function BlogPage() {
  const allBlogPosts = await db.query.blogPosts.findMany({
    with: {
      author: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: (blogPosts, { desc }) => [desc(blogPosts.createdAt)],
  })

  // Format blog posts for the table
  const formattedBlogPosts = allBlogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    authorName: post.author?.name || "غير معروف",
    published: post.published,
    createdAt: post.createdAt,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">منشورات المدونة</h2>
        <Button asChild>
          <Link href="/dashboard/blog/new">إنشاء منشور جديد</Link>
        </Button>
      </div>
      <BlogPostsTable blogPosts={formattedBlogPosts} />
    </div>
  )
}
