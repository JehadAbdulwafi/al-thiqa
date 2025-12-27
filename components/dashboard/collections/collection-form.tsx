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
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"

const collectionFormSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  featured: z.boolean().default(false),
});

type CollectionFormData = z.infer<typeof collectionFormSchema>;


interface CollectionFormProps {
  collection?: {
    id: number
    name: string
    description: string | null
    image: string | null
    featured: boolean
  }
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const props = useSupabaseUpload({
    bucketName: 'images',
    path: '/public',
    allowedMimeTypes: ['image/*'],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 2, // 2MB,
  })

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: collection?.name || "",
      description: collection?.description || "",
      image: collection?.image || "",
      featured: collection?.featured || false,
    },
  });

  useEffect(() => {
    if (collection) {
      // Pre-fill the dropzone with existing image if available
      if (collection.image) {
        props.updateSuccesses([{
          name: collection.image.split('/').pop()!, // This is the unique name
          originalName: collection.image.split('/').pop()!, // Assuming original name is the same as unique name for existing data
          url: collection.image
        }])
      }
    }
  }, [collection, props.updateSuccesses])

  useEffect(() => {
    // This useEffect handles updates when a new image is uploaded via the dropzone
    if (props.successes.length > 0 && props.successes[0].url !== form.getValues('image')) {
      console.log('Uploaded image URLs:', props.successes.map(s => s.url));
      // Assuming only one image can be uploaded for a collection,
      // update the form with the first successful upload's URL
      if (props.successes[0]?.url) {
        form.setValue('image', props.successes[0].url);
      }
    }
  }, [props.successes, form.setValue, form.getValues]);

  const handleImageRemove = async () => {
    const imageUrl = form.getValues('image');
    if (imageUrl) {
      const uniqueFileName = imageUrl.split('/').pop()!;
      await props.removeFile(uniqueFileName);
      form.setValue('image', ''); // Clear the image in the form
    }
  }

  const onSubmit = async (data: CollectionFormData) => {
    setIsSubmitting(true)
    setGeneralError("")

    try {
      if (collection) {
        await updateCollection(collection.id, data as any)
      } else {
        await createCollection(data as any)
      }
      router.push("/dashboard/collections")
      router.refresh()
    } catch (err: any) {
      setGeneralError(err.message || "فشل حفظ المجموعة")
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
                  مجموعة مميزة (عرض هذه المجموعة في الأماكن البارزة)
                </FormLabel>
                <FormDescription>
                  سيتم عرض هذه المجموعة في الأماكن البارزة في المتجر.
                </FormDescription>
              </div >
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-[500px]">
          {form.watch('image') ? (
            <div className="relative">
              <img src={form.watch('image')!} alt="Collection image" className="w-full h-auto rounded-lg" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 left-2"
                onClick={handleImageRemove}
              >
                X
              </Button>
            </div>
          ) : (
            <Dropzone {...props}>
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          )}
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
    </Form>
  )
}
