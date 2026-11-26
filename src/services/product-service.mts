import { db } from "../db/client.mts";
import { productTable } from "../db/schema.mts";

export async function listProducts() {
    return db.select().from(productTable);
}
