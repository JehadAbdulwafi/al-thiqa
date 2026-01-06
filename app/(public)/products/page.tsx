import { CollectionFilters } from "@/components/collection-filters"
import { ProductGrid } from "@/components/product-grid"
import { getAllProductsWithFilters } from "@/lib/queries"

type ProductsPageProps = {
  searchParams: Promise<{
    sortBy?: string
    minPrice?: string
    maxPrice?: string
    colors?: string
    materials?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams

  const minPrice = resolvedSearchParams.minPrice ? parseInt(resolvedSearchParams.minPrice, 10) : undefined
  const maxPrice = resolvedSearchParams.maxPrice ? parseInt(resolvedSearchParams.maxPrice, 10) : undefined
  const colors = resolvedSearchParams.colors?.split(',')
  const materials = resolvedSearchParams.materials?.split(',')

  const products = await getAllProductsWithFilters({
    sortBy: resolvedSearchParams?.sortBy,
    minPrice,
    maxPrice,
    colors,
    materials,
  })

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <a href="/" className="hover:text-primary transition-colors">
          الرئيسية
        </a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">جميع المنتجات</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">جميع المنتجات</h1>
        <p className="text-gray-600">استكشف مجموعتنا الكاملة من الأثاث المصمم بعناية</p>
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
