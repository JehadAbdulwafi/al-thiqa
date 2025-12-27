import { CollectionCard } from "@/components/collection-card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAllCollections } from "@/lib/queries"

export default async function CollectionsPage() {
  const collections = await getAllCollections()

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">
          الرئيسية
        </Link>
        <ArrowLeft className="w-4 h-4 rotate-180" />
        <span className="text-gray-900 font-medium">المجموعات</span>
      </nav>

      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">تسوق حسب المجموعة</h1>
        <p className="text-lg text-gray-600 max-w-2xl text-pretty">
          استكشف مجموعاتنا المتنوعة من الأثاث المصمم بعناية لكل غرفة في منزلك
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </main>
  )
}
