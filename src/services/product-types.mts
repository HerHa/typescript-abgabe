import { productDetailTable, productTable } from "../db/schema.mts";

type ProductJoin = {
    product: typeof productTable.$inferSelect;
    detail: typeof productDetailTable.$inferSelect | null;
};

export type ProductView = ProductJoin["product"] & {
    detail: ProductJoin["detail"];
};

export function toProductView(row: ProductJoin): ProductView {
    return {
        ...row.product,
        detail: row.detail,
    };
}
