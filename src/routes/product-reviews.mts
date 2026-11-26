import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { validationProblem } from "../http/validation.mts";
import { createProductReviewSchema, productIdParamsSchema } from "../schemas/product-schemas.mts";
import { createProductReview, listProductReviews } from "../services/product-review-service.mts";

export const productReviewsRouter = new Hono();

productReviewsRouter.get(
    "/:productId/reviews",
    zValidator("param", productIdParamsSchema, (result, context) => {
        if (!result.success) {
            return validationProblem(context, result.error);
        }
    }),
    async (context) => {
        const { productId } = context.req.valid("param");
        const reviews = await listProductReviews(productId);
        return context.json(reviews);
    },
);

productReviewsRouter.post(
    "/:productId/reviews",
    zValidator("param", productIdParamsSchema, (result, context) => {
        if (!result.success) {
            return validationProblem(context, result.error);
        }
    }),
    zValidator("json", createProductReviewSchema, (result, context) => {
        if (!result.success) {
            return validationProblem(context, result.error);
        }
    }),
    async (context) => {
        const { productId } = context.req.valid("param");
        const review = await createProductReview(productId, context.req.valid("json"));
        return context.json(review, 201);
    },
);
