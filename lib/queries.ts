import "server-only"
import { db } from "@/lib/db"
import { products, blogPosts, collections, privacyPolicy, termsOfService } from "@/lib/db/schema"
import { desc, eq, sql, asc, or } from "drizzle-orm"

/**
 * Fetches featured products.
 * @returns A promise that resolves to an array of featured products with their images.
 */
export async function getFeaturedProducts() {
  console.log("Fetching featured products...")
  const data = await db.query.products.findMany({
    where: eq(products.featured, true),
    orderBy: desc(products.createdAt),
    limit: 3,
    with: {
      images: {
        columns: {
          url: true,
        },
        limit: 1,
      },
    },
  })
  console.log(`Found ${data.length} featured products.`)
  return data
}

/**
 * Fetches best-selling products.
 * As there's no "best-seller" metric, it fetches products with high stock.
 * @returns A promise that resolves to an array of best-selling products with their images.
 */
export async function getBestSellers() {
  console.log("Fetching best sellers...")
  const data = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    limit: 6,
    with: {
      images: {
        columns: {
          url: true,
        },
        limit: 1,
      },
    },
  })
  console.log(`Found ${data.length} best sellers.`)
  return data
}

/**
 * Fetches the latest blog posts.
 * @returns A promise that resolves to an array of published blog posts.
 */
export async function getBlogPosts() {
  console.log("Fetching blog posts...")
  const data = await db.query.blogPosts.findMany({
    where: eq(blogPosts.published, true),
    orderBy: desc(blogPosts.publishedAt),
    limit: 3,
  })
  console.log(`Found ${data.length} blog posts.`)
  return data
}

/**
 * Fetches all collections with their product counts.
 * @returns A promise that resolves to an array of collections with product counts.
 */
export async function getAllCollections() {
  console.log("Fetching all collections...")
  // This is a bit more complex. We need to do a join with a count.
  // Drizzle doesn't have a simple way to do this with the query API yet,
  // so we can use a subquery with `sql`.
  const data = await db
    .select({
      id: collections.id,
      slug: collections.slug,
      name: collections.name,
      description: collections.description,
      image: collections.image,
      itemCount: sql<number>`cast(count(${products.id}) as int)`,
    })
    .from(collections)
    .leftJoin(products, eq(collections.id, products.collectionId))
    .groupBy(collections.id)
    .orderBy(desc(collections.name))

  console.log(`Found ${data.length} collections.`)
  return data
}

/**
 * Fetches a single collection by its slug.
 * @param slug The slug of the collection to fetch.
 * @returns A promise that resolves to the collection object or undefined if not found.
 */
export async function getCollectionBySlug(slug: string) {
  console.log(`Fetching collection by slug: ${slug}...`)
  const data = await db.query.collections.findFirst({
    where: eq(collections.slug, slug),
  })
  return data
}

/**
 * Fetches products for a given collection slug.
 * @param collectionSlug The slug of the collection.
 * @returns A promise that resolves to an array of products in that collection.
 */
export async function getProductsByCollection(
  collectionSlug: string,
  options?: {
    sortBy?: string,
    minPrice?: number,
    maxPrice?: number,
    colors?: string[],
    materials?: string[],
  }
) {
  console.log(
    `Fetching products for collection: ${collectionSlug} with filters: ${JSON.stringify(options)}`
  )

  let orderBy: any[] = [
    desc(products.featured),
    desc(products.createdAt),
  ]

  switch (options?.sortBy) {
    case "price-low":
      orderBy = [asc(products.price), desc(products.createdAt)]
      break
    case "price-high":
      orderBy = [desc(products.price), desc(products.createdAt)]
      break
    case "newest":
      orderBy = [desc(products.createdAt)]
      break
  }

  const whereConditions: any[] = [
    eq(
      products.collectionId,
      db
        .select({ id: collections.id })
        .from(collections)
        .where(eq(collections.slug, collectionSlug))
    ),
  ]

  if (options?.minPrice !== undefined) {
    whereConditions.push(sql`${products.price} >= ${options.minPrice}`)
  }
  if (options?.maxPrice !== undefined) {
    whereConditions.push(sql`${products.price} <= ${options.maxPrice}`)
  }
  if (options?.colors && options.colors.length > 0) {
    const colorConditions = options.colors.map(color => sql`${products.color} = ${color}`)
    whereConditions.push(or(...colorConditions))
  }
  if (options?.materials && options.materials.length > 0) {
    const materialConditions = options.materials.map(material => sql`${products.material} = ${material}`)
    whereConditions.push(or(...materialConditions))
  }

  const data = await db.query.products.findMany({
    where: (products, { and }) => and(...whereConditions),
    orderBy: orderBy,
    with: {
      images: {
        columns: {
          url: true,
        },
        limit: 1,
      },
    },
  })
  console.log(`Found ${data.length} products for collection ${collectionSlug}.`)
  return data
}

/**
 * Fetches a single product by its ID.
 * @param id The ID of the product to fetch.
 * @returns A promise that resolves to the product object with its images and collection info.
 */
export async function getProductById(id: string) {
  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    return null
  }
  console.log(`Fetching product by id: ${productId}...`)
  const data = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      images: true,
      collection: {
        columns: {
          name: true,
          slug: true,
        },
      },
    },
  })
  return data
}

/**
 * Fetches related products from the same collection.
 * @param collectionId The ID of the collection to fetch from.
 * @param currentProductId The ID of the product to exclude from the results.
 * @returns A promise that resolves to an array of related products.
 */
export async function getRelatedProducts(collectionId: string, currentProductId: string) {
  const collId = parseInt(collectionId, 10)
  const prodId = parseInt(currentProductId, 10)
  if (isNaN(collId) || isNaN(prodId)) {
    return []
  }
  console.log(`Fetching related products for collection: ${collId}...`)
  const data = await db.query.products.findMany({
    where: (products, { and, ne }) =>
      and(
        eq(products.collectionId, collId),
        ne(products.id, prodId)
      ),
    limit: 3,
    with: {
      images: {
        columns: {
          url: true,
        },
        limit: 1,
      },
    },
  })
  console.log(`Found ${data.length} related products.`)
  return data
}

/**
 * Fetches all products for the dashboard.
 * @returns A promise that resolves to an array of all products with their collection info.
 */
export async function getAllProducts() {
  console.log("Fetching all products for dashboard...")
  const data = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
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
  console.log(`Found ${data.length} products.`)
  return data
}

/**
 * Fetches all products with optional filters.
 * @returns A promise that resolves to an array of all products with filters applied.
 */
export async function getAllProductsWithFilters(options?: {
  sortBy?: string,
  minPrice?: number,
  maxPrice?: number,
  colors?: string[],
  materials?: string[],
}) {
  console.log(`Fetching all products with filters: ${JSON.stringify(options)}`)

  let orderBy: any[] = [
    desc(products.featured),
    desc(products.createdAt),
  ]

  switch (options?.sortBy) {
    case "price-low":
      orderBy = [asc(products.price), desc(products.createdAt)]
      break
    case "price-high":
      orderBy = [desc(products.price), desc(products.createdAt)]
      break
    case "newest":
      orderBy = [desc(products.createdAt)]
      break
  }

  const whereConditions: any[] = []

  if (options?.minPrice !== undefined) {
    whereConditions.push(sql`${products.price} >= ${options.minPrice}`)
  }
  if (options?.maxPrice !== undefined) {
    whereConditions.push(sql`${products.price} <= ${options.maxPrice}`)
  }
  if (options?.colors && options.colors.length > 0) {
    const colorConditions = options.colors.map(color => sql`${products.color} = ${color}`)
    whereConditions.push(or(...colorConditions))
  }
  if (options?.materials && options.materials.length > 0) {
    const materialConditions = options.materials.map(material => sql`${products.material} = ${material}`)
    whereConditions.push(or(...materialConditions))
  }

  const data = await db.query.products.findMany({
    where: (products, { and }) => and(...whereConditions),
    orderBy: orderBy,
    with: {
      images: {
        columns: {
          url: true,
        },
        limit: 1,
      },
    },
  })
  console.log(`Found ${data.length} products with filters.`)
  return data
}

/**
 * Fetches collections for use in forms (e.g., product creation/edit).
 * @returns A promise that resolves to an array of collections with only id, name, and slug.
 */
export async function getCollectionsForForm() {
  console.log("Fetching collections for form...")
  const data = await db.query.collections.findMany({
    columns: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: [collections.name],
  })
  console.log(`Found ${data.length} collections for form.`)
  return data
}

/**
 * Fetches all collections for the dashboard.
 * @returns A promise that resolves to an array of all collections.
 */
export async function getAllCollectionsForDashboard() {
  console.log("Fetching all collections for dashboard...")
  const data = await db.query.collections.findMany({
    orderBy: [collections.name],
  })
  console.log(`Found ${data.length} collections for dashboard.`)
  return data
}

/**
 * Fetches a single collection by its ID.
 * @param id The ID of the collection to fetch.
 * @returns A promise that resolves to the collection object or undefined if not found.
 */
export async function getCollectionById(id: string) {
  const collectionId = parseInt(id, 10)
  if (isNaN(collectionId)) {
    return null
  }
  console.log(`Fetching collection by ID: ${collectionId}...`)
  const data = await db.query.collections.findFirst({
    where: eq(collections.id, collectionId),
  })
  return data
}

/**
 * Fetches the privacy policy (single record).
 * @returns A promise that resolves to the privacy policy object or null if not found.
 */
export async function getPrivacyPolicy() {
  console.log("Fetching privacy policy...")
  const data = await db.query.privacyPolicy.findFirst()
  return data
}

/**
 * Updates the privacy policy (single record).
 * @param data The privacy policy data to update.
 * @returns A promise that resolves to the updated privacy policy.
 */
export async function updatePrivacyPolicy(data: {
  title: string
  content: string
  effectiveDate: Date
}) {
  console.log("Updating privacy policy...")
  const existing = await db.query.privacyPolicy.findFirst()

  if (existing) {
    const [updated] = await db
      .update(privacyPolicy)
      .set({
        title: data.title,
        content: data.content,
        effectiveDate: data.effectiveDate,
        updatedAt: new Date(),
      })
      .where(eq(privacyPolicy.id, existing.id))
      .returning()
    return updated
  } else {
    const [created] = await db
      .insert(privacyPolicy)
      .values(data)
      .returning()
    return created
  }
}

/**
 * Fetches the terms of service (single record).
 * @returns A promise that resolves to the terms of service object or null if not found.
 */
export async function getTermsOfService() {
  console.log("Fetching terms of service...")
  const data = await db.query.termsOfService.findFirst()
  return data
}

/**
 * Updates the terms of service (single record).
 * @param data The terms of service data to update.
 * @returns A promise that resolves to the updated terms of service.
 */
export async function updateTermsOfService(data: {
  title: string
  content: string
  effectiveDate: Date
}) {
  console.log("Updating terms of service...")
  const existing = await db.query.termsOfService.findFirst()

  if (existing) {
    const [updated] = await db
      .update(termsOfService)
      .set({
        title: data.title,
        content: data.content,
        effectiveDate: data.effectiveDate,
        updatedAt: new Date(),
      })
      .where(eq(termsOfService.id, existing.id))
      .returning()
    return updated
  } else {
    const [created] = await db
      .insert(termsOfService)
      .values(data)
      .returning()
    return created
  }
}


