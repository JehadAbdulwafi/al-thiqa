import "server-only"

import { db } from "@/lib/db"
import {
  products,
  blogPosts,
  collections,
  users,
  monthlyStats,
  activityLogs,
} from "@/lib/db/schema"
import { count, desc, eq, sql, and, gte, lte, or } from "drizzle-orm"
import { subMonths, format } from "date-fns"

export interface DashboardStats {
  products: { count: number; change: number }
  collections: { count: number; change: number }
  blogPosts: { count: number; change: number }
  users: { count: number; change: number }
  views: { count: number; change: number }
}

export interface TrendData {
  month: string
  views: number
  products: number
  blogPosts: number
}

export interface PendingTasks {
  unpublishedBlogPosts: number
  unpublishedProducts: number
  inactiveBanners: number
}

export interface ActivityWithUser {
  id: number
  userId: number
  action: string
  resourceType: string | null
  resourceId: string | null
  details: string | null
  createdAt: Date
  userName: string | null
  userEmail: string
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [productsResult, collectionsResult, blogPostsResult, usersResult, viewsResult] =
    await Promise.all([
      db.select({ count: count() }).from(products),
      db.select({ count: count() }).from(collections),
      db.select({ count: count() }).from(blogPosts),
      db.select({ count: count() }).from(users),
      db
        .select({
          total: sql<number>`coalesce(sum(${products.viewCount}), 0)`,
        })
        .from(products),
    ])

  const comparison = await getStatsComparison()

  return {
    products: {
      count: productsResult[0].count,
      change: comparison.products,
    },
    collections: {
      count: collectionsResult[0].count,
      change: comparison.collections,
    },
    blogPosts: {
      count: blogPostsResult[0].count,
      change: comparison.blogPosts,
    },
    users: {
      count: usersResult[0].count,
      change: comparison.users,
    },
    views: {
      count: viewsResult[0].total || 0,
      change: comparison.views,
    },
  }
}

export async function getStatsComparison(): Promise<{
  products: number
  collections: number
  blogPosts: number
  users: number
  views: number
}> {
  const currentMonth = new Date()
  const previousMonth = subMonths(currentMonth, 1)

  const currentMonthStr = format(currentMonth, "yyyy-MM")
  const previousMonthStr = format(previousMonth, "yyyy-MM")

  const [currentStats, previousStats] = await Promise.all([
    db.query.monthlyStats.findFirst({
      where: eq(monthlyStats.month, currentMonthStr),
    }),
    db.query.monthlyStats.findFirst({
      where: eq(monthlyStats.month, previousMonthStr),
    }),
  ])

  if (!previousStats) {
    return {
      products: 0,
      collections: 0,
      blogPosts: 0,
      users: 0,
      views: 0,
    }
  }

  if (!currentStats) {
    return {
      products: -(previousStats.newProducts || 0),
      collections: 0,
      blogPosts: -(previousStats.newBlogPosts || 0),
      users: -(previousStats.newUsers || 0),
      views: 0,
    }
  }

  const productsChange =
    (currentStats.newProducts || 0) - (previousStats.newProducts || 0)
  const blogPostsChange =
    (currentStats.newBlogPosts || 0) - (previousStats.newBlogPosts || 0)
  const usersChange = (currentStats.newUsers || 0) - (previousStats.newUsers || 0)

  return {
    products: productsChange,
    collections: 0,
    blogPosts: blogPostsChange,
    users: usersChange,
    views: (currentStats.totalViews || 0) - (previousStats.totalViews || 0),
  }
}

export async function getMonthlyTrends(months: number = 7): Promise<TrendData[]> {
  const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ]

  const data = await db
    .select({
      month: monthlyStats.month,
      productsCount: monthlyStats.productsCount,
      blogPostsCount: monthlyStats.blogPostsCount,
      totalViews: monthlyStats.totalViews,
    })
    .from(monthlyStats)
    .orderBy(desc(monthlyStats.month))
    .limit(months)

  return data
    .reverse()
    .map((item) => {
      const [year, monthNum] = item.month.split("-")
      const monthName = arabicMonths[parseInt(monthNum, 10) - 1]
      return {
        month: monthName,
        views: item.totalViews || 0,
        products: item.productsCount || 0,
        blogPosts: item.blogPostsCount || 0,
      }
    })
}

export async function getTopProducts(limit: number = 5) {
  const data = await db.query.products.findMany({
    orderBy: [desc(products.viewCount), desc(products.featured)],
    limit,
    with: {
      collection: {
        columns: {
          name: true,
        },
      },
      images: {
        columns: {
          url: true,
        },
        limit: 1,
      },
    },
  })

  return data.map((product) => ({
    id: product.id,
    name: product.name,
    views: product.viewCount || 0,
    featured: product.featured,
    collection: product.collection?.name,
    image: product.images[0]?.url,
  }))
}

export async function getRecentActivity(limit: number = 10): Promise<ActivityWithUser[]> {
  const data = await db
    .select({
      id: activityLogs.id,
      userId: activityLogs.userId,
      action: activityLogs.action,
      resourceType: activityLogs.resourceType,
      resourceId: activityLogs.resourceId,
      details: activityLogs.details,
      createdAt: activityLogs.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(activityLogs)
    .innerJoin(users, eq(activityLogs.userId, users.id))
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit)

  return data
}

export async function getPendingTasks(): Promise<PendingTasks> {
  const [unpublishedBlogPostsResult, unpublishedProductsResult, inactiveBannersResult] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(blogPosts)
        .where(eq(blogPosts.published, false)),
      db
        .select({ count: count() })
        .from(products)
        .where(eq(products.published, false)),
      db.select({ count: count() }).from(products), // Assuming active products
    ])

  return {
    unpublishedBlogPosts: unpublishedBlogPostsResult[0].count,
    unpublishedProducts: unpublishedProductsResult[0].count,
    inactiveBanners: 0, // We'll calculate this if we add an banners.isActive field
  }
}

export async function getActivitySummary() {
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = subMonths(today, 1)

  const [todayResult, weekResult, monthResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(activityLogs)
      .where(
        and(
          gte(activityLogs.createdAt, new Date(today.setHours(0, 0, 0, 0)))
        )
      ),
    db
      .select({ count: count() })
      .from(activityLogs)
      .where(gte(activityLogs.createdAt, weekAgo)),
    db
      .select({ count: count() })
      .from(activityLogs)
      .where(gte(activityLogs.createdAt, monthAgo)),
  ])

  const actionBreakdown = await db
    .select({
      action: activityLogs.action,
      count: count(),
    })
    .from(activityLogs)
    .where(gte(activityLogs.createdAt, monthAgo))
    .groupBy(activityLogs.action)

  const topUsers = await db
    .select({
      userName: users.name,
      count: count(),
    })
    .from(activityLogs)
    .innerJoin(users, eq(activityLogs.userId, users.id))
    .where(gte(activityLogs.createdAt, monthAgo))
    .groupBy(users.name)
    .orderBy(desc(count()))
    .limit(3)

  return {
    today: todayResult[0].count,
    thisWeek: weekResult[0].count,
    thisMonth: monthResult[0].count,
    actionBreakdown: actionBreakdown.reduce(
      (acc, item) => {
        acc[item.action] = item.count
        return acc
      },
      {} as Record<string, number>
    ),
    topUsers: topUsers.map((u) => ({
      name: u.userName || "Unknown",
      count: u.count,
    })),
  }
}

export async function getUserActivityByRole(months: number = 6) {
  const monthAgo = subMonths(new Date(), months)

  const data = await db
    .select({
      role: users.role,
      count: count(),
    })
    .from(activityLogs)
    .innerJoin(users, eq(activityLogs.userId, users.id))
    .where(gte(activityLogs.createdAt, monthAgo))
    .groupBy(users.role)

  return data.map((item) => ({
    role: item.role === "ADMIN" ? "مدير" : "محرر",
    count: item.count,
  }))
}
