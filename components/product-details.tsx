"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Star, Minus, Plus, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    description: string
    features: string[]
    specs: Record<string, string>
    images: string[]
    rating: number
    reviews: number
    stock: number
    badge?: string
  }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                {product.badge}
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">{product.name}</h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} تقييم)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-4xl font-bold text-gray-900">
                {product.price.toLocaleString("ar-SA")} <span className="text-lg font-normal text-gray-600">د.ل</span>
              </div>
              {product.originalPrice && (
                <>
                  <div className="text-xl text-gray-400 line-through">
                    {product.originalPrice.toLocaleString("ar-SA")} د.ل
                  </div>
                  <div className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">وفر {discount}%</div>
                </>
              )}
            </div>

            {/* Stock Status */}
            <p className="text-sm text-green-600 font-medium mb-6">متوفر في المخزون ({product.stock} قطعة)</p>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">الكمية:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-r-none"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-6 font-semibold text-lg">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="h-10 w-10 rounded-l-none"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button size="lg" className="flex-1 bg-[#8B7355] hover:bg-[#6F5B44] text-white h-14 text-lg">
              <ShoppingCart className="w-5 h-5 ml-2" />
              أضف إلى السلة
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`h-14 w-14 ${isFavorite ? "text-red-500 border-red-500" : ""}`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button size="lg" variant="outline" className="h-14 w-14 bg-transparent">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium text-gray-900">توصيل مجاني</p>
              <p className="text-xs text-gray-500">للطلبات +500 د.ل</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium text-gray-900">ضمان 5 سنوات</p>
              <p className="text-xs text-gray-500">على جميع المنتجات</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium text-gray-900">إرجاع سهل</p>
              <p className="text-xs text-gray-500">خلال 30 يوم</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Tabs */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="features"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            المميزات
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            المواصفات
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            التقييمات ({product.reviews})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="py-8">
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="specs" className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{key}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="py-8">
          <p className="text-gray-600">قريباً: سيتم عرض تقييمات العملاء هنا</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
