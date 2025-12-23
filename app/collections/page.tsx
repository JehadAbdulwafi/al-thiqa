import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CollectionCard } from "@/components/collection-card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CollectionsPage() {
  const collections = [
    {
      id: "living-room",
      title: "غرف المعيشة",
      description: "أثاث عصري وأنيق لغرف المعيشة",
      image: "/modern-living-room.avif",
      itemCount: 45,
    },
    {
      id: "bedroom",
      title: "غرف النوم",
      description: "راحة وأناقة لغرف النوم",
      image: "/luxury-bedroom-furniture.avif",
      itemCount: 38,
    },
    {
      id: "dining-room",
      title: "غرف الطعام",
      description: "طاولات وكراسي طعام فاخرة",
      image: "/elegant-dining-room-furniture.avif",
      itemCount: 32,
    },
    {
      id: "office",
      title: "المكاتب",
      description: "أثاث مكتبي مريح وعملي",
      image: "/modern-office-furniture.avif",
      itemCount: 28,
    },
    {
      id: "outdoor",
      title: "الأثاث الخارجي",
      description: "أثاث خارجي مقاوم للعوامل الجوية",
      image: "/outdoor-patio-furniture.avif",
      itemCount: 24,
    },
    {
      id: "kids",
      title: "غرف الأطفال",
      description: "أثاث آمن وملون للأطفال",
      image: "/colorful-kids-room-furniture.avif",
      itemCount: 19,
    },
  ]

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <AnnouncementBar />
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span className="text-gray-900 font-medium">المجموعات</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">تسوق حسب المجموعة</h1>
          <p className="text-lg text-gray-600 max-w-2xl text-pretty">
            استكشف مجموعاتنا المتنوعة من الأثاث المصمم بعناية لكل غرفة في منزلك
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
