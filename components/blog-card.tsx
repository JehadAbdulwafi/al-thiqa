import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"

type BlogCardProps = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
  authorName?: string
}

export function BlogCard({ slug, title, excerpt, coverImage, publishedAt, authorName }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {coverImage && (
        <Link href={`/blog/${slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span>
            بواسطة {authorName || "غير معروف"}
          </span>
          <span>•</span>
          <span>
            {format(publishedAt || new Date(), "PPP")}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3 text-gray-900">
          <Link href={`/blog/${slug}`} className="hover:text-[#8B7355] transition-colors line-clamp-2">
            {title}
          </Link>
        </h2>

        {excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}

        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-2 text-[#8B7355] font-medium hover:underline"
        >
          اقرأ المزيد
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </article>
  )
}
