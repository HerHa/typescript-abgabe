import type { Context } from "hono";
import { problemResponse } from "./problem.mts";

type ValidationError = {
    issues: readonly {
        message: string;
        path: readonly (string | number | symbol)[];
    }[];
};

export function validationProblem(context: Context, error: ValidationError): Response {
    const detail = error.issues
        .map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`)
        .join("; ");

    return problemResponse(context, 400, "Bad Request", detail);
}
