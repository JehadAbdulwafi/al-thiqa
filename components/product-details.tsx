"use client"

import { useState } from "react"
import Image from "next/image"
import { Truck, Shield, RotateCcw, Package } from "lucide-react"
import { COLORS, MATERIALS } from "@/lib/constants/materials-colors"
import { formatPrice } from "@/lib/utils"

type Product = {
  id: number
  name: string
  description: string | null
  price: string | null
  compareAtPrice: string | null
  material: string | null
  color: string | null
  dimensions: any | null
  weight: string | null
  images: { id: number; productId: number; url: string; altText: string | null; order: number | null; createdAt: Date }[]
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const priceNum = parseFloat(product.price || "0")
  const compareAtPriceNum = parseFloat(product.compareAtPrice || "0")
  const discount =
    compareAtPriceNum > priceNum ? Math.round(((compareAtPriceNum - priceNum) / compareAtPriceNum) * 100) : 0
  const hasDiscount = discount > 0

  const colorInfo = COLORS.find(c => c.id === product.color)
  const materialInfo = MATERIALS.find(m => m.id === product.material)

  const features = []

  if (product.color && colorInfo) {
    features.push({
      label: "اللون",
      value: colorInfo.label,
      icon: (
        <div
          className="w-5 h-5 rounded-full border-2 border-gray-200"
          style={{ backgroundColor: colorInfo.hex }}
        />
      ),
    })
  }

  if (product.material && materialInfo) {
    features.push({
      label: "المادة",
      value: materialInfo.label,
      icon: <Package className="w-5 h-5" />,
    })
  }

  if (product.dimensions?.value) {
    features.push({
      label: "الأبعاد",
      value: product.dimensions.value,
      icon: <Package className="w-5 h-5" />,
    })
  }

  if (product.weight) {
    features.push({
      label: "الوزن",
      value: `${product.weight} كجم`,
      icon: <Package className="w-5 h-5" />,
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]?.url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                خصم {discount}%
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                  }`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.altText || `${product.name} - ${index + 1}`}
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

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-4xl font-bold text-gray-900">
                {formatPrice(product.price)} <span className="text-lg font-normal text-gray-600">د.ل</span>
              </div>
              {hasDiscount && (
                <>
                  <div className="text-xl text-gray-400 line-through">{formatPrice(product.compareAtPrice)} د.ل</div>
                  <div className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">وفر {discount}%</div>
                </>
              )}
            </div>
          </div>

          {/* Product Features */}
          {features.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">مميزات المنتج</h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 text-[#8B7355]">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{feature.label}</p>
                      <p className="text-sm font-medium text-gray-900">{feature.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">الوصف</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-[#8B7355]" />
              <p className="text-xs font-medium text-gray-900">توصيل مجاني</p>
              <p className="text-xs text-gray-500">للطلبات +500 د.ل</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-[#8B7355]" />
              <p className="text-xs font-medium text-gray-900">ضمان 5 سنوات</p>
              <p className="text-xs text-gray-500">على جميع المنتجات</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-[#8B7355]" />
              <p className="text-xs font-medium text-gray-900">إرجاع سهل</p>
              <p className="text-xs text-gray-500">خلال 30 يوم</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
