"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db/index"
import { activityLogs, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import type { InferSelectModel } from "drizzle-orm"

export type ActivityLog = InferSelectModel<typeof activityLogs>

export async function logActivity(
  action: string,
  resourceType: string | null = null,
  resourceId: string | null = null,
  details: string | null = null,
) {
  const session = await auth()
  if (!session?.user?.id) return

  await db.insert(activityLogs).values({
    userId: session.user.id,
    action,
    resourceType,
    resourceId,
    details,
    createdAt: new Date(),
  })
}

export async function getActivityLogs(limit = 50) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Role is now available directly in the session
  const isAdmin = session.user.role === "ADMIN"

  // Base query with join
  const query = db
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

  let logs: ActivityLog[]

  if (isAdmin) {
    logs = await query
  } else {
    logs = await query.where(eq(activityLogs.userId, session.user.id))
  }

  return logs
}

