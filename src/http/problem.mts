import type { Context } from "hono";

export type ProblemStatus = 400 | 404 | 409 | 412 | 428 | 500;

export function problemResponse(
    context: Context,
    status: ProblemStatus,
    title: string,
    detail: string,
): Response {
    return context.newResponse(
        JSON.stringify({
            type: "about:blank",
            title,
            status,
            detail,
        }),
        status,
        { "Content-Type": "application/problem+json" },
    );
}
