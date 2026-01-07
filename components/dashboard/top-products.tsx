import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ProductItem {
  id: number
  name: string
  views: number
  featured: boolean | null
  collection?: string
  image?: string
}

interface TopProductsProps {
  products: ProductItem[]
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>المنتجات الأكثر مشاهدة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              لا توجد منتجات حتى الآن
            </p>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}/edit`}
                className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.collection || "بدون مجموعة"} · {product.views.toLocaleString()} مشاهدة
                  </p>
                </div>
                {product.featured === true && (
                  <Badge variant="secondary" className="text-xs">
                    مميز
                  </Badge>
                )}
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
