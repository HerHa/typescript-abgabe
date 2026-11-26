import type { Context } from "hono";

export type ProblemStatus = 400 | 401 | 404 | 409 | 412 | 428 | 500 | 503;

export function problemResponse(
    context: Context,
    status: ProblemStatus,
    title: string,
    detail: string,
    headers?: Record<string, string>,
): Response {
    return context.newResponse(
        JSON.stringify({
            type: "about:blank",
            title,
            status,
            detail,
        }),
        status,
        { "Content-Type": "application/problem+json", ...headers },
    );
}
