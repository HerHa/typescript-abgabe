import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/client.mts";
import { hasPostgresConstraintError } from "../db/postgres-errors.mts";
import { productDetailTable, productTable } from "../db/schema.mts";
import type { ProductCreateInput, ProductUpdateInput } from "../schemas/product-schemas.mts";
import { ProductChangedError, ProductNameConflictError } from "./product-errors.mts";
import { toProductView, type ProductView } from "./product-types.mts";

function isProductNameConflict(error: unknown): boolean {
    return hasPostgresConstraintError(error, "23505", "product_name_key");
}

export async function createProduct(input: ProductCreateInput): Promise<ProductView> {
    try {
        return await db.transaction(async (transaction) => {
            const [product] = await transaction
                .insert(productTable)
                .values({
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    stock: input.stock,
                })
                .returning();

            if (product === undefined) {
                throw new Error("Product insert did not return a row");
            }

            if (input.detail !== undefined && input.detail !== null) {
                await transaction.insert(productDetailTable).values({
                    productId: product.id,
                    ...input.detail,
                });
            }

            const [row] = await transaction
                .select({ product: productTable, detail: productDetailTable })
                .from(productTable)
                .leftJoin(productDetailTable, eq(productDetailTable.productId, productTable.id))
                .where(eq(productTable.id, product.id))
                .limit(1);

            if (row === undefined) {
                throw new Error("Created product could not be read back");
            }

            return toProductView(row);
        });
    } catch (error) {
        if (isProductNameConflict(error)) {
            throw new ProductNameConflictError();
        }
        throw error;
    }
}

export async function updateProduct(
    productId: number,
    expectedVersion: number,
    input: ProductUpdateInput,
): Promise<ProductView> {
    try {
        return await db.transaction(async (transaction) => {
            const [product] = await transaction
                .update(productTable)
                .set({
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    stock: input.stock,
                    version: sql`${productTable.version} + 1`,
                })
                .where(
                    and(eq(productTable.id, productId), eq(productTable.version, expectedVersion)),
                )
                .returning();

            if (product === undefined) {
                throw new ProductChangedError();
            }

            if (input.detail === undefined || input.detail === null) {
                await transaction
                    .delete(productDetailTable)
                    .where(eq(productDetailTable.productId, productId));
            } else {
                await transaction
                    .insert(productDetailTable)
                    .values({
                        productId,
                        ...input.detail,
                    })
                    .onConflictDoUpdate({
                        target: productDetailTable.productId,
                        set: {
                            material: input.detail.material,
                            dimensions: input.detail.dimensions,
                        },
                    });
            }

            const [row] = await transaction
                .select({ product: productTable, detail: productDetailTable })
                .from(productTable)
                .leftJoin(productDetailTable, eq(productDetailTable.productId, productTable.id))
                .where(eq(productTable.id, productId))
                .limit(1);

            if (row === undefined) {
                throw new ProductChangedError();
            }

            return toProductView(row);
        });
    } catch (error) {
        if (isProductNameConflict(error)) {
            throw new ProductNameConflictError();
        }
        throw error;
    }
}
