-- Create privacy_policy table
CREATE TABLE IF NOT EXISTS "privacy_policy" (
	"id" serial PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"effective_date" timestamp NOT NULL,
	"author_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "privacy_policy_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action
);
