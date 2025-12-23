import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface CollectionCardProps {
  collection: {
    id: string
    title: string
    description: string
    image: string
    itemCount: number
  }
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-[3/2]">
        <Image
          src={collection.image || "/placeholder.svg"}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
            {collection.title}
          </h3>
          <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{collection.description}</p>

        <p className="text-sm text-gray-500">{collection.itemCount} منتج</p>
      </div>
    </Link>
  )
}
