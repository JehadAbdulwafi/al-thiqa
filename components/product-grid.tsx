"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"

interface ProductGridProps {
  collectionSlug: string
}

// Mock product data
const products = [
  {
    id: "1",
    name: "أريكة مودرن بيج",
    price: 4500,
    originalPrice: 5200,
    image: "/modern-luxury-sofa-beige-fabric.jpg",
    badge: "خصم 13%",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "طاولة قهوة رخام",
    price: 2800,
    image: "/marble-coffee-table.png",
    rating: 4.9,
    reviews: 87,
  },
  {
    id: "3",
    name: "كرسي طعام مخمل",
    price: 850,
    originalPrice: 1100,
    image: "/velvet-dining-chair.jpg",
    badge: "خصم 23%",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "4",
    name: "مكتب عصري",
    price: 3200,
    image: "/modern-office-desk.png",
    rating: 4.6,
    reviews: 93,
  },
  {
    id: "5",
    name: "طاولة جانبية ذهبية",
    price: 1200,
    image: "/gold-side-table.jpg",
    badge: "جديد",
    rating: 4.8,
    reviews: 64,
  },
  {
    id: "6",
    name: "خزانة ملابس خشبية",
    price: 5800,
    image: "/wooden-wardrobe-closet.jpg",
    rating: 4.9,
    reviews: 112,
  },
  {
    id: "7",
    name: "كرسي استرخاء جلد",
    price: 3900,
    originalPrice: 4500,
    image: "/leather-recliner-chair.jpg",
    badge: "خصم 13%",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "8",
    name: "رف كتب معدني",
    price: 1800,
    image: "/metal-bookshelf-industrial.jpg",
    rating: 4.5,
    reviews: 73,
  },
  {
    id: "9",
    name: "كنبة زاوية رمادية",
    price: 7200,
    image: "/gray-corner-sectional-sofa.jpg",
    badge: "الأكثر مبيعاً",
    rating: 4.9,
    reviews: 203,
  },
]

export function ProductGrid({ collectionSlug }: ProductGridProps) {
  const [sortBy, setSortBy] = useState("featured")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{products.length}</span> منتج
        </p>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
            <SlidersHorizontal className="w-4 h-4 ml-2" />
            فلاتر
          </Button>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">مميز</SelectItem>
              <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
              <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="rating">الأعلى تقييماً</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
