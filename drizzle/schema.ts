import { pgTable, serial, integer, varchar, text, numeric, index, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const product = pgTable("product", {
	id: serial().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	description: text().notNull(),
	price: numeric({ precision: 10, scale: 2 }).notNull(),
	stock: integer().notNull(),
	version: integer().default(1).notNull(),
}, (table) => [
	unique("product_name_key").on(table.name),]);

export const productDetail = pgTable("product_detail", {
	id: serial().primaryKey(),
	productId: integer("product_id").notNull(),
	material: varchar({ length: 100 }).notNull(),
	dimensions: varchar({ length: 100 }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.productId],
		foreignColumns: [product.id],
		name: "product_detail_product_id_fkey"
	}).onDelete("cascade"),
	unique("product_detail_product_id_key").on(table.productId),]);

export const productReview = pgTable("product_review", {
	id: serial().primaryKey(),
	productId: integer("product_id").notNull(),
	rating: integer().notNull(),
	comment: text().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.productId],
		foreignColumns: [product.id],
		name: "product_review_product_id_fkey"
	}).onDelete("cascade"),
	index("ix_product_review_product_id").using("btree", table.productId.asc().nullsLast()),
]);
