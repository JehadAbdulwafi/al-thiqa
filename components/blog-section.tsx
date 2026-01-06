import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/blog-card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

type Post = {
  id: number
  title: string
  excerpt: string | null
  publishedAt: Date | null
  coverImage: string | null
}

interface BlogSectionProps {
  posts: Post[]
}

export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">مدونة الأثاث</h2>
            <p className="text-gray-600 text-lg">نصائح وأفكار لتجعل منزلك أجمل</p>
          </div>
          <Link href="/blog">
            <Button
              variant="link"
              className="text-[#8B7355] hover:text-[#6F5B44] hidden md:flex items-center gap-2 text-base"
            >
              عرض جميع المقالات
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              slug={post.title.toLowerCase().replace(/\s+/g, '-')}
              title={post.title}
              excerpt={post.excerpt}
              coverImage={post.coverImage}
              publishedAt={post.publishedAt}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/blog">
            <Button
              variant="outline"
              className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white px-8 bg-transparent"
            >
              عرض جميع المقالات
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
