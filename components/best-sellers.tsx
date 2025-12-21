import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const bestSellers = [
  {
    id: 5,
    name: "كرسي استرخاء جلد",
    price: "5,500",
    image: "/modern-leather-lounge-chair-brown.jpg",
    category: "غرف المعيشة",
  },
  {
    id: 6,
    name: "رف كتب معاصر",
    price: "3,800",
    image: "/modern-wooden-bookshelf-minimalist.jpg",
    category: "المكاتب",
  },
  {
    id: 7,
    name: "طاولة قهوة رخامية",
    price: "4,200",
    oldPrice: "5,500",
    image: "/marble-coffee-table.png",
    category: "غرف المعيشة",
    badge: "خصم",
  },
  {
    id: 8,
    name: "مكتب عمل حديث",
    price: "6,800",
    image: "/modern-office-desk.png",
    category: "المكاتب",
  },
  {
    id: 9,
    name: "كرسي طعام مخملي",
    price: "2,100",
    image: "/velvet-dining-chair.jpg",
    category: "غرف الطعام",
  },
  {
    id: 10,
    name: "طاولة جانبية ذهبية",
    price: "1,900",
    image: "/gold-side-table.jpg",
    category: "غرف المعيشة",
    badge: "جديد",
  },
]

export function BestSellers() {
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
          {bestSellers.map((product) => (
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
