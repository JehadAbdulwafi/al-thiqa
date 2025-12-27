"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db/index"
import { users } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { logActivity } from "./activity"
import { eq, and, ne } from "drizzle-orm"

export async function updateProfile(data: { name: string; email: string }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Check if email is already taken by another user
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, data.email), ne(users.id, session.user.id)))

  if (existing.length > 0) {
    throw new Error("Email is already taken")
  }

  // Update name & email
  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))

  await logActivity("UPDATE", "PROFILE", session.user.id, "Updated profile information")

  revalidatePath("/settings")
  return { success: true }
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Fetch current password hash
  const [user] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (!user) throw new Error("User not found")

  const isValid = await bcrypt.compare(data.currentPassword, user.password)
  if (!isValid) throw new Error("Current password is incorrect")

  // Hash new password
  const hashedPassword = await bcrypt.hash(data.newPassword, 10)

  // Update password
  await db
    .update(users)
    .set({
      password: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))

  await logActivity("UPDATE", "PASSWORD", session.user.id, "Changed password")

  return { success: true }
}

export async function updateNotificationPreferences(data: {
  receiveReminderEmails: boolean;
  receiveInAppNotifications: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(users)
    .set({
      receiveReminderEmails: data.receiveReminderEmails,
      receiveInAppNotifications: data.receiveInAppNotifications,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  await logActivity("UPDATE", "NOTIFICATION_PREFERENCES", session.user.id, "Updated notification preferences");

  revalidatePath("/settings");
  return { success: true };
}

