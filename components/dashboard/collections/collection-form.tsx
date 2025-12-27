"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createCollection, updateCollection } from "@/app/actions/collections"
import { Loader2 } from "lucide-react"

interface CollectionFormProps {
  collection?: {
    id: number
    name: string
    slug: string
    description: string | null
    image: string | null
    featured: boolean
    order: number | null
  }
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    featured: false,
    order: 0,
  })

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || "",
        slug: collection.slug || "",
        description: collection.description || "",
        image: collection.image || "",
        featured: collection.featured || false,
        order: collection.order || 0,
      })
    }
  }, [collection])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const dataToSend = {
      ...formData,
      order: Number(formData.order) || undefined,
    }

    try {
      if (collection) {
        await updateCollection(collection.id, dataToSend)
      } else {
        await createCollection(dataToSend)
      }
      router.push("/dashboard/collections")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "فشل حفظ المجموعة")
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
      
      <div className="space-y-2">
        <Label htmlFor="image">صورة (URL)</Label>
        <Input id="image" name="image" value={formData.image} onChange={handleInputChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">الترتيب</Label>
        <Input id="order" name="order" type="number" value={formData.order} onChange={handleInputChange} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="featured" name="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData(prev => ({...prev, featured: Boolean(checked)}))} />
        <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          مجموعة مميزة (عرض هذه المجموعة في الأماكن البارزة)
        </Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {collection ? "تحديث المجموعة" : "إنشاء المجموعة"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          إلغاء
        </Button>
      </div>
    </form>
  )
}
