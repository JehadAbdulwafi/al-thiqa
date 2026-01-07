"use client"

import { deleteBanner } from "@/app/actions/banners"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type Banner = {
  id: number
  title: string
  subtitle: string | null
  cta: string | null
  image: string
  isActive: boolean
  order: number
  createdAt: Date
}

export function BannersTable({ banners }: { banners: Banner[] }) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الصورة</TableHead>
            <TableHead className="text-right">العنوان</TableHead>
            <TableHead className="text-right">العنوان الفرعي</TableHead>
            <TableHead className="text-right">دعوة العمل</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">الترتيب</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <div className="w-16 h-12 rounded-md bg-muted overflow-hidden">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    width={64}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{banner.title}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {banner.subtitle}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {banner.cta}
              </TableCell>
              <TableCell>
                <Badge variant={banner.isActive ? "default" : "secondary"} className="gap-1.5">
                  {banner.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {banner.isActive ? "نشط" : "غير نشط"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {banner.order}
              </TableCell>
              <TableCell className="text-left">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/banners/${banner.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(banner.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيؤدي هذا الإجراء إلى حذف اللافتة نهائياً من قاعدة البيانات.
                          لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteId && deleteBanner(deleteId)}
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export type { BannersTable as BannersTableType }
