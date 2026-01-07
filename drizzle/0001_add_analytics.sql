ALTER TABLE "products" ADD COLUMN "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "last_viewed_at" timestamp;--> statement-breakpoint
CREATE TABLE "product_view_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	"session_id" varchar(255),
	"user_id" integer
);--> statement-breakpoint
CREATE TABLE "monthly_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" varchar(7) NOT NULL,
	"products_count" integer DEFAULT 0,
	"blog_posts_count" integer DEFAULT 0,
	"users_count" integer DEFAULT 0,
	"total_views" integer DEFAULT 0,
	"new_products" integer DEFAULT 0,
	"new_blog_posts" integer DEFAULT 0,
	"new_users" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "monthly_stats_month_unique" UNIQUE("month")
);--> statement-breakpoint
ALTER TABLE "product_view_history" ADD CONSTRAINT "product_view_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view_history" ADD CONSTRAINT "product_view_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
