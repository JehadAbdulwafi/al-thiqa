"use server"

import { db } from "@/lib/db"
import { products, productViewHistory, monthlyStats, blogPosts, users } from "@/lib/db/schema"
import { eq, sql, and, gte } from "drizzle-orm"
import { cookies } from "next/headers"

export async function trackProductView(productId: number) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session_id")?.value

    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const recentView = await db.query.productViewHistory.findFirst({
      where: and(
        eq(productViewHistory.productId, productId),
        sessionId
          ? eq(productViewHistory.sessionId, sessionId)
          : sql`TRUE`,
        gte(productViewHistory.viewedAt, oneDayAgo)
      ),
    })

    if (recentView) {
      return
    }

    await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          viewCount: sql`${products.viewCount} + 1`,
          lastViewedAt: now,
        })
        .where(eq(products.id, productId))

      await tx.insert(productViewHistory).values({
        productId,
        viewedAt: now,
        sessionId: sessionId || null,
      })
    })
  } catch (error) {
    console.error("Error tracking product view:", error)
  }
}

export async function recordMonthlyStats() {
  const now = new Date()
  const monthStr = now.toISOString().slice(0, 7)

  const existing = await db.query.monthlyStats.findFirst({
    where: eq(monthlyStats.month, monthStr),
  })

  if (existing) {
    return {
      success: true,
      message: `Stats for ${monthStr} already exist`,
    }
  }

  const monthStart = new Date(`${monthStr}-01`)
  const monthEnd = new Date(now)
  monthEnd.setDate(monthEnd.getDate() - 1)
  monthEnd.setHours(23, 59, 59, 999)

  const [productsCount] = await db
    .select({ count: sql`count(*)` })
    .from(products)

  const [blogPostsCount] = await db
    .select({ count: sql`count(*)` })
    .from(blogPosts)

  const [usersCount] = await db
    .select({ count: sql`count(*)` })
    .from(users)

  const [totalViews] = await db
    .select({ total: sql`coalesce(sum(${products.viewCount}), 0)` })
    .from(products)

  const [newProducts] = await db
    .select({ count: sql`count(*)` })
    .from(products)
    .where(and(gte(products.createdAt, monthStart)))

  const [newBlogPosts] = await db
    .select({ count: sql`count(*)` })
    .from(blogPosts)
    .where(and(gte(blogPosts.createdAt, monthStart)))

  const [newUsers] = await db
    .select({ count: sql`count(*)` })
    .from(users)
    .where(and(gte(users.createdAt, monthStart)))

  await db.insert(monthlyStats).values({
    month: monthStr,
    productsCount: productsCount.count || 0,
    blogPostsCount: blogPostsCount.count || 0,
    usersCount: usersCount.count || 0,
    totalViews: totalViews.total || 0,
    newProducts: newProducts.count || 0,
    newBlogPosts: newBlogPosts.count || 0,
    newUsers: newUsers.count || 0,
  })

  return {
    success: true,
    message: `Successfully recorded stats for ${monthStr}`,
  }
}
