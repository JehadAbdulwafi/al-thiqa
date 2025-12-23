import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowLeft } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "دليلك الشامل لاختيار الأثاث المناسب لغرفة المعيشة",
    excerpt: "تعرف على أفضل الطرق لاختيار الأثاث المثالي الذي يناسب مساحة غرفة المعيشة وأسلوبك الشخصي...",
    date: "15 ديسمبر 2024",
    image: "/modern-luxury-living-room-with-elegant-furniture-b.avif",
    category: "نصائح التصميم",
  },
  {
    id: 2,
    title: "أحدث صيحات الأثاث العصري لعام 2024",
    excerpt: "استكشف أحدث الاتجاهات في عالم الأثاث والتصميم الداخلي التي ستهيمن على المنازل هذا العام...",
    date: "10 ديسمبر 2024",
    image: "/marble-coffee-table.avif",
    category: "اتجاهات",
  },
  {
    id: 3,
    title: "كيف تحافظ على أثاثك الخشبي لسنوات طويلة",
    excerpt: "نصائح عملية للعناية بالأثاث الخشبي والحفاظ على جماله ومتانته لأطول فترة ممكنة...",
    date: "5 ديسمبر 2024",
    image: "/modern-office-desk.avif",
    category: "العناية والصيانة",
  },
]

export function BlogSection() {
  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">مدونة الأثاث</h2>
            <p className="text-gray-600 text-lg">نصائح وأفكار لتجعل منزلك أجمل</p>
          </div>
          <Button
            variant="link"
            className="text-[#8B7355] hover:text-[#6F5B44] hidden md:flex items-center gap-2 text-base"
          >
            عرض جميع المقالات
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden pt-0 border-gray-200 hover:shadow-xl transition-all bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-lg">
                  {post.category}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-[#8B7355] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <Button variant="link" className="text-[#8B7355] hover:text-[#6F5B44] p-0 h-auto font-semibold">
                  اقرأ المزيد
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Button
            variant="outline"
            className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white px-8 bg-transparent"
          >
            عرض جميع المقالات
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
