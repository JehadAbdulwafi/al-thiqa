import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoriesSection } from "@/components/categories-section"
import { BestSellers } from "@/components/best-sellers"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { AnnouncementBar } from "@/components/announcement-bar"
import { getBestSellers, getBlogPosts, getFeaturedProducts } from "@/lib/queries"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const bestSellers = await getBestSellers()
  const blogPosts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroCarousel />
        <FeaturedProducts products={featuredProducts} />
        <CategoriesSection />
        <BestSellers products={bestSellers} />
        <BlogSection posts={blogPosts} />
      </main>
      <Footer />
    </div>
  )
}
