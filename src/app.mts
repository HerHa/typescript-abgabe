import { Hono } from "hono";
import { apiErrorHandler } from "./http/error-handler.mts";
import { productReviewsRouter } from "./routes/product-reviews.mts";
import { productsRouter } from "./routes/products.mts";

export const app = new Hono();

app.onError(apiErrorHandler);
app.get("/", (context) => context.json({ message: "Hello World" }));
app.route("/products", productsRouter);
app.route("/products", productReviewsRouter);
