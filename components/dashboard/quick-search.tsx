"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Package, Users, FolderOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function QuickSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (value.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        setIsOpen(true)
      }
    } catch (error) {
      console.error("Search error:", error)
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "PRODUCT":
        return <Package className="h-4 w-4 text-muted-foreground" />
      case "BLOG_POST":
        return <FileText className="h-4 w-4 text-muted-foreground" />
      case "USER":
        return <Users className="h-4 w-4 text-muted-foreground" />
      case "COLLECTION":
        return <FolderOpen className="h-4 w-4 text-muted-foreground" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getResultHref = (result: any) => {
    switch (result.type) {
      case "PRODUCT":
        return `/dashboard/products/${result.id}/edit`
      case "BLOG_POST":
        return `/dashboard/blog/${result.id}`
      case "USER":
        return `/dashboard/users/${result.id}/edit`
      case "COLLECTION":
        return `/dashboard/collections/${result.id}/edit`
      default:
        return "#"
    }
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="بحث سريع: منتجات، مقالات، مستخدمين..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10 pl-4"
            onFocus={() => isOpen && results.length > 0 && setIsOpen(true)}
          />
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/products")}>
          بحث متقدم
        </Button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border bg-card shadow-lg">
          <div className="p-2">
            {results.slice(0, 5).map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={getResultHref(result)}
                onClick={() => {
                  setIsOpen(false)
                  setQuery("")
                }}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                {getResultIcon(result.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{result.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.type === "PRODUCT" && "منتج"}
                    {result.type === "BLOG_POST" && "مقال"}
                    {result.type === "USER" && "مستخدم"}
                    {result.type === "COLLECTION" && "مجموعة"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
