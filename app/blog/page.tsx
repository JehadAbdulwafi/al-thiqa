import Link from "next/link"
import { db } from "@/lib/db"
import { blogPosts, users } from "@/lib/db/schema"
import { format } from "date-fns"
import { eq, and } from "drizzle-orm"

export default async function PublicBlogPage() {
  const posts = await db.query.blogPosts.findMany({
    where: and(eq(blogPosts.published, true)),
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">مدونة Al-Thiqa</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.coverImage && (
                <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  بواسطة {post.author?.name || "غير معروف"} في{" "}
                  {format(post.publishedAt || post.createdAt, "PPP")}
                </p>
                <p className="text-gray-700 mb-4">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
                <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                  اقرأ المزيد &rarr;
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">لا توجد منشورات مدونة متاحة حالياً.</p>
        )}
      </div>
    </div>
  )
}
