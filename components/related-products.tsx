import { ProductCard } from "@/components/product-card"

type Product = any // Using 'any' for now

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-12 border-t">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">منتجات ذات صلة</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
