import { asc, eq, ilike } from "drizzle-orm";
import { db } from "../db/client.mts";
import { productDetailTable, productTable } from "../db/schema.mts";
import type { ProductListQuery } from "../schemas/product-schemas.mts";
import { ProductNotFoundError } from "./product-errors.mts";
import { toProductView, type ProductView } from "./product-types.mts";

export async function listProducts(query: ProductListQuery): Promise<ProductView[]> {
    const rows = await db
        .select({ product: productTable, detail: productDetailTable })
        .from(productTable)
        .leftJoin(productDetailTable, eq(productDetailTable.productId, productTable.id))
        .where(query.name === undefined ? undefined : ilike(productTable.name, `%${query.name}%`))
        .orderBy(asc(productTable.id))
        .limit(query.limit)
        .offset(query.offset);

    return rows.map(toProductView);
}

export async function getProductById(productId: number): Promise<ProductView> {
    const [row] = await db
        .select({ product: productTable, detail: productDetailTable })
        .from(productTable)
        .leftJoin(productDetailTable, eq(productDetailTable.productId, productTable.id))
        .where(eq(productTable.id, productId))
        .limit(1);

    if (row === undefined) {
        throw new ProductNotFoundError();
    }

    return toProductView(row);
}
