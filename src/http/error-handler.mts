import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { problemResponse } from "./problem.mts";
import {
    ProductChangedError,
    ProductNameConflictError,
    ProductNotFoundError,
} from "../services/product-errors.mts";

export const apiErrorHandler: ErrorHandler = (error, context) => {
    if (error instanceof HTTPException && error.status === 400) {
        return problemResponse(context, 400, "Bad Request", error.message);
    }

    if (error instanceof ProductNotFoundError) {
        return problemResponse(context, 404, "Not Found", error.message);
    }

    if (error instanceof ProductNameConflictError) {
        return problemResponse(context, 409, "Conflict", error.message);
    }

    if (error instanceof ProductChangedError) {
        return problemResponse(context, 412, "Precondition Failed", error.message);
    }

    console.error(error);
    return problemResponse(context, 500, "Internal Server Error", "An unexpected error occurred");
};
