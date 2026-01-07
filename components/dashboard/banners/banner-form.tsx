"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { Dropzone, DropzoneEmptyState, DropzoneContent } from "@/components/dropzone"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { createBanner, updateBanner } from "@/app/actions/banners"

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
        originalName: banner.image.split("/").pop()!,
        url: banner.image,
      }])
    }
  }, [banner, props.updateSuccesses])

  useEffect(() => {
    if (props.successes.length > 0) {
      form.setValue("image", props.successes[0].url)
    }
  }, [props.successes, form.setValue])

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true)
    setGeneralError("")

    try {
      if (banner) {
        await updateBanner(banner.id, data)
      } else {
        await createBanner(data)
      }
      router.push("/dashboard/banners")
      router.refresh()
    } catch (err: any) {
      setGeneralError(err.message || "فشل حفظ اللافتة")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveImage = async () => {
    const currentImage = form.getValues("image")
    if (currentImage) {
      const fileName = currentImage.split("/").pop()!
      await props.removeFile(fileName)
    }
    form.setValue("image", "")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {generalError && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive mb-4">
            {generalError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
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
                    <Textarea id="subtitle" {...field} value={field.value || ""} rows={2} placeholder="أدخل عنوان اللافتة الفرعي" />
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
                    <Input id="cta" {...field} value={field.value || ""} placeholder="أدخل دعوة العمل" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>صورة اللافتة</FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    أضف صورة واحدة. الحد الأقصى هو 2MB
                  </FormDescription>
                  {form.watch("image") ? (
                    <div className="relative">
                      <img
                        src={form.watch("image")!}
                        alt="Banner image"
                        className="w-full h-auto max-h-[400px] object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 left-2"
                        onClick={handleRemoveImage}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <Dropzone {...props}>
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="isActive">
                      لافتة نشطة
                    </FormLabel>
                    <FormDescription>
                      سيتم عرض هذه اللافتة في الموقع
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">
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
