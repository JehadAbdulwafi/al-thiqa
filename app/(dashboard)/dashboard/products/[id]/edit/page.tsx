import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { getCollectionsForForm, getProductById } from "@/lib/queries"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth()
  const { id } = await params

  if (!id) {
    redirect("/dashboard/products")
  }

  if (!session?.user?.id) {
    redirect("/login")
  }

  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    redirect("/dashboard/products")
  }

  const product = await getProductById(productId)
  const collections = await getCollectionsForForm()

  if (!product) {
    redirect("/dashboard/products")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">تعديل المنتج: {product.name}</h2>
        <p className="text-muted-foreground mt-1">تحديث تفاصيل المنتج</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المنتج</CardTitle>
          <CardDescription>قم بتحديث تفاصيل المنتج أدناه</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} collections={collections} />
        </CardContent>
      </Card>
    </div>
  )
}
