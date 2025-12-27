import { CollectionFilters } from "@/components/collection-filters"
import { ProductGrid } from "@/components/product-grid"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCollectionBySlug, getProductsByCollection } from "@/lib/queries"
import { notFound } from "next/navigation"

type CollectionPageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    sortBy?: string
    minPrice?: string
    maxPrice?: string
    categories?: string
    colors?: string
    materials?: string
  }>
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const collection = await getCollectionBySlug(resolvedParams.slug)

  const minPrice = resolvedSearchParams.minPrice ? parseInt(resolvedSearchParams.minPrice, 10) : undefined
  const maxPrice = resolvedSearchParams.maxPrice ? parseInt(resolvedSearchParams.maxPrice, 10) : undefined
  const categories = resolvedSearchParams.categories?.split(',')
  const colors = resolvedSearchParams.colors?.split(',')
  const materials = resolvedSearchParams.materials?.split(',')

  const products = await getProductsByCollection(resolvedParams.slug, {
    sortBy: resolvedSearchParams?.sortBy,
    minPrice,
    maxPrice,
    categories,
    colors,
    materials,
  })

  if (!collection) {
    notFound()
  }

  return (
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
        <span className="text-gray-900 font-medium">{collection.name}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{collection.name}</h1>
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
          <ProductGrid products={products} />
        </div>
      </div>
    </main>
  )
}
