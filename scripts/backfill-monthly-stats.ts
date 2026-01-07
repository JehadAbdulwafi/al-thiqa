import "dotenv/config"
import { db } from "@/lib/db"
import { products, blogPosts, users, monthlyStats, productViewHistory } from "@/lib/db/schema"
import { count, eq, and, gte, lte, sql } from "drizzle-orm"
import { format } from "date-fns"

async function backfillMonthlyStats() {
  console.log("Starting monthly stats backfill...")

  try {
    // Get all unique months from products, blog posts, and users creation dates
    const productsMonths = await db
      .selectDistinct({
        month: sql<string>`to_char(${products.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(products)
      .groupBy(sql`to_char(${products.createdAt}, 'YYYY-MM')`)

    const blogPostsMonths = await db
      .selectDistinct({
        month: sql<string>`to_char(${blogPosts.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(blogPosts)
      .groupBy(sql`to_char(${blogPosts.createdAt}, 'YYYY-MM')`)

    const usersMonths = await db
      .selectDistinct({
        month: sql<string>`to_char(${users.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(users)
      .groupBy(sql`to_char(${users.createdAt}, 'YYYY-MM')`)

    // Combine all unique months
    const allMonthsSet = new Set<string>()
    productsMonths.forEach((m) => allMonthsSet.add(m.month))
    blogPostsMonths.forEach((m) => allMonthsSet.add(m.month))
    usersMonths.forEach((m) => allMonthsSet.add(m.month))

    const allMonths = Array.from(allMonthsSet).sort()

    console.log(`Found ${allMonths.length} months to backfill`)

    for (const month of allMonths) {
      console.log(`Processing month: ${month}`)

      // Calculate totals at the end of the month
      const monthStart = new Date(`${month}-01`)
      const monthEnd = new Date(month)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(monthEnd.getDate() - 1)
      monthEnd.setHours(23, 59, 59, 999)

      // Count products created this month
      const [newProductsResult] = await db
        .select({ count: count() })
        .from(products)
        .where(
          and(
            gte(products.createdAt, monthStart),
            lte(products.createdAt, monthEnd)
          )
        )

      // Count products total at end of month
      const [totalProductsResult] = await db
        .select({ count: count() })
        .from(products)
        .where(lte(products.createdAt, monthEnd))

      // Count blog posts created this month
      const [newBlogPostsResult] = await db
        .select({ count: count() })
        .from(blogPosts)
        .where(
          and(
            gte(blogPosts.createdAt, monthStart),
            lte(blogPosts.createdAt, monthEnd)
          )
        )

      // Count blog posts total at end of month
      const [totalBlogPostsResult] = await db
        .select({ count: count() })
        .from(blogPosts)
        .where(lte(blogPosts.createdAt, monthEnd))

      // Count users created this month
      const [newUsersResult] = await db
        .select({ count: count() })
        .from(users)
        .where(
          and(
            gte(users.createdAt, monthStart),
            lte(users.createdAt, monthEnd)
          )
        )

      // Count users total at end of month
      const [totalUsersResult] = await db
        .select({ count: count() })
        .from(users)
        .where(lte(users.createdAt, monthEnd))

      // Count total views (sum of view_count at end of month)
      // Since we don't have historical view data, we'll use current view_count
      // In production, you'd want to track this differently
      const [totalViewsResult] = await db
        .select({ total: sql<number>`coalesce(sum(${products.viewCount}), 0)` })
        .from(products)

      // Check if month already exists
      const existing = await db.query.monthlyStats.findFirst({
        where: eq(monthlyStats.month, month),
      })

      if (existing) {
        console.log(`  Month ${month} already exists, skipping`)
        continue
      }

      // Insert monthly stats
      await db.insert(monthlyStats).values({
        month,
        productsCount: totalProductsResult.count,
        blogPostsCount: totalBlogPostsResult.count,
        usersCount: totalUsersResult.count,
        totalViews: totalViewsResult.total || 0,
        newProducts: newProductsResult.count,
        newBlogPosts: newBlogPostsResult.count,
        newUsers: newUsersResult.count,
        createdAt: new Date(),
      })

      console.log(`  Inserted stats for ${month}`)
    }

    console.log("Monthly stats backfill completed successfully!")
  } catch (error) {
    console.error("Error during backfill:", error)
    throw error
  }
}

async function initializeProductViewCounts() {
  console.log("Initializing product view counts...")

  try {
    const result = await db
      .select({ count: count() })
      .from(products)
      .where(sql`${products.viewCount} is null`)

    if (result[0].count > 0) {
      await db
        .update(products)
        .set({ viewCount: 0 })
        .where(sql`${products.viewCount} is null`)

      console.log(`Initialized view_count for ${result[0].count} products`)
    } else {
      console.log("All products already have view_count initialized")
    }
  } catch (error) {
    console.error("Error initializing view counts:", error)
    throw error
  }
}

async function main() {
  console.log("=== Starting backfill process ===\n")

  await initializeProductViewCounts()
  console.log()

  await backfillMonthlyStats()

  console.log("\n=== Backfill process completed ===")
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
