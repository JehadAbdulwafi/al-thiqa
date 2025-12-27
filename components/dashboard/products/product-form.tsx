"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from "@/app/actions/products"
import { Loader2 } from "lucide-react"

// Same as in the user-form, using a simpler state management
interface ProductFormProps {
  product?: {
    id: number
    name: string
    slug: string
    description: string | null
    price: string | null
    compareAtPrice: string | null
    stock: number
    collectionId: number | null
    material: string | null
    color: string | null
    dimensions: any | null
    weight: string | null
    featured: boolean
    images: { url: string }[]
  }
  collections: { id: number; name: string; slug: string }[]
}

export function ProductForm({ product, collections }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "0",
    compareAtPrice: "",
    stock: 0,
    collectionId: undefined as number | undefined,
    material: "",
    color: "",
    dimensions: "",
    weight: "",
    featured: false,
    imageUrls: ["", "", ""],
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price ? parseFloat(product.price).toString() : "0",
        compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice).toString() : "",
        stock: product.stock || 0,
        collectionId: product.collectionId ?? undefined,
        material: product.material || "",
        color: product.color || "",
        dimensions: product.dimensions ? JSON.stringify(product.dimensions, null, 2) : "",
        weight: product.weight ? parseFloat(product.weight).toString() : "",
        featured: product.featured || false,
        imageUrls: product.images.length > 0 ? product.images.map(img => img.url) : ["", "", ""],
      })
    }
  }, [product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, collectionId: parseInt(value, 10) }))
  }

  const handleImageUrlsChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls]
    newImageUrls[index] = value
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }))
  }

  const addImageUrl = () => {
    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const dataToSend = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
      stock: Number(formData.stock) || 0,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      imageUrls: formData.imageUrls.filter(url => url), // Filter out empty strings
    }

    try {
      if (product) {
        await updateProduct(product.id, dataToSend)
      } else {
        await createProduct(dataToSend)
      }
      router.push("/dashboard/products")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "فشل حفظ المنتج")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">الاسم</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">الرابط اللطيف (Slug)</Label>
        <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر</Label>
          <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">السعر قبل الخصم (اختياري)</Label>
          <Input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" value={formData.compareAtPrice} onChange={handleInputChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">المخزون</Label>
        <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="collectionId">التصنيف</Label>
        <Select name="collectionId" value={formData.collectionId?.toString()} onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="اختر تصنيفاً" />
          </SelectTrigger>
          <SelectContent>
            {collections.map(col => (
              <SelectItem key={col.id} value={col.id.toString()}>
                {col.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material">المادة</Label>
          <Input id="material" name="material" value={formData.material} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">اللون</Label>
          <Input id="color" name="color" value={formData.color} onChange={handleInputChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dimensions">الأبعاد (JSON)</Label>
          <Textarea id="dimensions" name="dimensions" value={formData.dimensions} onChange={handleInputChange} placeholder={`مثال: { "width": 120, "height": 80, "depth": 70, "unit": "cm" }`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">الوزن (كجم)</Label>
          <Input id="weight" name="weight" type="number" step="0.01" value={formData.weight} onChange={handleInputChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>صور المنتج (URL)</Label>
        {formData.imageUrls.map((url, index) => (
          <Input
            key={index}
            name={`imageUrl-${index}`}
            value={url}
            onChange={(e) => handleImageUrlsChange(index, e.target.value)}
            placeholder="رابط URL للصورة"
            className="mt-2"
          />
        ))}
        <Button type="button" variant="outline" className="mt-2" onClick={addImageUrl}>
          أضف المزيد من الصور
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="featured" name="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData(prev => ({...prev, featured: Boolean(checked)}))} />
        <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          منتج مميز (عرض هذا المنتج في الأماكن البارزة)
        </Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "تحديث المنتج" : "إنشاء المنتج"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          إلغاء
        </Button>
      </div>
    </form>
  )
}
