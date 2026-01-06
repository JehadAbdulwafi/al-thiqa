"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { Dropzone, DropzoneEmptyState } from "@/components/dropzone"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const bannerFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  subtitle: z.string().nullable().optional(),
  cta: z.string().nullable().optional(),
  image: z.string().url("الصورة مطلوبة"),
  isActive: z.boolean().default(true),
  order: z.number().min(0, "الترتيب يجب أن يكون رقماً موجباً"),
})

type BannerFormData = z.infer<typeof bannerFormSchema>

interface BannerFormProps {
  banner?: {
    id: number
    title: string
    subtitle: string | null
    cta: string | null
    image: string
    isActive: boolean
    order: number
  }
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const props = useSupabaseUpload({
    bucketName: "images",
    path: "/public/banners",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 2,
  })

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: banner?.title || "",
      subtitle: banner?.subtitle || "",
      cta: banner?.cta || "",
      image: banner?.image || "",
      isActive: banner?.isActive ?? true,
      order: banner?.order || 0,
    },
  })

  useEffect(() => {
    if (banner?.image) {
      props.updateSuccesses([{
        name: banner.image.split("/").pop()!,
        url: banner.image,
      }])
    }
  }, [banner, props.updateSuccesses])

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true)
    setGeneralError("")

    try {
      if (banner) {
        await fetch(`/api/banners/${banner.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      } else {
        await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }
      router.push("/dashboard/banners")
      router.refresh()
    } catch (err: any) {
      setGeneralError(err.message || "فشل حفظ اللافتة")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {generalError && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {generalError}
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">العنوان</FormLabel>
              <FormControl>
                <Input id="title" {...field} placeholder="أدخل عنوان اللافتة" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="subtitle">العنوان الفرعي</FormLabel>
              <FormControl>
                <Textarea id="subtitle" {...field} rows={2} placeholder="أدخل عنوان اللافتة الفرعي" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cta"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cta">دعوة العمل (CTA)</FormLabel>
              <FormControl>
                <Input id="cta" {...field} placeholder="أدخل دعوة العمل" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="image">الصورة</FormLabel>
              <FormControl>
                {form.watch("image") ? (
                  <div className="relative w-[500px]">
                    <img
                      src={form.watch("image")!}
                      alt="Banner image"
                      className="w-full h-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 left-2"
                      onClick={() => {
                        field.onChange("")
                        props.removeFile(props.successes[0]?.name || "")
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <Dropzone {...props}>
                    <DropzoneEmptyState />
                  </Dropzone>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="isActive" className="text-base">
                  لافتة نشطة
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="order">الترتيب</FormLabel>
              <FormControl>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  {...field}
                  placeholder="أدخل ترتيب اللافتة"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {banner ? "تحديث اللافتة" : "إنشاء لافتة جديدة"}
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
      </form>
    </Form>
  )
}
