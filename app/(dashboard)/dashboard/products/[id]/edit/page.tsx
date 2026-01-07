import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
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

  // Check if user is admin
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, parseInt(session.user.id)),
    columns: { role: true },
  })

  if (currentUser?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    redirect("/dashboard/products")
  }

  const product = await getProductById(id)
  const collections = await getCollectionsForForm()

  if (!product) {
    redirect("/dashboard/products")
  }

  const productWithImageUrls = {
    ...product,
    price: product.price ? Number(product.price) : null,
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    weight: product.weight ? Number(product.weight) : null,
    imageUrls: product.images.map(img => img.url),
  } as any

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
          <ProductForm product={productWithImageUrls} collections={collections} />
        </CardContent>
      </Card>
    </div>
  )
}
