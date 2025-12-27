import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllProducts } from "@/lib/queries"
import { formatPrice } from "@/lib/utils"
import { PlusCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function DashboardProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusCircle className="w-4 h-4 ml-2" />
            منتج جديد
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">المجموعة</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-muted overflow-hidden">
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.collection?.name || "غير مصنف"}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.price} د.ل</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-muted-foreground line-through">{product.compareAtPrice} د.ل</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.published ? "default" : "secondary"}>{product.published ? "منشور" : "غير منشور"}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/products/${product.id}/edit`}>تعديل</Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      حذف
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
