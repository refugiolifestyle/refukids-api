import { NextResponse } from "next/server";
import { introspectToken, validateJWT } from "./lib/auth";

export async function proxy(req: Request) {
    if (req.url.endsWith('_')) {
        return NextResponse.next();
    }

    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        return Response.json({ error: "Token ausente" }, { status: 401 });
    }

    const token = auth.split(" ")[1];

    try {
        await validateJWT(token);

        const introspect = await introspectToken(token);
        if (!introspect.active) {
            return Response.json({ error: "Token revogado ou logout" }, { status: 401 });
        }

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("kc-token", token);

        return NextResponse.next({
            request: { headers: requestHeaders },
        });

    } catch (error) {
        return Response.json({ error: "Token inválido" }, { status: 401 });
    }
}

export const config = {
    matcher: ["/api/:path*"],
};