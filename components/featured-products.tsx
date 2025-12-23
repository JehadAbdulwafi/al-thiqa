import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const products = [
  {
    id: 1,
    name: "أريكة عصرية فاخرة",
    price: "12,500",
    image: "/modern-luxury-sofa-beige-fabric.avif",
    category: "غرف المعيشة",
    badge: "جديد",
  },
  {
    id: 2,
    name: "طاولة طعام خشبية",
    price: "8,900",
    image: "/elegant-wooden-dining-table-modern.avif",
    category: "غرف الطعام",
  },
  {
    id: 3,
    name: "سرير ملكي مودرن",
    price: "15,000",
    oldPrice: "18,000",
    image: "/modern-luxury-king-bed-upholstered.avif",
    category: "غرف النوم",
    badge: "خصم",
  },
  // {
  //   id: 4,
  //   name: "خزانة ملابس واسعة",
  //   price: "11,200",
  //   image: "/modern-wardrobe-closet-wood-white.jpg",
  //   category: "غرف النوم",
  // },
]

export function FeaturedProducts() {
  return (
    <section id="products" className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">تصفح مفضلاتنا</h2>
            <Button
              variant="link"
              className="text-[#8B7355] hover:text-[#6F5B44] hidden md:flex items-center gap-2 text-base"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-600 text-lg">قطع مختارة بعناية لتناسب ذوقك الرفيع</p>
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
