import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type Product = {
  id: number
  name: string
  price: string
  images: { url: string }[]
  compareAtPrice?: string | null
}

interface BestSellersProps {
  products: Product[]
}

export function BestSellers({ products }: BestSellersProps) {
  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">الأكثر مبيعاً</h2>
            <Button
              variant="link"
              className="text-[#8B7355] hover:text-[#6F5B44] hidden md:flex items-center gap-2 text-base"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-600 text-lg">القطع المفضلة لدى عملائنا</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Button
            variant="outline"
            className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white px-8 bg-transparent"
          >
            عرض جميع المنتجات
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
