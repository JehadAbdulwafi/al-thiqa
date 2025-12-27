"use server"

import { redirect } from "next/navigation"
import { createSession, deleteSession, verifyCredentials } from "@/lib/auth"
import { logActivity } from "./activity"

export async function login(formData: FormData) {
  console.log("Login attempt started")
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    console.log("Missing email or password")
    return { error: "Email and password are required" }
  }

  console.log("Verifying credentials for:", email)

  try {
    const user = await verifyCredentials(email, password)
    console.log("User found:", user ? "yes" : "no")

    if (!user) {
      return { error: "Invalid email or password" }
    }

    await createSession(user)

    await logActivity("LOGIN", null, null, `User logged in: ${email}`)

    console.log("Session created, redirecting to dashboard")
    redirect("/dashboard")
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error
    }
    if (error?.message === "DATABASE_NOT_INITIALIZED") {
      return {
        error:
          "Database not initialized. Please run the SQL scripts: 001-create-tables.sql, 002-seed-data.sql, and 003-add-user-roles-and-activity.sql",
      }
    }
    console.error("Login error:", error)
    return { error: "An error occurred during login. Please try again." }
  }
}

export async function logout() {
  await logActivity("LOGOUT", null, null, "User logged out")

  await deleteSession()
  redirect("/login")
}
