import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.mts";
import { hasPostgresConstraintError } from "../db/postgres-errors.mts";
import { productReviewTable, productTable } from "../db/schema.mts";
import type { ProductReviewCreateInput } from "../schemas/product-schemas.mts";
import { ProductNotFoundError } from "./product-errors.mts";

export async function listProductReviews(productId: number) {
    const rows = await db
        .select({ review: productReviewTable })
        .from(productTable)
        .leftJoin(productReviewTable, eq(productReviewTable.productId, productTable.id))
        .where(eq(productTable.id, productId))
        .orderBy(asc(productReviewTable.id));

    if (rows.length === 0) {
        throw new ProductNotFoundError();
    }

    return rows.flatMap(({ review }) => (review === null ? [] : [review]));
}

export async function createProductReview(productId: number, input: ProductReviewCreateInput) {
    try {
        const [review] = await db
            .insert(productReviewTable)
            .values({
                productId,
                ...input,
            })
            .returning();

        if (review === undefined) {
            throw new Error("Review insert did not return a row");
        }

        return review;
    } catch (error) {
        if (hasPostgresConstraintError(error, "23503", "product_review_product_id_fkey")) {
            throw new ProductNotFoundError();
        }
        throw error;
    }
}
