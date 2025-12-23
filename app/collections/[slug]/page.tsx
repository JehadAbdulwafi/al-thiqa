import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CollectionFilters } from "@/components/collection-filters"
import { ProductGrid } from "@/components/product-grid"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data - will be dynamic in the future
const collectionData: Record<string, any> = {
  "living-room": {
    title: "غرف المعيشة",
    description: "أثاث عصري وأنيق لغرف المعيشة",
    itemCount: 45,
  },
  bedroom: {
    title: "غرف النوم",
    description: "راحة وأناقة لغرف النوم",
    itemCount: 38,
  },
  "dining-room": {
    title: "غرف الطعام",
    description: "طاولات وكراسي طعام فاخرة",
    itemCount: 32,
  },
  office: {
    title: "المكاتب",
    description: "أثاث مكتبي مريح وعملي",
    itemCount: 28,
  },
  outdoor: {
    title: "الأثاث الخارجي",
    description: "أثاث خارجي مقاوم للعوامل الجوية",
    itemCount: 24,
  },
  kids: {
    title: "غرف الأطفال",
    description: "أثاث آمن وملون للأطفال",
    itemCount: 19,
  },
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = collectionData[params.slug] || collectionData["living-room"]

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <AnnouncementBar />
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <Link href="/collections" className="hover:text-primary transition-colors">
            المجموعات
          </Link>
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span className="text-gray-900 font-medium">{collection.title}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{collection.title}</h1>
          <p className="text-gray-600">{collection.description}</p>
        </div>

        {/* Main Content: Filters + Products */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <CollectionFilters />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid collectionSlug={params.slug} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
