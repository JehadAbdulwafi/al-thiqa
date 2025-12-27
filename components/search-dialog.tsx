"use client"

import { useState, useEffect } from "react"
import { Search, Package, Layers, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { searchAll } from "@/app/actions/search"

interface SearchResult {
  type: "product" | "collection" | "blog"
  id: number
  slug: string
  name: string // name or title
  image?: string // coverImage for blog, image for collection, first image for product
  price?: string // for products
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Debounce search term and call server action
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsLoading(true)
        const results = await searchAll(searchQuery)
        setSearchResults(results)
        setIsLoading(false)
      } else {
        setSearchResults([])
      }
    }, 300) // Debounce for 300ms

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Categorize results for rendering
  const collectionResults = searchResults.filter(r => r.type === "collection")
  const productResults = searchResults.filter(r => r.type === "product")
  const blogResults = searchResults.filter(r => r.type === "blog")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-500" />
            <Input
              placeholder="ابحث عن المنتجات، المجموعات، أو المقالات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 text-lg"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="overflow-y-auto p-6 space-y-6">
          {isLoading && searchQuery.trim() !== "" ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 animate-pulse" />
              <p className="text-lg">جاري البحث عن "{searchQuery}"...</p>
            </div>
          ) : searchResults.length === 0 && searchQuery.trim() !== "" ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg">لم يتم العثور على نتائج لـ "{searchQuery}"</p>
              <p className="text-sm mt-1">جرب كلمات بحث مختلفة</p>
            </div>
          ) : (
            <>
              {/* Collections Results */}
              {collectionResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <Layers className="h-4 w-4 text-[#8B7355]" />
                    <h3 className="font-semibold text-sm text-gray-900">المجموعات</h3>
                    <span className="text-xs text-gray-500">
                      ({collectionResults.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {collectionResults.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/collections/${collection.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={collection.image || "/placeholder.svg"}
                            alt={collection.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-[#8B7355] transition-colors">
                            {collection.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Results */}
              {productResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <Package className="h-4 w-4 text-[#8B7355]" />
                    <h3 className="font-semibold text-sm text-gray-900">المنتجات</h3>
                    <span className="text-xs text-gray-500">
                      ({productResults.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {productResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-[#8B7355] transition-colors">
                            {product.name}
                          </p>
                          {product.price && <p className="text-sm text-gray-600">{product.price} ر.س</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Results */}
              {blogResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <FileText className="h-4 w-4 text-[#8B7355]" />
                    <h3 className="font-semibold text-sm text-gray-900">المقالات</h3>
                    <span className="text-xs text-gray-500">
                      ({blogResults.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {blogResults.map((blog) => (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-[#8B7355] transition-colors line-clamp-2">
                            {blog.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
