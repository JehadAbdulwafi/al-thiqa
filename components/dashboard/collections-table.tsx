"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteCollection } from "@/app/actions/collections"

interface Collection {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  featured: boolean
  order: number | null
  productsCount: number;
}

interface CollectionsTableProps {
  collections: Collection[]
}

export function CollectionsTable({ collections }: CollectionsTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">عدد المنتجات</TableHead>
              <TableHead className="text-right">مميز</TableHead>
              <TableHead className="">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5} // Updated colSpan for new columns
                  className="text-center text-muted-foreground py-8"
                >
                  لا توجد مجموعات
                </TableCell>
              </TableRow>
            ) : (
              collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell className="font-medium">{collection.name}</TableCell>
                  <TableCell>{collection.productsCount}</TableCell>
                  <TableCell>{collection.featured ? "نعم" : "لا"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/collections/${collection.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(collection.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيؤدي هذا الإجراء إلى حذف المجموعة نهائياً من قاعدة البيانات.
                              لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteId && deleteCollection(deleteId)}
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
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
