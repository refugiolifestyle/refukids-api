import { auth, db } from "@/configs/firebase";
import { TupleResponse } from "@/types/core";
import { Usuario } from "@/types/schema";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const useUserRequest = async (req: Request): Promise<TupleResponse<Usuario>> => {
    const h = req.headers.get("authorization");
    if (!h?.startsWith('Bearer ')) {
        return [
            null,
            new Error("Usuário não está logado")
        ]
    }

    const token = h.split(' ')[1];
    const firebaseInfos = await auth.verifyIdToken(token, true)
    if (!firebaseInfos) {
        return [
            null,
            new Error("Token Inválido")
        ]
    }

    const usuarioSnap = await db
        .ref(`refukids/usuarios`)
        .orderByChild('email')
        .equalTo(firebaseInfos.email as string)
        .limitToFirst(1)
        .get()

    if (!usuarioSnap.exists()) {
        return [
            null,
            new Error("Usuário não encontrado")
        ]
    }

    const [usuario] = Object.values(usuarioSnap.val()) as Usuario[]
    return [usuario, null]
}