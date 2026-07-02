import { JWTKeycloakRolesPayload } from "@/utils/schema";
import { decodeJwt, JWTPayload } from "jose";

export function useUserToken(req: Request) {
    const auth = req.headers.get("authorization");
    const token = auth?.split(" ")[1];

    return decodeJwt(token!) as JWTPayload & JWTKeycloakRolesPayload
}