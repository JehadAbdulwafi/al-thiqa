import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoriesSection } from "@/components/categories-section"
import { BestSellers } from "@/components/best-sellers"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { AnnouncementBar } from "@/components/announcement-bar"

export default function Home() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroCarousel />
        <FeaturedProducts />
        <CategoriesSection />
        <BestSellers />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}
