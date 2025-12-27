import { db } from "@/lib/db"
import { blogPosts, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { format } from "date-fns"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, params.slug),
    with: {
      author: {
        columns: {
          name: true,
        },
      },
    },
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-6">
        بواسطة {post.author?.name || "غير معروف"} في{" "}
        {format(post.publishedAt || post.createdAt, "PPP")}
      </p>

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-auto rounded-lg mb-8" />
      )}

      <div className="prose prose-lg max-w-none">
        <p>{post.content}</p>
        {/* You might want to render markdown here if content is markdown */}
      </div>
    </div>
  )
}
