import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	productDetail: {
		product: r.one.product({
			from: r.productDetail.productId,
			to: r.product.id
		}),
	},
	product: {
		productDetails: r.one.productDetail(),
		productReviews: r.many.productReview(),
	},
	productReview: {
		product: r.one.product({
			from: r.productReview.productId,
			to: r.product.id
		}),
	},
}))