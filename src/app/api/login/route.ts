import { db, session } from "@/configs/firebase";
import { useTuple } from "@/hooks/useTuple";
import { Familia, Usuario } from "@/types/schema";
import * as httpErrors from '@/utils/httpErrors';
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const { data, error } = z
        .object({
            email: z.string().trim().email("O Campo Email está inválido"),
            senha: z.string()
        })
        .safeParse(await req.json())

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    const [credencialUsuario, signInError] = await useTuple<UserCredential, { code: string }>(signInWithEmailAndPassword(session, data.email, data.senha))
    if (signInError) {
        switch (signInError.code) {
            case "auth/invalid-credential": return httpErrors.unauthorized("Email ou senha inválidos")
            case "auth/user-not-found": return httpErrors.notFound('Usuário não encontrado no servidor')
            default: return httpErrors.unauthorized("Falha na autenticação com o servidor")
        }
    }

    const usuarioSnap = await db
        .ref(`refukids/usuarios`)
        .orderByChild('email')
        .equalTo(data.email)
        .limitToFirst(1)
        .get()

    if (!usuarioSnap.exists()) {
        return httpErrors.notFound("Usuário não encontrado no banco de dados")
    }

    const [usuario] = Object.values(usuarioSnap.val()) as Usuario[]
    delete usuario.notificacoes
    delete usuario.notificacoesToken

    const familiaSnap = await db
        .ref(`refukids/familias`)
        .child(usuario.familia as string)
        .get()

    if (!familiaSnap.exists()) {
        return httpErrors.notFound('Família não encontrada no banco de dados')
    }

    const familia = familiaSnap.val() as Familia
    const token = await credencialUsuario.user.getIdToken()

    return NextResponse.json({
        success: true,
        token,
        usuario,
        familia
    })
}
