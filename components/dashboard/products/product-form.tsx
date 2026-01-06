"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MATERIALS, COLORS } from "@/lib/constants/materials-colors"
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

import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"

const productFormSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  slug: z.string().min(1, "الرابط اللطيف مطلوب"),
  description: z.string().nullable().optional(),
  price: z.string()
    .nullable()
    .transform((val) => {
      if (!val || val.trim() === "") return 0;
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    })
    .pipe(z.number().min(0, "السعر يجب أن يكون موجباً أو صفراً")),
  compareAtPrice: z.string()
    .nullable()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .pipe(z.number().min(0, "السعر قبل الخصم يجب أن يكون موجباً أو صفراً").nullable())
    .optional(),
  stock: z.number().int().min(0, "المخزون لا يمكن أن يكون سالباً").default(0),
  collectionId: z.string()
    .nullable()
    .transform((val) => val ? parseInt(val, 10) : null)
    .optional(),
  material: z.enum(materialEnum.enumValues).nullable().optional(),
  color: z.enum(colorEnum.enumValues).nullable().optional(),
  dimensions: z.string().nullable().optional(), // Store as stringified JSON
  weight: z.string()
    .nullable()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .refine((val) => val === null || val >= 0, "الوزن يجب أن يكون موجباً أو صفراً")
    .optional(),
  featured: z.boolean().default(false),
  imageUrls: z.array(z.string().url("يجب أن يكون رابط URL صحيحاً")).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;


interface ProductFormProps {
  product?: {
    id: number
    name: string
    slug: string
    description: string | null
    price: number | null
    compareAtPrice: number | null
    stock: number
    collectionId: number | null
      material: typeof Material | null
      color: typeof Color | null
    dimensions: any | null
    weight: number | null
    featured: boolean
    images: { url: string }[]
  }
  collections: { id: number; name: string; slug: string }[]
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
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price ? product.price.toString() : "0", // Store as string for input
      compareAtPrice: product?.compareAtPrice ? product.compareAtPrice.toString() : "", // Store as string for input
      stock: product?.stock || 0,
      collectionId: product?.collectionId?.toString() || null,
      material: product?.material || undefined,
      color: product?.color || undefined,
      dimensions: product?.dimensions ? JSON.stringify(product.dimensions, null, 2) : "",
      weight: product?.weight ? product.weight.toString() : "", // Store as string for input
      featured: product?.featured || false,
      imageUrls: product?.images.map((img) => img.url) || [],
    },
  });

  // Watch imageUrls from form state to update formData for submission
  const imageUrlsWatcher = form.watch("imageUrls");

  useEffect(() => {
    // Pre-fill the dropzone with existing images
    if (product?.images && product.images.length > 0) {
      const prefilledFiles = product.images.map((img) => ({
        name: img.url.split("/").pop()!, // This is the unique name from the URL
        originalName: img.url.split("/").pop()!, // Assuming original name is the same as unique name for existing data
        url: img.url,
      }));
      props.updateSuccesses(prefilledFiles);
    }
  }, [product, props.updateSuccesses]); // Only run on product prop change and when updateSuccesses is stable

  useEffect(() => {
    // Sync form's imageUrls with successful uploads from useSupabaseUpload hook
    form.setValue("imageUrls", props.successes.map((s) => s.url));
  }, [props.successes, form.setValue]);


  const handleImageRemove = async (url: string) => {
    const fileName = url.split("/").pop()!
    await props.removeFile(fileName)
    // Update form state directly after removal
    form.setValue("imageUrls", form.getValues("imageUrls").filter((imgUrl) => imgUrl !== url));
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    setGeneralError("")

    try {
      if (product) {
        await updateProduct(product.id, data as any) // Cast to any due to potential Zod transform mismatch for server action
      } else {
        await createProduct(data as any) // Cast to any
      }
      router.push("/dashboard/products")
      router.refresh()
    } catch (err: any) {
      setGeneralError(err.message || "فشل حفظ المنتج")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {generalError && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{generalError}</div>}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">الاسم</FormLabel>
              <FormControl>
                <Input id="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="slug">الرابط اللطيف (Slug)</FormLabel>
              <FormControl>
                <Input id="slug" {...field} />
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
                <Textarea id="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="price">السعر</FormLabel>
                <FormControl>
                  <Input id="price" type="number" step="0.01" {...field} />
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
                  <Input id="compareAtPrice" type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="stock">المخزون</FormLabel>
              <FormControl>
                <Input id="stock" type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
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
              <FormLabel htmlFor="collectionId">التصنيف</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيفاً" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {collections.map(col => (
                    <SelectItem key={col.id} value={col.id.toString()}>
                      {col.name}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dimensions"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="dimensions">الأبعاد (JSON)</FormLabel>
                <FormControl>
                  <Textarea id="dimensions" {...field} placeholder={`مثال: { "width": 120, "height": 80, "depth": 70, "unit": "cm" }`} />
                </FormControl>
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
                  <Input id="weight" type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>صور المنتج</FormLabel>
              <FormControl>
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {field.value?.map((url) => (
                      <div key={url} className="relative">
                        <img src={url} alt="Product image" className="w-full h-auto rounded-lg" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => handleImageRemove(url)}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                  {props.successes.length < props.maxFiles && (
                    <div className="mt-4">
                      <Dropzone {...props}>
                        <DropzoneEmptyState />
                        <DropzoneContent />
                      </Dropzone>
                    </div>
                  )}
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
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
              <FormMessage />
            </FormItem>
          )}
        />


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
    </Form>
  )
}
