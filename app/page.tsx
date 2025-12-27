import { Navbar } from "@/components/navbar"
import { AnnouncementBar } from "@/components/announcement-bar"
import { getBestSellers, getBlogPosts, getFeaturedProducts } from "@/lib/queries"
import { getSession } from "@/lib/auth"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const bestSellers = await getBestSellers()
  const blogPosts = await getBlogPosts()
  const session = await getSession()
  const isLoggedIn = !!session?.user


  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <AnnouncementBar />
      <Navbar isLoggedIn={isLoggedIn} />
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
