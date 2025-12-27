import ProductsTable from "@/components/dashboard/products-table"
import { Button } from "@/components/ui/button"
import { getAllProducts } from "@/lib/queries"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المنتجات</h2>
          <p className="text-muted-foreground">إدارة المنتجات</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            إضافة منتج جديدة
          </Button>
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
