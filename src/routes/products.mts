import { Hono } from "hono";
import { listProducts } from "../services/product-service.mts";

export const productsRouter = new Hono();

productsRouter.get("/", async (context) => {
    const products = await listProducts();
    return context.json(products);
});
