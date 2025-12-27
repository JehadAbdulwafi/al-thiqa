import { BlogForm } from "@/components/dashboard/blog/blog-form"

export default async function NewBlogPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">إنشاء منشور مدونة جديد</h2>
      <BlogForm />
    </div>
  )
}
