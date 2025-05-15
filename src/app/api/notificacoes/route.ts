import { db } from "@/configs/firebase";
import { useUserRequest } from "@/hooks/useUserRequest";
import { Notificacao } from "@/types/schema";
import { onlyNumbers } from "@/utils/helpers";
import * as httpErrors from '@/utils/httpErrors';
import { cpf } from "cpf-cnpj-validator";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function GET(req: Request) {
    const [usuario, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const notificacoes = Object.values(usuario.notificacoes || {})
        .sort((a, b) => Date.parse(a.cadastradoEm) > Date.parse(b.notificadoPor) ? 1 : -1)

    return NextResponse.json({
        success: true,
        notificacoes
    })
}

export async function POST(req: Request) {
    const [usuario, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data, error } = z
        .object({
            responsavelId: z.string({ required_error: "O Campo Responsável é obrigatório" }).trim().transform(onlyNumbers).refine(cpf.isValid, { message: "O Campo Responsável está inválido" }),
            titulo: z.string({ required_error: "O Campo titulo é obrigatório" }).trim(),
            corpo: z.string({ required_error: "O Campo Corpo é obrigatório" }).trim(),
        })
        .safeParse(await req.json())

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    const tokenSnap = await db
        .ref(`refukids/usuarios/${data.responsavelId}/notificacoesToken`)
        .get()

    if (!tokenSnap.exists()) {
        throw httpErrors.unprocessableEntity("Token de notificação faltando para o Responsável")
    }

    const notificacaoId = randomUUID()
    // const notificacaoId = await messaging
    //     .send({
    //         token: tokenSnap.val(),
    //         notification: {
    //             title: data.titulo || "Refukids",
    //             body: data.corpo,
    //             imageUrl: "https://i.pravatar.cc/300"
    //         },
    //         android: { priority: 'high' }
    //     })

    await db
        .ref(`refukids/usuarios/${data.responsavelId}/notificacoes/${notificacaoId}`)
        .set({
            id: notificacaoId,
            titulo: data.titulo,
            corpo: data.corpo,
            imagem: "https://i.pravatar.cc/300",
            cadastradoEm: new Date().toISOString(),
            notificadoPor: usuario.cpf
        } as Notificacao)

    return NextResponse.json({ success: true, notificacaoId })
}
