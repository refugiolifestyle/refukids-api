import { useUserToken } from "@/hooks/useUserToken";
import { prisma } from "@/lib/prisma";
import { getPrismaErrorMessage } from "@/utils/helpers";
import { idZodValidacao } from "@/utils/validacoes";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
    const usuario = useUserToken(req)

    const notificacoes = await prisma.notificacao.findMany({
        select: {
            titulo: true,
            descricao: true,
            cadastradoEm: true,
            notificadoPor: {
                select: {
                    nome: true,
                    foto: true
                }
            }
        },
        where: {
            usuariosNotificados: {
                every: usuario.realm_access?.roles.includes('servo')
                    ? { notificadoParaServo: { cpf: usuario.cpf } }
                    : { notificadoParaResponsavel: { cpf: usuario.cpf } }
            }
        }
    })

    return Response.json(notificacoes)
}

export async function POST(req: NextRequest) {
    const usuario = useUserToken(req)

    const { data: payload, error: payloadError } = z
        .object({
            token: idZodValidacao,
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError?.message }, { status: 400 })
    }

    try {
        if (usuario.realm_access?.roles.includes('servo')) {
            await prisma.servo.updateMany({
                data: { notificacoesToken: payload.token },
                where: { cpf: usuario.cpf }
            })
        }
        else {
            await prisma.responsavel.updateMany({
                data: { notificacoesToken: payload.token },
                where: { cpf: usuario.cpf }
            })
        }

        return Response.json({ data: {} })
    }
    catch (error: any) {
        console.error(error)

        if ("clientVersion" in error) {
            const message = getPrismaErrorMessage(error.code)
            return Response.json({ error: message }, { status: 400 })
        }

        return Response.json({ error: 'Falha ao registrar o token de notificação do dispositivo' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const usuario = useUserToken(req)

    try {
        await prisma.usuarioNotificacao.updateMany({
            data: {
                lida: true
            },
            where: usuario.realm_access?.roles.includes('servo')
                ? { notificadoParaServo: { cpf: usuario.cpf } }
                : { notificadoParaResponsavel: { cpf: usuario.cpf } }
        })

        return Response.json({ data: {} })
    }
    catch (error: any) {
        console.error(error)

        if ("clientVersion" in error) {
            const message = getPrismaErrorMessage(error.code)
            return Response.json({ error: message }, { status: 400 })
        }

        return Response.json({ error: 'Falha ao marcar com lida as notificações do usuário' }, { status: 500 })
    }
}