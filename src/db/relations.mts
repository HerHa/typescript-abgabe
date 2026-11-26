import { defineRelations } from 'drizzle-orm';
import {
    productDetailTable,
    productReviewTable,
    productTable,
} from './schema.mts';

const webShopSchema = {
    productTable,
    productDetailTable,
    productReviewTable,
};

export const relations = defineRelations(webShopSchema, (r) => ({
    productDetailTable: {
        product: r.one.productTable({
            from: r.productDetailTable.productId,
            to: r.productTable.id,
        }),
    },
    productTable: {
        productDetails: r.one.productDetailTable(),
        productReviews: r.many.productReviewTable(),
    },
    productReviewTable: {
        product: r.one.productTable({
            from: r.productReviewTable.productId,
            to: r.productTable.id,
        }),
    },
}));
