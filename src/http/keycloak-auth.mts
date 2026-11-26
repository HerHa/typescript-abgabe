import { createRemoteJWKSet, errors, jwtVerify } from "jose";
import type { MiddlewareHandler } from "hono";
import { problemResponse } from "./problem.mts";

type KeycloakConfig = {
    issuer: string;
    audience: string;
    jwksUrl: string;
};

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getKeycloakConfig(): KeycloakConfig | undefined {
    const issuer = process.env.KEYCLOAK_ISSUER?.replace(/\/+$/, "");
    const audience = process.env.KEYCLOAK_AUDIENCE;

    if (
        issuer === undefined ||
        issuer.length === 0 ||
        audience === undefined ||
        audience.length === 0
    ) {
        console.error("Keycloak auth requires KEYCLOAK_ISSUER and KEYCLOAK_AUDIENCE");
        return undefined;
    }

    try {
        const issuerUrl = new URL(issuer);
        if (issuerUrl.protocol !== "https:" && issuerUrl.protocol !== "http:") {
            throw new Error("Issuer URL must use HTTP or HTTPS");
        }

        const jwksUrl = process.env.KEYCLOAK_JWKS_URL ?? `${issuer}/protocol/openid-connect/certs`;
        const jwks = new URL(jwksUrl);
        if (jwks.protocol !== "https:" && jwks.protocol !== "http:") {
            throw new Error("JWKS URL must use HTTP or HTTPS");
        }

        return { issuer, audience, jwksUrl: jwks.toString() };
    } catch (error) {
        console.error("Invalid Keycloak issuer or JWKS URL configuration", error);
        return undefined;
    }
}

function getJwks(config: KeycloakConfig) {
    const cacheKey = `${config.issuer}|${config.jwksUrl}`;
    let jwks = jwksCache.get(cacheKey);

    if (jwks === undefined) {
        jwks = createRemoteJWKSet(new URL(config.jwksUrl));
        jwksCache.set(cacheKey, jwks);
    }

    return jwks;
}

export const keycloakAccessTokenRequired: MiddlewareHandler = async (context, next) => {
    const authorization = context.req.header("Authorization");
    const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];

    if (token === undefined) {
        return problemResponse(context, 401, "Unauthorized", "A Bearer access token is required", {
            "WWW-Authenticate": "Bearer",
        });
    }

    const config = getKeycloakConfig();
    if (config === undefined) {
        return problemResponse(
            context,
            500,
            "Internal Server Error",
            "Keycloak token verification is not configured",
        );
    }

    try {
        await jwtVerify(token, getJwks(config), {
            issuer: config.issuer,
            audience: config.audience,
            algorithms: ["RS256"],
            requiredClaims: ["exp"],
        });
    } catch (error) {
        if (error instanceof errors.JOSEError) {
            if (error.code === "ERR_JWKS_TIMEOUT") {
                return problemResponse(
                    context,
                    503,
                    "Service Unavailable",
                    "Keycloak signing keys could not be retrieved",
                );
            }

            return problemResponse(context, 401, "Unauthorized", "The access token is invalid", {
                "WWW-Authenticate": 'Bearer error="invalid_token"',
            });
        }

        throw error;
    }

    await next();
};
