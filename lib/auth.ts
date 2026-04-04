import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from "jose";

export async function validateJWT(token: string): Promise<JWTVerifyResult> {
    return jwtVerify(
        token,
        createRemoteJWKSet(new URL(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/certs`)), {
        audience: ["account", "refukids", "refukids-servos"],
    });
}

export async function introspectToken(token: string) {
    const params = new URLSearchParams();
    params.append("token", token);
    params.append("client_id", process.env.KEYCLOAK_INTROSPECT_APP_KEY);
    params.append("client_secret", process.env.KEYCLOAK_INTROSPECT_SECRET_KEY);

    const res = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token/introspect`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    return res.json()
}