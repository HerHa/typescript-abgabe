import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./db/client.mts";
import { productTable } from "./db/schema.mts";

const app = new Hono();

app.get("/", (context) => context.json({ message: "Hello World" }));

app.get("/products", async (context) => {
    const products = await db.select().from(productTable);
    return context.json(products);
});

serve({
    fetch: app.fetch,
    port: 3000,
});
