import { useUserRequest } from "@/hooks/useUserRequest";
import { prisma } from "@/lib/prisma";
import { notificarUsuario } from "@/utils/notificacao";
import { idZodValidacao, notificacoesCorpoZodValidacao, notificacoesTituloZodValidacao } from "@/utils/validacoes";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    const usuario = useUserRequest(req)

    const { data, error } = z
        .object({
            familiaId: idZodValidacao,
            titulo: notificacoesTituloZodValidacao,
            corpo: notificacoesCorpoZodValidacao
        })
        .safeParse(req.body)

    if (error) {
        return Response.json({ error: error.message })
    }

    const { familiaId, ...notificacaoPayload } = data

    const usuariosNotificados = await prisma.responsavel.findMany({
        where: { familiaId }
    })
    await notificarUsuario(usuario.cpf, usuariosNotificados, notificacaoPayload)

    return Response.json({ data: {} })
}
