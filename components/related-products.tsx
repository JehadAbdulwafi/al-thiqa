import { ProductCard } from "@/components/product-card"

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

const relatedProducts = [
  {
    id: 2,
    name: "طاولة قهوة رخام",
    price: "2,800",
    image: "/marble-coffee-table.avif",
    category: "غرف المعيشة",
  },
  {
    id: 5,
    name: "طاولة جانبية ذهبية",
    price: "1,200",
    image: "/gold-side-table.avif",
    category: "غرف المعيشة",
    badge: "جديد",
  },
  {
    id: 9,
    name: "كنبة زاوية رمادية",
    price: "7,200",
    image: "/gray-corner-sectional-sofa.avif",
    category: "غرف المعيشة",
    badge: "الأكثر مبيعاً",
  },
]

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  return (
    <section className="py-12 border-t">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">منتجات ذات صلة</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
