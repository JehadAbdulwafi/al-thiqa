"use server"

import { db } from "@/lib/db"
import { productImages, products } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

// Schema for validating product creation/update - must match frontend form
const productSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  slug: z.string().min(1, "الرابط اللطيف مطلوب"),
  description: z.string().nullable(),
  price: z.number().positive("السعر يجب أن يكون موجباً"),
  compareAtPrice: z.number().positive("السعر يجب أن يكون موجباً").optional().nullable(),
  stock: z.number().int().min(0, "المخزون لا يمكن أن يكون سالباً"),
  collectionId: z.number().int().positive("يجب اختيار تصنيف").optional().nullable(),
  material: z.string().nullable(),
  color: z.string().nullable(),
  dimensions: z.string().nullable(), // Store as stringified JSON
  weight: z.number().positive("الوزن يجب أن يكون موجباً").optional().nullable(),
  featured: z.boolean().default(false),
  imageUrls: z.array(z.string().url("يجب أن يكون رابط URL صحيحاً")).optional(),
})

type ProductData = z.infer<typeof productSchema>

// Action to create a new product
export async function createProduct(data: ProductData) {
  const parsed = productSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("Failed to create product due to validation errors.")
  }

  try {
    const { imageUrls, ...productData } = parsed.data // Extract imageUrls
    const [newProduct] = await db.insert(products).values(productData).returning()

    if (newProduct && parsed.data.imageUrls && parsed.data.imageUrls.length > 0) {
      const imagesToInsert = parsed.data.imageUrls
        .filter(url => url) // Filter out empty strings
        .map((url, index) => ({
          productId: newProduct.id,
          url,
          order: index + 1,
        }))
      if (imagesToInsert.length > 0) {
        await db.insert(productImages).values(imagesToInsert)
      }
    }
  } catch (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product.")
  }

  revalidatePath("/dashboard/products")
  redirect("/dashboard/products")
}

// Action to update an existing product
export async function updateProduct(id: number, data: ProductData) {
  const parsed = productSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("Failed to update product due to validation errors.")
  }

  try {
    const { imageUrls, ...productData } = parsed.data // Extract imageUrls
    await db.update(products).set(productData).where(eq(products.id, id))

    // Handle images: delete existing and insert new ones
    await db.delete(productImages).where(eq(productImages.productId, id))
    if (parsed.data.imageUrls && parsed.data.imageUrls.length > 0) {
      const imagesToInsert = parsed.data.imageUrls
        .filter(url => url) // Filter out empty strings
        .map((url, index) => ({
          productId: id,
          url,
          order: index + 1,
        }))
      if (imagesToInsert.length > 0) {
        await db.insert(productImages).values(imagesToInsert)
      }
    }
  } catch (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product.")
  }

  revalidatePath("/dashboard/products")
  revalidatePath(`/products/${data.slug}`)
  redirect("/dashboard/products")
}

// Action to delete a product
export async function deleteProduct(id: number) {
  try {
    // Delete associated images first due to foreign key constraint
    await db.delete(productImages).where(eq(productImages.productId, id))
    await db.delete(products).where(eq(products.id, id))
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product.")
  }

  revalidatePath("/dashboard/products")
}
