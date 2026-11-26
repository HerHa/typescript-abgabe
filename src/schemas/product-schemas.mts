import { z } from "zod";

const productDetailSchema = z.object({
    material: z.string().trim().min(1).max(100),
    dimensions: z.string().trim().min(1).max(100),
});

const priceSchema = z
    .union([z.number().finite(), z.string()])
    .transform(String)
    .pipe(z.string().regex(/^\d{1,8}(?:\.\d{1,2})?$/));

const productFieldsSchema = {
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1),
    price: priceSchema,
    stock: z.number().int().min(0).max(2_147_483_647),
};

export const productListQuerySchema = z.object({
    name: z.string().trim().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().nonnegative().default(0),
});

export const productIdParamsSchema = z.object({
    productId: z.coerce.number().int().positive().max(2_147_483_647),
});

export const createProductSchema = z.object({
    ...productFieldsSchema,
    detail: productDetailSchema.nullable().optional(),
});

export const updateProductSchema = z.object({
    ...productFieldsSchema,
    detail: productDetailSchema.nullable().optional(),
});

export const createProductReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().min(1),
});

export type ProductListQuery = z.output<typeof productListQuerySchema>;
export type ProductCreateInput = z.output<typeof createProductSchema>;
export type ProductUpdateInput = z.output<typeof updateProductSchema>;
export type ProductReviewCreateInput = z.output<typeof createProductReviewSchema>;
