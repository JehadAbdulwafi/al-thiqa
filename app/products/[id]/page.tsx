import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock product data - will be dynamic in the future
const productData: Record<string, any> = {
  "1": {
    id: "1",
    name: "أريكة مودرن بيج",
    price: 4500,
    originalPrice: 5200,
    description:
      "أريكة عصرية فاخرة مصنوعة من القماش الفاخر عالي الجودة. تصميم مريح وأنيق يناسب أي ديكور عصري. مثالية لغرف المعيشة الواسعة.",
    features: [
      "قماش عالي الجودة مقاوم للبقع",
      "إطار خشبي صلب متين",
      "وسائد مريحة قابلة للإزالة",
      "أرجل خشبية قوية",
      "ضمان 5 سنوات",
    ],
    specs: {
      الأبعاد: "220 × 90 × 85 سم",
      المادة: "قماش وخشب",
      اللون: "بيج",
      الوزن: "45 كجم",
      "عدد المقاعد": "3 أشخاص",
    },
    images: [
      "/modern-luxury-sofa-beige-fabric.jpg",
      "/beige-sofa-side-view.jpg",
      "/beige-sofa-detail-view.jpg",
      "/beige-sofa-back-view.jpg",
    ],
    rating: 4.8,
    reviews: 124,
    stock: 15,
    category: "غرف المعيشة",
    badge: "خصم 13%",
  },
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = productData[params.id] || productData["1"]

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
          <Link href="/collections/living-room" className="hover:text-primary transition-colors">
            {product.category}
          </Link>
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Details */}
        <ProductDetails product={product} />

        {/* Related Products */}
        <RelatedProducts currentProductId={params.id} category={product.category} />
      </main>

      <Footer />
    </div>
  )
}
