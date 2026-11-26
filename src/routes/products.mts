import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { etagFor, matchesIfMatch, matchesIfNoneMatch } from "../http/etag.mts";
import { keycloakAccessTokenRequired } from "../http/keycloak-auth.mts";
import { problemResponse } from "../http/problem.mts";
import { validationProblem } from "../http/validation.mts";
import {
    createProductSchema,
    productIdParamsSchema,
    productListQuerySchema,
    updateProductSchema,
} from "../schemas/product-schemas.mts";
import { getProductById, listProducts } from "../services/product-service.mts";
import { createProduct, updateProduct } from "../services/product-write-service.mts";

export const productsRouter = new Hono();

productsRouter.get(
    "/",
    zValidator("query", productListQuerySchema, (result, context) => {
        if (!result.success) {
            return validationProblem(context, result.error);
        }
    }),
    async (context) => {
        const products = await listProducts(context.req.valid("query"));
        const etag = etagFor(products);
        context.header("ETag", etag);

        if (matchesIfNoneMatch(context.req.header("If-None-Match"), etag)) {
            return context.newResponse(null, 304);
        }

        return context.json(products);
    },
);

productsRouter.get(
    "/:productId",
    zValidator("param", productIdParamsSchema, (result, context) => {
        if (!result.success) {
            return validationProblem(context, result.error);
        }
    }),
    keycloakAccessTokenRequired,
    async (context) => {
        const { productId } = context.req.valid("param");
        const product = await getProductById(productId);

        const etag = etagFor(product);
        context.header("ETag", etag);

        if (matchesIfNoneMatch(context.req.header("If-None-Match"), etag)) {
            return context.newResponse(null, 304);
        }

        return context.json(product);
    },
);

productsRouter.post(
    "/",
    zValidator("json", createProductSchema, (result, context) => {
        if (!result.success) {
            return validationProblem(context, result.error);
        }
    }),
    async (context) => {
        const product = await createProduct(context.req.valid("json"));
        context.header("Location", `/products/${product.id}`);
        return context.json(product, 201);
    },
);

productsRouter.put(
    "/:productId",
    zValidator("param", productIdParamsSchema, (result, context) => {
        if (!result.success) {
            return validationProblem(context, result.error);
        }
    }),
    zValidator("json", updateProductSchema, (result, context) => {
        if (!result.success) {
            return validationProblem(context, result.error);
        }
    }),
    async (context) => {
        const { productId } = context.req.valid("param");
        const ifMatch = context.req.header("If-Match");
        if (ifMatch === undefined) {
            return problemResponse(
                context,
                428,
                "Precondition Required",
                "If-Match header with the current ETag is required",
            );
        }

        const currentProduct = await getProductById(productId);

        if (!matchesIfMatch(ifMatch, etagFor(currentProduct))) {
            return problemResponse(
                context,
                412,
                "Precondition Failed",
                "Product has changed; fetch it again before updating",
            );
        }

        const updatedProduct = await updateProduct(
            productId,
            currentProduct.version,
            context.req.valid("json"),
        );
        const etag = etagFor(updatedProduct);
        context.header("ETag", etag);
        return context.json(updatedProduct);
    },
);
