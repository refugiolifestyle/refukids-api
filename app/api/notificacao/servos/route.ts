import { useUserRequest } from "@/hooks/useUserRequest";
import { prisma } from "@/lib/prisma";
import { notificarUsuario } from "@/utils/notificacao";
import { notificacoesCorpoZodValidacao, notificacoesTituloZodValidacao } from "@/utils/validacoes";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    const usuario = useUserRequest(req)

    const { data: notificacaoPayload, error } = z
        .object({
            titulo: notificacoesTituloZodValidacao,
            corpo: notificacoesCorpoZodValidacao
        })
        .safeParse(req.body)

    if (error) {
        return Response.json({ error: error.message })
    }

    const usuariosNotificados = await prisma.servo
        .findMany()

    await notificarUsuario(usuario.cpf, usuariosNotificados, notificacaoPayload)

    return Response.json({ data: {} })
}
