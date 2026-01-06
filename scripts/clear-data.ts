
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, products, collections, productImages, blogPosts, activityLogs, privacyPolicy, termsOfService } from "../lib/db/schema";
import pkg from "pg";

const { Client } = pkg;

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();

  const db = drizzle(client);

  console.log("⏳ Clearing all data from tables...");
  await db.delete(activityLogs);
  await db.delete(blogPosts);
  await db.delete(productImages);
  await db.delete(products);
  await db.delete(collections);
  await db.delete(privacyPolicy);
  await db.delete(termsOfService);
  await db.delete(users);

  console.log("🎉 All data cleared successfully!");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
