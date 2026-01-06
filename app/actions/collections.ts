"use server"

import { db } from "@/lib/db"
import { collections } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { slugify } from "@/lib/utils"
import { logActivity } from "./activity"

// Schema for validating collection creation/update
const collectionSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  slug: z.string().optional(), // Make slug optional
  description: z.string().nullable(),
  image: z.string().nullable(),
  featured: z.boolean().default(false),
})

type CollectionData = z.infer<typeof collectionSchema>

// Action to create a new collection
export async function createCollection(data: CollectionData) {
  const parsed = collectionSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("Failed to create collection due to validation errors.")
  }

  let collectionData = parsed.data

  if (!collectionData.slug) {
    collectionData.slug = slugify(collectionData.name)
  }

  try {
    await db.insert(collections).values(collectionData)
  } catch (error) {
    console.error("Error creating collection:", error)
    throw new Error("Failed to create collection.")
  }

  await logActivity("CREATE", "COLLECTION", null, `Created collection: ${collectionData.name}`)
  revalidatePath("/dashboard/collections")
  redirect("/dashboard/collections")
}

// Action to update an existing collection
export async function updateCollection(id: number, data: CollectionData) {
  const parsed = collectionSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("Failed to update collection due to validation errors.")
  }

  let collectionData = parsed.data
  if (!collectionData.slug) {
    collectionData.slug = slugify(collectionData.name)
  }

  try {
    await db.update(collections).set(collectionData).where(eq(collections.id, id))
  } catch (error) {
    console.error("Error updating collection:", error)
    throw new Error("Failed to update collection.")
  }

  await logActivity("UPDATE", "COLLECTION", id.toString(), `Updated collection: ${collectionData.name}`)
  revalidatePath("/dashboard/collections")
  redirect("/dashboard/collections")
}

// Action to delete a collection
export async function deleteCollection(id: number) {
  try {
    await db.delete(collections).where(eq(collections.id, id))
  } catch (error) {
    console.error("Error deleting collection:", error)
    throw new Error("Failed to delete collection.")
  }

  await logActivity("DELETE", "COLLECTION", id.toString(), `Deleted collection`)
  revalidatePath("/dashboard/collections")
}

