
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import pkg from "pg";

const { Client } = pkg;

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();

  const db = drizzle(client);

  console.log("⏳ Dropping all tables...");

  await db.execute(sql`DROP TABLE IF EXISTS "activity_logs" CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS "product_images" CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS "blog_posts" CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS "products" CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS "collections" CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS "privacy_policy" CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS "terms_of_service" CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS "drizzle_migrations" CASCADE;`);

  console.log("🎉 All tables dropped successfully!");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
