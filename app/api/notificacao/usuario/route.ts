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
            servoId: idZodValidacao.optional(),
            responsavelId: idZodValidacao.optional(),
            titulo: notificacoesTituloZodValidacao,
            corpo: notificacoesCorpoZodValidacao
        })
        .safeParse(req.body)

    if (error) {
        return Response.json({ error: error.message })
    }

    const { servoId, responsavelId, ...notificacaoPayload } = data

    let usuariosNotificados;
    if (servoId) {
        usuariosNotificados = await prisma.servo.findMany({
            where: { id: servoId },
        })
    }
    else {
        usuariosNotificados = await prisma.responsavel.findMany({
            where: { id: responsavelId },
        })
    }

    await notificarUsuario(usuario.cpf, usuariosNotificados, notificacaoPayload)

    return Response.json({ data: {} })
}
