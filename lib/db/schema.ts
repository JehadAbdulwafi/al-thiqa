import { relations } from "drizzle-orm"
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
  serial,
  boolean,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core"

// Enums
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "EDITOR"])

// Materials enum
export const materialEnum = pgEnum("material", [
  "wood",
  "metal",
  "glass",
  "fabric",
  "leather",
  "plastic",
  "ceramic",
  "stone",
  "other",
])

// Colors enum
export const colorEnum = pgEnum("color", [
  "white",
  "black",
  "gray",
  "brown",
  "beige",
  "red",
  "blue",
  "green",
  "yellow",
  "pink",
  "purple",
  "orange",
  "gold",
  "silver",
  "other",
])

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").notNull().default("EDITOR"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Collections/Categories table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").references(() => collections.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  sku: varchar("sku", { length: 100 }),
  material: materialEnum("material").notNull(),
  color: colorEnum("color").notNull(),
  dimensions: jsonb("dimensions"), // {width, height, depth, unit}
  weight: decimal("weight", { precision: 8, scale: 2 }),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  viewCount: integer("view_count").default(0),
  lastViewedAt: timestamp("last_viewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Product Images table
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Blog Posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  authorId: integer("author_id").references(() => users.id),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Banners table
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  cta: varchar("cta", { length: 255 }),
  image: text("image").notNull(),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Privacy Policy table - Single record policy that can only be updated
export const privacyPolicy = pgTable("privacy_policy", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  effectiveDate: timestamp("effective_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Terms of Service table - Single record that can only be updated
export const termsOfService = pgTable("terms_of_service", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  effectiveDate: timestamp("effective_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Activity Logs table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action").notNull(),
  resourceType: varchar("resource_type"),
  resourceId: varchar("resource_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Users relations
export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
}))

// Collections relations
export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(products),
}))

// Products relations
export const productsRelations = relations(products, ({ one, many }) => ({
  collection: one(collections, {
    fields: [products.collectionId],
    references: [collections.id],
  }),
  images: many(productImages),
}))

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}))

// Product Images relations
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

// Blog Posts relations
export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}))

