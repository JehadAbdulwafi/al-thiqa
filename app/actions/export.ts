"use server"

import { db } from "@/lib/db"
import { products, blogPosts, users } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export async function exportProductsToCSV() {
  const data = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    with: {
      collection: {
        columns: {
          name: true,
        },
      },
    },
  })

  const headers = [
    "ID",
    "Name",
    "Price",
    "Material",
    "Color",
    "Collection",
    "Featured",
    "Published",
    "Created At",
  ]

  const rows = data.map((product) => [
    product.id,
    product.name,
    product.price,
    product.material,
    product.color,
    product.collection?.name || "",
    product.featured ? "Yes" : "No",
    product.published ? "Yes" : "No",
    product.createdAt.toISOString(),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n")

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="products-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}

export async function exportAnalyticsToCSV() {
  const data = await db.query.monthlyStats.findMany({
    orderBy: [desc(monthlyStats.month)],
  })

  const headers = [
    "Month",
    "Products Count",
    "Blog Posts Count",
    "Users Count",
    "Total Views",
    "New Products",
    "New Blog Posts",
    "New Users",
    "Created At",
  ]

  const rows = data.map((stat) => [
    stat.month,
    stat.productsCount,
    stat.blogPostsCount,
    stat.usersCount,
    stat.totalViews,
    stat.newProducts,
    stat.newBlogPosts,
    stat.newUsers,
    stat.createdAt.toISOString(),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n")

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="analytics-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
