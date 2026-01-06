import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import {
  blogPosts,
  collections,
  productImages,
  products,
  users,
  privacyPolicy,
  termsOfService,
} from "../lib/db/schema"
import pkg from "pg"
import bcrypt from "bcryptjs"
import { seedBlogPosts, seedCollections, seedProducts } from "@/lib/seed-data"

const { Client } = pkg

// Arabic to English material mapping
const materialMapping: Record<string, "wood" | "metal" | "glass" | "fabric" | "leather" | "plastic" | "ceramic" | "stone" | "other"> = {
  "خشب": "wood",
  "قماش": "fabric",
  "جلد": "leather",
  "معدن": "metal",
  "زجاج": "glass",
  "بلاستيك": "plastic",
  "سيراميك": "ceramic",
  "حجر": "stone",
  "قماش وخشب": "fabric", // Use primary material
  "خشب وجلد": "wood", // Use primary material
  "قماش ومعدن": "fabric", // Use primary material
}

// Arabic to English color mapping
const colorMapping: Record<string, "white" | "black" | "gray" | "brown" | "beige" | "red" | "blue" | "green" | "yellow" | "pink" | "purple" | "orange" | "gold" | "silver" | "other"> = {
  "أبيض": "white",
  "أسود": "black",
  "رمادي": "gray",
  "بني": "brown",
  "بيج": "beige",
  "أحمر": "red",
  "أزرق": "blue",
  "أخضر": "green",
  "أصفر": "yellow",
  "وردي": "pink",
  "بنفسجي": "purple",
  "برتقالي": "orange",
  "ذهبي": "gold",
  "فضي": "silver",
  "أخرى": "other",
}

function mapMaterial(arabicMaterial: string): "wood" | "metal" | "glass" | "fabric" | "leather" | "plastic" | "ceramic" | "stone" | "other" {
  return materialMapping[arabicMaterial] || "other"
}

function mapColor(arabicColor: string): "white" | "black" | "gray" | "brown" | "beige" | "red" | "blue" | "green" | "yellow" | "pink" | "purple" | "orange" | "gold" | "silver" | "other" {
  return colorMapping[arabicColor] || "other"
}

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
    const specs = product.specs as any
    return {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString(),
      collectionId: collection.id,
      featured: product.featured,
      // The detailed product has extra fields
      ...(specs && {
        material: mapMaterial(specs["المادة"]),
        color: mapColor(specs["اللون"]),
        weight: specs["الوزن"]?.replace(" كجم", ""),
        dimensions: {
          value: specs["الأبعاد"],
        },
      }),
      // Default values for products without specs
      ...(specs ? {} : {
        material: "wood",
        color: "brown",
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
    const seededProduct = seededProducts.find((p) => p.name === product.name)
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

  // --- Seed Privacy Policy ---
  console.log("🔒 Seeding privacy policy...")
  const seededPrivacyPolicy = await db
    .insert(privacyPolicy)
    .values({
      title: "سياسة الخصوصية",
      content: "نحن في شركة الأثقة نلتزم بحماية خصوصيتك. سياسة الخصوصية هذه توضح كيف نقوم بجمع واستخدام ومشاركة معلوماتك الشخصية.",
      effectiveDate: new Date(),
    })
    .returning()
  console.log(`✅ Seeded ${seededPrivacyPolicy.length} privacy policy.`)

  // --- Seed Terms of Service ---
  console.log("⚖️ Seeding terms of service...")
  const seededTermsOfService = await db
    .insert(termsOfService)
    .values({
      title: "شروط الخدمة",
      content: "استخدامك لموقعنا يعني موافقتك على هذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا.",
      effectiveDate: new Date(),
    })
    .returning()
  console.log(`✅ Seeded ${seededTermsOfService.length} terms of service.`)

  console.log("🎉 Seeding completed successfully!")
  await client.end()
}

main().catch((err) => {
  console.error("❌ Seeding failed:")
  console.error(err)
  process.exit(1)
})