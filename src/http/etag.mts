import { createHash } from "node:crypto";

function canonicalJson(value: unknown): string {
    if (Array.isArray(value)) {
        return `[${value.map(canonicalJson).join(",")}]`;
    }

    if (value !== null && typeof value === "object") {
        const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
        return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
    }

    return JSON.stringify(value) ?? "null";
}

export function etagFor(value: unknown): string {
    const hash = createHash("sha256").update(canonicalJson(value)).digest("hex");
    return `"${hash}"`;
}

export function matchesIfNoneMatch(header: string | undefined, etag: string): boolean {
    if (header === undefined) {
        return false;
    }

    return header.split(",").some((value) => {
        const candidate = value.trim();
        return candidate === "*" || candidate.replace(/^W\//, "") === etag;
    });
}

export function matchesIfMatch(header: string, etag: string): boolean {
    return header.split(",").some((value) => {
        const candidate = value.trim();
        return candidate === "*" || candidate === etag;
    });
}
