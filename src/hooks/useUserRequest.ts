import { auth, db } from "@/configs/firebase";
import { TupleResponse } from "@/types/core";
import { Usuario } from "@/types/schema";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { useTuple } from "./useTuple";

export const useUserRequest = async (req: Request): Promise<TupleResponse<Usuario>> => {
    const h = req.headers.get("authorization");
    if (!h?.startsWith('Bearer ')) {
        return [
            null,
            new Error("Usuário não está logado")
        ]
    }

    const token = h.split(' ')[1];
    const [firebaseInfos, firebaseInfosError] = await useTuple(auth.verifyIdToken(token, true))
    if (firebaseInfosError != null) {
        return [
            null,
            new Error("Token Inválido, faça o login novamente")
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
            new Error("Usuário não encontrado no banco de dados")
        ]
    }

    const [usuario] = Object.values(usuarioSnap.val()) as Usuario[]
    return [usuario, null]
}