"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db/index"
import { users, activityLogs } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { eq, desc, and, ne } from "drizzle-orm"

export async function getUsers() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Role is now available directly in the session
  if (session.user.role !== "ADMIN")
    throw new Error("Unauthorized: Admin access required")

  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: "ADMIN" | "USER"
}) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Role is now available directly in the session
  if (session.user.role !== "ADMIN")
    throw new Error("Unauthorized: Admin access required")

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, data.email))

  if (existing.length > 0) throw new Error("Email already exists")

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const id = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`

  await db.insert(users).values({
    id,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  })

  await db.insert(activityLogs).values({
    userId: session.user.id,
    action: "CREATE",
    resourceType: "USER",
    resourceId: id,
    details: `Created user: ${data.email}`,
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function updateUser(
  userId: string,
  data: { name: string; email: string; role: "ADMIN" | "USER" }
) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Role is now available directly in the session
  if (session.user.role !== "ADMIN")
    throw new Error("Unauthorized: Admin access required")

  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      role: data.role,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  await db.insert(activityLogs).values({
    userId: session.user.id,
    action: "UPDATE",
    resourceType: "USER",
    resourceId: userId,
    details: `Updated user: ${data.email}`,
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteUser(userId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // Role is now available directly in the session
  if (session.user.role !== "ADMIN")
    throw new Error("Unauthorized: Admin access required")

  if (userId === session.user.id)
    throw new Error("Cannot delete your own account")

  const [user] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))

  await db.delete(users).where(eq(users.id, userId))

  await db.insert(activityLogs).values({
    userId: session.user.id,
    action: "DELETE",
    resourceType: "USER",
    resourceId: userId,
    details: `Deleted user: ${user?.email ?? "unknown"}`,
  })

  revalidatePath("/admin/users")
  return { success: true }
}

