"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { deleteBlogPost } from "@/app/actions/blog"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useState } from "react"

interface BlogPostsTableProps {
  blogPosts: {
    id: number
    title: string
    slug: string
    authorName: string
    published: boolean
    createdAt: Date
  }[]
}

export function BlogPostsTable({ blogPosts }: BlogPostsTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<number | null>(null)

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">العنوان</TableHead>
            <TableHead className="text-right">الرابط اللطيف</TableHead>
            <TableHead className="text-right">المؤلف</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">تاريخ الإنشاء</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium text-right">{post.title}</TableCell>
                <TableCell className="text-right">{post.slug}</TableCell>
                <TableCell className="text-right">{post.authorName}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "منشور" : "مسودة"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{format(post.createdAt, "PPP")}</TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-start gap-2">
                    <Link href={`/dashboard/blog/${post.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيؤدي هذا الإجراء إلى حذف منشور المدونة نهائياً من قاعدة البيانات.
                            لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              if (deleteId) {
                                await deleteBlogPost(deleteId);
                                router.refresh();
                              }
                            }}
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                لا توجد منشورات مدونة.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
