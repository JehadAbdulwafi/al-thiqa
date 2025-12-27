import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getProductById, getRelatedProducts } from "@/lib/queries"
import { notFound } from "next/navigation"

type ProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = product.collectionId
    ? await getRelatedProducts(product.collectionId, product.id)
    : []

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <AnnouncementBar />
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <Link href="/collections" className="hover:text-primary transition-colors">
            المجموعات
          </Link>
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <Link
            href={`/collections/${product.collection?.slug || ""}`}
            className="hover:text-primary transition-colors"
          >
            {product.collection?.name || "غير مصنف"}
          </Link>
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Details */}
        <ProductDetails product={product} />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  )
}
