import { useProductView } from "@/hooks/use-product-view"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  useProductView(parseInt(id, 10))

  return null
}
