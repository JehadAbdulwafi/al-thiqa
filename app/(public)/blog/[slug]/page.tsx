import { db } from "@/lib/db"
import { blogPosts, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, slug),
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
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" />
        العودة إلى المدونة
      </Link>

      <article className="space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              بواسطة {post.author?.name || "غير معروف"}
            </span>
            <span>•</span>
            <span>
              {format(post.publishedAt || post.createdAt, "PPP")}
            </span>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg prose-stone max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-a:text-[#8B7355] prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  )
}
