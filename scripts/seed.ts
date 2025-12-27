import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import {
  blogPosts,
  collections,
  productImages,
  products,
  users,
} from "../lib/db/schema"
import pkg from "pg"
import bcrypt from "bcryptjs"
import { seedBlogPosts, seedCollections, seedProducts } from "@/lib/seed-data"

const { Client } = pkg

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL)
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })
  await client.connect()

  const db = drizzle(client)

  console.log("⏳ Clearing existing data...")
  await db.delete(productImages)
  await db.delete(products)
  await db.delete(collections)
  await db.delete(blogPosts)
  await db.delete(users)

  console.log("🌱 Seeding data...")

  // --- Seed Users ---
  console.log("👤 Seeding users...")
  const hashedPassword = await bcrypt.hash("password123", 10)
  const seededUsers = await db
    .insert(users)
    .values([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      },
      {
        name: "Editor User",
        email: "editor@example.com",
        password: hashedPassword,
        role: "EDITOR",
      },
    ])
    .returning()
  console.log(`✅ Seeded ${seededUsers.length} users.`)

  // --- Seed Collections ---
  console.log("📚 Seeding collections...")
  const seededCollections = await db
    .insert(collections)
    .values(seedCollections)
    .returning()
  console.log(`✅ Seeded ${seededCollections.length} collections.`)

  // --- Seed Products ---
  console.log("🛋️ Seeding products...")
  const productsToInsert = seedProducts.map((product) => {
    const collection = seededCollections.find(
      (c) => c.name === product.category
    )
    if (!collection) {
      console.warn(
        `⚠️ Collection not found for product: "${product.name}". Skipping.`
      )
      return null
    }
    return {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString(),
      stock: product.stock,
      collectionId: collection.id,
      featured: product.featured,
      // The detailed product has extra fields
      ...(product.specs && {
        material: (product.specs as any)["المادة"],
        color: (product.specs as any)["اللون"],
        weight: (product.specs as any)["الوزن"]?.replace(" كجم", ""),
        dimensions: {
          value: (product.specs as any)["الأبعاد"],
        },
      }),
    }
  })

  const validProducts = productsToInsert.filter(
    Boolean
  ) as (typeof products.$inferInsert)[]

  const seededProducts = await db
    .insert(products)
    .values(validProducts)
    .returning()
  console.log(`✅ Seeded ${seededProducts.length} products.`)

  // --- Seed Product Images ---
  console.log("🖼️ Seeding product images...")
  const imagesToInsert = []
  for (const product of seedProducts) {
    const seededProduct = seededProducts.find((p) => p.slug === product.slug)
    if (seededProduct && product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        imagesToInsert.push({
          productId: seededProduct.id,
          url: product.images[i],
          order: i + 1,
        })
      }
    }
  }

  if (imagesToInsert.length > 0) {
    await db.insert(productImages).values(imagesToInsert)
    console.log(`✅ Seeded ${imagesToInsert.length} product images.`)
  } else {
    console.log("No product images to seed.")
  }

  // --- Seed Blog Posts ---
  console.log("✍️ Seeding blog posts...")
  const adminUser = seededUsers[0]
  const postsToInsert = seedBlogPosts.map((post) => ({
    ...post,
    authorId: adminUser.id,
  }))
  const seededPosts = await db.insert(blogPosts).values(postsToInsert).returning()
  console.log(`✅ Seeded ${seededPosts.length} blog posts.`)


  console.log("🎉 Seeding completed successfully!")
  await client.end()
}

main().catch((err) => {
  console.error("❌ Seeding failed:")
  console.error(err)
  process.exit(1)
})