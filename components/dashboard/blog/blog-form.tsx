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
import { createBlogPost, updateBlogPost } from "@/app/actions/blog"
import { Loader2 } from "lucide-react"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone"
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"

const blogFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().optional(), // Auto-generated
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1, "المحتوى مطلوب"),
  coverImage: z.string().nullable().optional(),
  published: z.boolean().default(false),
  publishedAt: z.date().optional().nullable(),
});

type BlogPostFormData = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  blogPost?: {
    id: number
    title: string
    slug: string
    excerpt: string | null
    content: string
    coverImage: string | null
    published: boolean
    publishedAt: Date | null
  },

}

export function BlogForm({ blogPost }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const props = useSupabaseUpload({
    bucketName: 'images',
    path: '/public/blog',
    allowedMimeTypes: ['image/*'],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 2, // 2MB,
  })

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blogPost?.title || "",
      slug: blogPost?.slug || "",
      excerpt: blogPost?.excerpt || "",
      content: blogPost?.content || "",
      coverImage: blogPost?.coverImage || "",
      published: blogPost?.published || false,
      publishedAt: blogPost?.publishedAt ? new Date(blogPost.publishedAt) : null,
    },
  });

  useEffect(() => {
    if (blogPost) {
      if (blogPost.coverImage) {
        props.updateSuccesses([{
          name: blogPost.coverImage.split('/').pop()!,
          originalName: blogPost.coverImage.split('/').pop()!,
          url: blogPost.coverImage
        }])
      }
    }
  }, [blogPost, props.updateSuccesses])

  useEffect(() => {
    if (props.successes.length > 0 && props.successes[0].url !== form.getValues('coverImage')) {
      if (props.successes[0]?.url) {
        form.setValue('coverImage', props.successes[0].url);
      }
    }
  }, [props.successes, form.setValue, form.getValues]);

  const handleImageRemove = async () => {
    const imageUrl = form.getValues('coverImage');
    if (imageUrl) {
      const uniqueFileName = imageUrl.split('/').pop()!;
      await props.removeFile(uniqueFileName);
      form.setValue('coverImage', '');
    }
  }

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSubmitting(true)
    setGeneralError("")

    try {
      if (blogPost) {
        await updateBlogPost(blogPost.id, data as any)
      } else {
        await createBlogPost(data as any)
      }
      router.push("/dashboard/blog")
      router.refresh()
    } catch (err: any) {
      setGeneralError(err.message || "فشل حفظ منشور المدونة")
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">العنوان</FormLabel>
              <FormControl>
                <Input id="title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="excerpt">المقتطف</FormLabel>
              <FormControl>
                <Textarea id="excerpt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="content">المحتوى</FormLabel>
              <FormControl>
                <Textarea id="content" {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="published">
                  نشر المنشور
                </FormLabel>
                <FormDescription>
                  هل تريد نشر هذا المنشور ليصبح مرئياً للعامة؟
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Image Upload */}
        <div className="w-[500px]">
          {form.watch('coverImage') ? (
            <div className="relative">
              <img src={form.watch('coverImage')!} alt="Cover image" className="w-full h-auto rounded-lg" />
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
            {blogPost ? "تحديث منشور المدونة" : "إنشاء منشور المدونة"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            إلغاء
          </Button>
        </div>
      </form>
    </Form>
  )
}
