import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { productsRouter } from "./routes/products.mts";

const app = new Hono();

app.get("/", (context) => context.json({ message: "Hello World" }));
app.route("/products", productsRouter);

serve({
    fetch: app.fetch,
    port: 3000,
});
