import "server-only"

import { db } from "@/lib/db"
import {
  products,
  blogPosts,
  collections,
  users,
  activityLogs,
} from "@/lib/db/schema"
import { count, desc, eq, sql } from "drizzle-orm"

export interface DashboardStats {
  products: { count: number }
  collections: { count: number }
  blogPosts: { count: number }
  users: { count: number }
  views: { count: number }
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


  return {
    products: {
      count: productsResult[0].count,
    },
    collections: {
      count: collectionsResult[0].count,
    },
    blogPosts: {
      count: blogPostsResult[0].count,
    },
    users: {
      count: usersResult[0].count,
    },
    views: {
      count: viewsResult[0].total || 0,
    },
  }
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
