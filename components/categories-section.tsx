import { Sofa, Bed, Laptop, Table, Armchair, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "غرف المعيشة",
    icon: Sofa,
    count: "150+ منتج",
    color: "bg-blue-50 text-blue-600",
    href: "/collections/living-room",
  },
  {
    id: 2,
    name: "غرف النوم",
    icon: Bed,
    count: "200+ منتج",
    color: "bg-purple-50 text-purple-600",
    href: "/collections/bedroom",
  },
  {
    id: 3,
    name: "المكاتب",
    icon: Laptop,
    count: "80+ منتج",
    color: "bg-green-50 text-green-600",
    href: "/collections/office",
  },
  {
    id: 4,
    name: "الطاولات",
    icon: Table,
    count: "120+ منتج",
    color: "bg-orange-50 text-orange-600",
    href: "/collections/dining-room",
  },
  {
    id: 5,
    name: "الكراسي",
    icon: Armchair,
    count: "90+ منتج",
    color: "bg-pink-50 text-pink-600",
    href: "/collections/living-room",
  },
  {
    id: 6,
    name: "المكتبات",
    icon: BookOpen,
    count: "60+ منتج",
    color: "bg-indigo-50 text-indigo-600",
    href: "/collections/office",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">تسوق حسب الفئة</h2>
          <p className="text-gray-600 text-lg">اختر من مجموعتنا الواسعة من الفئات</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={category.href}>
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-4 p-6 hover:shadow-lg transition-all border-gray-200 hover:border-[#8B7355] bg-white w-full"
                >
                  <div className={`${category.color} rounded-2xl p-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.count}</p>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
