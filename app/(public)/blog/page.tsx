import { BlogCard } from "@/components/blog-card"
import { db } from "@/lib/db"
import { blogPosts, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function PublicBlogPage() {
  const posts = await db.query.blogPosts.findMany({
    where: eq(blogPosts.published, true),
    with: {
      author: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: (blogPosts, { desc }) => [desc(blogPosts.publishedAt || blogPosts.createdAt)],
  })

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">مدونة الثقة</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          اكتشف أحدث المقالات والنصائح حول الأثاث والتصميم الداخلي
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              coverImage={post.coverImage}
              publishedAt={post.publishedAt}
              authorName={post.author?.name}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-500 text-lg">لا توجد منشورات مدونة متاحة حالياً.</p>
          </div>
        )}
      </div>
    </main>
  )
}
