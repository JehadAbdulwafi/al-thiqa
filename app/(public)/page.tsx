import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoriesSection } from "@/components/categories-section"
import { BestSellers } from "@/components/best-sellers"
import { BlogSection } from "@/components/blog-section"
import { getBestSellers, getBlogPosts, getFeaturedProducts } from "@/lib/queries"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const bestSellers = await getBestSellers()
  const blogPosts = await getBlogPosts()

  return (
    <>
      <HeroCarousel />
      <FeaturedProducts products={featuredProducts} />
      <CategoriesSection />
      <BestSellers products={bestSellers} />
      <BlogSection posts={blogPosts} />
    </>
  )
}
