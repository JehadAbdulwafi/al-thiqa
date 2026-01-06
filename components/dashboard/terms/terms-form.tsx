"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Editor from "@/components/editor"
import { updateTermsOfServiceAction } from "@/app/actions/terms"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel as FormLabelComponent, FormMessage } from "@/components/ui/form"

const termsOfServiceFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  content: z.string().min(1, "المحتوى مطلوب"),
  effectiveDate: z.date().optional(),
})

type TermsOfServiceFormData = z.infer<typeof termsOfServiceFormSchema>

interface TermsOfServiceFormProps {
  termsOfServiceData?: {
    id: number
    title: string
    content: string
    effectiveDate: Date
    createdAt: Date
    updatedAt: Date
  },
}

export function TermsOfServiceForm({ termsOfServiceData }: TermsOfServiceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const form = useForm<TermsOfServiceFormData>({
    resolver: zodResolver(termsOfServiceFormSchema),
    defaultValues: {
      title: termsOfServiceData?.title || "",
      content: termsOfServiceData?.content || "",
    },
  })

  const onSubmit = async (data: TermsOfServiceFormData) => {
    setIsSubmitting(true)
    setGeneralError("")

    try {
      await updateTermsOfServiceAction(data as any)
      router.push("/dashboard/terms")
      router.refresh()
    } catch (err: any) {
      setGeneralError(err.message || "فشل تحديث شروط الخدمة")
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
              <FormLabelComponent htmlFor="title">العنوان</FormLabelComponent>
              <FormControl>
                <input
                  id="title"
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
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
              <FormLabelComponent htmlFor="content">المحتوى</FormLabelComponent>
              <FormControl>
                <div className="border rounded-md">
                  <Editor
                    content={field.value}
                    onChange={field.onChange}
                    editable={true}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            تحديث شروط الخدمة
          </Button>
        </div>
      </form>
    </Form>
  )
}
