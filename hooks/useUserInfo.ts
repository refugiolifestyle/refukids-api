import { JWTKeycloakRolesPayload } from "@/utils/schema";

export async function useUserInfo(req: Request) {
    const token = req.headers.get("kc-token");

    const res = await fetch(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!res.ok) {
        let error = await res.json()
        console.error(error)

        throw new Error("Erro ao buscar usuário");
    }

    return await res.json() as JWTKeycloakRolesPayload
}