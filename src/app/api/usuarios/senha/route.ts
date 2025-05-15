import { auth, session } from "@/configs/firebase";
import { useTuple } from "@/hooks/useTuple";
import { useUserRequest } from "@/hooks/useUserRequest";
import * as httpErrors from '@/utils/httpErrors';
import { UserRecord } from "firebase-admin/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(req: Request) {
    const [usuario, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data, error } = z
        .object({
            senha: z.string().min(6)
        })
        .safeParse(await req.json())

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }
    const [, senhaUpdateError] = await useTuple<UserRecord, { code: string }>(auth
        .updateUser(usuario.uid!, {
            password: data.senha
        }))

    if (senhaUpdateError != null) {
        if (senhaUpdateError.code == "auth/user-not-found") {
            return httpErrors.notFound("Usuário não encontrado")
        }

        return httpErrors.internalServerError("Falha ao cadastrar a nova senha")
    }

    await auth.revokeRefreshTokens(usuario.uid!)
    await session.signOut()

    return NextResponse.json({ success: true })
}