import { auth, db } from "@/configs/firebase";
import { useTuple } from "@/hooks/useTuple";
import { Usuario } from "@/types/schema";
import { onlyNumbers } from "@/utils/helpers";
import * as httpErrors from '@/utils/httpErrors';
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { UserRecord } from "firebase-admin/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const { data, error } = z.object({
        cpf: z.string().trim().transform(onlyNumbers).refine(cpfValidator.isValid, { message: "O campo CPF está inválido" }),
        email: z.string({ required_error: "O Campo Email é obrigatório" }).email("O Campo Email está inválido"),
        senha: z.string({ required_error: "O Campo Senha é obrigatório" }).min(6, "O Campo Senha precisa ser no mínimo 6 caracteres"),
        notificacoesToken: z.string().optional(),
    })
        .safeParse(await req.json())

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    const usuarioSnap = await db
        .ref(`refukids/usuarios/${data.cpf}`)
        .get()

    if (!usuarioSnap.exists()) {
        return httpErrors.notFound("Usuário não encontrado")
    }

    const usuario = usuarioSnap.val() as Usuario

    const [fbUsuario, usuarioFbSetError] = await useTuple<UserRecord, { code: string }>(auth
        .createUser({
            email: data.email,
            disabled: false,
            displayName: usuario.nome,
            password: data.senha,
            photoURL: usuario.foto
        }))

    if (usuarioFbSetError != null) {
        if (usuarioFbSetError.code == "auth/email-already-exists") {
            return httpErrors.conflict("Email já cadastrado no sistema")
        }

        return httpErrors.internalServerError("Falha ao cadastrar o usuário no sistema")
    }

    const [, usuarioUpdateError] = await useTuple(db
        .ref(`refukids/usuarios/${data.cpf}`)
        .update({
            email: data.email,
            notificacoesToken: data.notificacoesToken,
            uid: fbUsuario.uid,
            cadastroFinalizado: true,
            cadastradoEm: new Date().toISOString()
        } as Usuario))

    if (usuarioUpdateError != null) {
        if (fbUsuario.uid) {
            await auth.deleteUser(fbUsuario.uid)
        }

        return httpErrors.internalServerError("Falha ao cadastrar o usuário no banco de dados")
    }

    return NextResponse.json({ success: true })
}
