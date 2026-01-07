"use client"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"

export function HeroCarousel({ banners }) {
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
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden rounded-2xl bg-gray-100">
                <div className="relative w-full h-full">
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                    <img
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl text-white">
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
                        {banner.title}
                      </h1>
                      {banner.subtitle && <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-100">{banner.subtitle}</p>}
                      <Button
                        size="lg"
                        asChild
                        className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-7 text-lg font-semibold h-auto"
                      >
                        <Link href="/products">{banner.cta || "تسوق الآن"}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

