-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "product" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL CONSTRAINT "product_name_key" UNIQUE,
	"description" text NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"stock" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_detail" (
	"id" serial PRIMARY KEY,
	"product_id" integer NOT NULL CONSTRAINT "product_detail_product_id_key" UNIQUE,
	"material" varchar(100) NOT NULL,
	"dimensions" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_review" (
	"id" serial PRIMARY KEY,
	"product_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ix_product_review_product_id" ON "product_review" ("product_id");--> statement-breakpoint
ALTER TABLE "product_detail" ADD CONSTRAINT "product_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE;
*/