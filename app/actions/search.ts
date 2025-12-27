"use server"

import { db } from "@/lib/db"
import { products, collections, blogPosts } from "@/lib/db/schema"
import { ilike, or } from "drizzle-orm"

interface SearchResult {
  type: "product" | "collection" | "blog"
  id: number
  slug: string
  name: string // name or title
  image?: string // coverImage for blog, image for collection, first image for product
  price?: string // for products
}

export async function searchAll(searchTerm: string): Promise<SearchResult[]> {
  const query = `%${searchTerm.toLowerCase()}%`

  const productResults = await db.query.products.findMany({
    where: or(
      ilike(products.name, query),
      ilike(products.description, query),
    ),
    columns: {
      id: true,
      slug: true,
      name: true,
      price: true,
    },
    with: {
      images: {
        columns: {
          url: true,
        },
        limit: 1,
      },
    },
    limit: 5,
  })

  const collectionResults = await db.query.collections.findMany({
    where: or(
      ilike(collections.name, query),
      ilike(collections.description, query),
    ),
    columns: {
      id: true,
      slug: true,
      name: true,
      image: true,
    },
    limit: 5,
  })

  const blogResults = await db.query.blogPosts.findMany({
    where: or(
      ilike(blogPosts.title, query),
      ilike(blogPosts.excerpt, query),
      ilike(blogPosts.content, query),
    ),
    columns: {
      id: true,
      slug: true,
      title: true,
      coverImage: true,
    },
    limit: 5,
  })

  const formattedResults: SearchResult[] = []

  productResults.forEach(p => {
    formattedResults.push({
      type: "product",
      id: p.id,
      slug: p.slug,
      name: p.name,
      image: p.images?.[0]?.url,
      price: p.price,
    })
  })

  collectionResults.forEach(c => {
    formattedResults.push({
      type: "collection",
      id: c.id,
      slug: c.slug,
      name: c.name,
      image: c.image,
    })
  })

  blogResults.forEach(b => {
    formattedResults.push({
      type: "blog",
      id: b.id,
      slug: b.slug,
      name: b.title,
      image: b.coverImage,
    })
  })

  return formattedResults
}
