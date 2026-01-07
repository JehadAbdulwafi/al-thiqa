import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products, blogPosts, users, collections } from "@/lib/db/schema"
import { desc, or, ilike, sql } from "drizzle-orm"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url).searchParams
  const query = searchParams.q as string

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const searchPattern = `%${query}%`

    const [productsResult, blogsResult, usersResult, collectionsResult] =
      await Promise.all([
        db
          .select({
            id: products.id,
            name: products.name,
            price: products.price,
            type: sql`'PRODUCT'`.as("type"),
          })
          .from(products)
          .where(ilike(products.name, searchPattern))
          .limit(5)
          .orderBy(desc(products.createdAt)),
        db
          .select({
            id: blogPosts.id,
            name: blogPosts.title,
            type: sql`'BLOG_POST'`.as("type"),
          })
          .from(blogPosts)
          .where(ilike(blogPosts.title, searchPattern))
          .limit(5)
          .orderBy(desc(blogPosts.createdAt)),
        db
          .select({
            id: users.id,
            name: users.name,
            type: sql`'USER'`.as("type"),
          })
          .from(users)
          .where(or(ilike(users.name, searchPattern), ilike(users.email, searchPattern)))
          .limit(5)
          .orderBy(desc(users.createdAt)),
        db
          .select({
            id: collections.id,
            name: collections.name,
            type: sql`'COLLECTION'`.as("type"),
          })
          .from(collections)
          .where(ilike(collections.name, searchPattern))
          .limit(5)
          .orderBy(desc(collections.createdAt)),
      ])

    const results = [
      ...productsResult.map((p) => ({ ...p, title: p.name })),
      ...blogsResult.map((b) => ({ ...b, title: b.title })),
      ...usersResult.map((u) => ({ ...u, title: u.name })),
      ...collectionsResult.map((c) => ({ ...c, title: c.name })),
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
