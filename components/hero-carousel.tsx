"use client"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const slides = [
  {
    title: "مجموعة الشتاء الجديدة",
    subtitle: "أثاث فاخر بتصاميم عصرية",
    cta: "تسوق الآن",
    image: "/modern-luxury-living-room-with-elegant-furniture-b.jpg",
  },
  {
    title: "خصم يصل إلى 30%",
    subtitle: "على جميع غرف النوم",
    cta: "اكتشف العروض",
    image: "/modern-office-desk.png",
  },
  {
    title: "أثاث مكتبي احترافي",
    subtitle: "راحة وإنتاجية في مكان عملك",
    cta: "شاهد المزيد",
    image: "/marble-coffee-table.png",
  },
]

export function HeroCarousel() {
  const autoplayPlugin = Autoplay({ delay: 6000, stopOnInteraction: true })

  return (
    <div className="container mx-auto mt-6 xl:mt-5 select-none px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          direction: "rtl",
        }}
        plugins={[autoplayPlugin]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden rounded-2xl bg-gray-100">
                <div className="relative w-full h-full">
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                    <img
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl text-white">
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-100">{slide.subtitle}</p>
                      <Button
                        size="lg"
                        className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-7 text-lg font-semibold h-auto"
                      >
                        {slide.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

