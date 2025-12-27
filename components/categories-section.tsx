import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button";

interface Collection {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  itemCount?: number;
}

interface CategoriesSectionProps {
  collections: Collection[];
}

export function CategoriesSection({ collections }: CategoriesSectionProps) {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">تسوق حسب الفئة</h2>
          <p className="text-gray-600 text-lg">اختر من مجموعتنا الواسعة من الفئات</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.slug}`}>
              <Button
                variant="outline"
                className="h-auto flex-col gap-4 p-6 hover:shadow-lg transition-all border-gray-200 hover:border-[#8B7355] bg-white w-full"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg" // Placeholder image if no image is available
                      alt={collection.name}
                      width={48}
                      height={48}
                      className="opacity-50"
                    />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">{collection.name}</h3>
                  {collection.itemCount !== undefined && (
                    <p className="text-xs text-gray-500">{collection.itemCount}+ منتج</p>
                  )}
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
