"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: string
  image: string
  category: string
  badge?: string
  oldPrice?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-100 rounded-lg cursor-pointer">
          <img
            src={product.image || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
              {product.badge}
            </div>
          )}

          {/* Quick Actions on Hover */}
          <div
            className={`absolute top-4 left-4 transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
          >
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg bg-white hover:bg-gray-100 h-10 w-10"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Add to Cart Button on Hover */}
          <div
            className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Button
              className="w-full bg-[#8B7355] hover:bg-[#6F5B44] text-white font-semibold shadow-lg"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              أضف إلى السلة
            </Button>
          </div>
        </div>
      </Link>

      <div className="pt-4">
        <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">{product.category}</div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2 leading-snug hover:text-[#8B7355] transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-gray-900">
            {product.price} <span className="text-sm font-normal text-gray-600">د.ل</span>
          </div>
          {product.oldPrice && <div className="text-sm text-gray-400 line-through">{product.oldPrice} د.ل</div>}
        </div>
      </div>
    </div>
  )
}
