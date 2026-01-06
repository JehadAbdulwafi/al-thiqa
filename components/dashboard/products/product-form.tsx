"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MATERIALS, COLORS } from "@/lib/constants/materials-colors"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createProduct, updateProduct } from "@/app/actions/products"
import { Loader2 } from "lucide-react"

import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"

const productFormSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  description: z.string().nullable().optional(),
  price: z.number().min(0, "السعر مطلوب"),
  compareAtPrice: z.number().nullable().optional(),
  collectionId: z.number().nullable().optional(),
  material: z.enum(materialEnum.enumValues).nullable().optional(),
  color: z.enum(colorEnum.enumValues).nullable().optional(),
  dimensions: z.string().nullable().optional(),
  weight: z.number().nullable().optional(),
  featured: z.boolean().default(false),
  imageUrls: z.array(z.string().url("يجب أن يكون رابط URL صحيحاً")).optional(),
})

type ProductFormData = z.infer<typeof productFormSchema>

interface ProductFormProps {
  product?: {
    id: number
    name: string
    description: string | null
    price: number | null
    compareAtPrice: number | null
    collectionId: number | null
    material: typeof Material | null
    color: typeof Color | null
    dimensions: any | null
    weight: number | null
    featured: boolean
    imageUrls: string[]
    createdAt: Date
    updatedAt: Date
  },
  collections?: any[]
}

export function ProductForm({ product, collections }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const props = useSupabaseUpload({
    bucketName: "images",
    path: "/public/products",
    allowedMimeTypes: ["image/*"],
    maxFiles: 4,
    maxFileSize: 1000 * 1000 * 2, // 2MB
  })

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      compareAtPrice: product?.compareAtPrice || null,
      collectionId: product?.collectionId || null,
      material: product?.material || undefined,
      color: product?.color || undefined,
      dimensions: product?.dimensions ? JSON.stringify(product.dimensions, null, 2) : "",
      weight: product?.weight || null,
      featured: product?.featured || false,
      imageUrls: product?.images.map((img) => img.url) || [],
    },
  })

  const handleRemoveImage = (url: string) => {
    form.setValue("imageUrls", form.getValues("imageUrls").filter((imgUrl) => imgUrl !== url))
  }

  return (
    <Form {...form}>
      {generalError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {generalError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">اسم المنتج</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="أدخل اسم المنتج" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">الوصف</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder="أدخل وصف المنتج"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="price">السعر</FormLabel>
                <FormControl>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="compareAtPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="compareAtPrice">السعر قبل الخصم (اختياري)</FormLabel>
                <FormControl>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="collectionId">الفئة</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections?.map((collection: any) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="material">المادة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIALS.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="color">اللون</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر اللون" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border-2"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="dimensions"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="dimensions">الأبعاد (JSON)</FormLabel>
                <FormControl>
                  <Input
                    id="dimensions"
                    placeholder={`{"width": 120, "height": 80, "depth": 70, "unit": "cm"}`}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-sm text-muted-foreground">
                  مثال: {"width": 120, "height": 80, "depth": 70, "unit": "cm"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="weight">الوزن (كجم)</FormLabel>
                <FormControl>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    id="featured"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="featured">
                    منتج مميز (عرض هذا المنتج في الأماكن البارزة)
                  </FormLabel>
                  <FormDescription>
                    سيتم عرض هذا المنتج في الأماكن البارزة في المتجر.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>صور المنتج</FormLabel>
                <FormDescription className="text-sm text-muted-foreground">
                  أضف حتى 4 صور. الحد الأقصى لكل صورة هو 2MB
                </FormDescription>
                <Dropzone
                  {...props}
                  onUploadSuccess={(newImages) => {
                    const currentImages = form.getValues("imageUrls") || []
                    const updatedImages = [...currentImages, ...newImages.map((img) => img.url)]
                    field.onChange(updatedImages)
                  }}
                >
                  <DropzoneEmptyState />
                  <DropzoneContent>
                    {form.getValues("imageUrls")?.map((url) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt="Product image"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveImage(url)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </DropzoneContent>
                </Dropzone>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "تحديث المنتج" : "إنشاء منتج جديد"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
        </div>
      </Form>
  )
}
