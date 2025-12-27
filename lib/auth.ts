import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db/index" // your drizzle db instance
import { users } from "@/lib/db/schema"
import type { InferSelectModel } from "drizzle-orm"

const SESSION_COOKIE_NAME = "session"

export type User = InferSelectModel<typeof users>

export interface Session {
  user: {
    id: string
    email: string
    name: string
    role: "USER" | "ADMIN" // Add role to session
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) return null

  try {
    const session = JSON.parse(sessionCookie.value) as Session
    return session
  } catch {
    return null
  }
}

export async function createSession(user: User) {
  const session: Session = {
    user: {
      id: user.id.toString(),
      email: user.email,
      name: user.name || "",
      role: user.role, // Include user's role
    },
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return session
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  console.log("[DEBUG] verifyCredentials called with email:", email);

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      console.log("[DEBUG] User not found in database for email:", email);
      return null;
    }

    console.log("[DEBUG] User found in database:", JSON.stringify(user, null, 2));

    if (!user.password) {
      console.log("[DEBUG] User has no password in database.");
      return null;
    }

    console.log("[DEBUG] Comparing provided password with stored hash.");
    const passwordsMatch = await bcrypt.compare(password, user.password);
    console.log("[DEBUG] Password match result:", passwordsMatch);

    if (!passwordsMatch) {
      console.log("[DEBUG] Password does not match.");
      return null;
    }

    console.log("[DEBUG] Password matches. Returning user.");
    return user;
  } catch (error: any) {
    console.error("[DEBUG] Error in verifyCredentials:", JSON.stringify(error, null, 2));
    if (error?.code === "42P01" || error?.message?.includes("does not exist")) {
      console.error("[v0] Database tables not found. Please run the Drizzle migrations first.")
      throw new Error("DATABASE_NOT_INITIALIZED")
    }
    return null
  }
}

export const auth = getSession

