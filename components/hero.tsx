import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23a0826d' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 mb-6 text-balance">
          رفاهية العيش تبدأ من اختيار أثاثك
        </h1>
        <p className="text-lg md:text-xl text-stone-700 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
          اكتشف مجموعتنا الفريدة من الأثاث العصري المصمم بعناية لتحويل منزلك إلى واحة من الراحة والأناقة
        </p>
        <Button size="lg" className="h-12 px-8 text-base">
          استعرض مجموعتنا
          <ArrowLeft className="mr-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
