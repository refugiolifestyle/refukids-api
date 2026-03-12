import { useUserRequest } from "@/hooks/useUserRequest";
import { prisma } from "@/lib/prisma";
import { idZodValidacao } from "@/utils/validacoes";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const usuario = useUserRequest(req)

    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const { data: payload, error: payloadError } = z
        .object({
            impressoraId: idZodValidacao,
            checkinId: idZodValidacao
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError.message })
    }

    try {
        let checkin = await prisma.checkin.count({
            where: {
                id: payload.checkinId
            }
        })

        if (!checkin) {
            return Response.json({ error: 'Checkin não encontrado' }, { status: 404 })
        }

        let impressora = await prisma.impressora.findFirst({
            select: {
                id: true,
                operador: true
            },
            where: {
                id: payload.impressoraId,
                operadorId: {
                    not: null
                }
            }
        })

        if (!impressora) {
            return Response.json({ error: 'Impressora não encontrada ou sem operador' }, { status: 404 })
        }

        let impressao = await prisma.impressao.create({
            data: {
                checkinId: payload.checkinId,
                impressoraId: payload.impressoraId
            },
            select: {
                id: true
            }
        })

        // Gera impressão do ticket
        // await notificarUsuario(
        //     usuario.cpf,
        //     [impressora.operador!],
        //     { titulo: 'Impressão de Checkin', corpo: impressao.id }
        // )

        return Response.json({ data: impressao })
    }
    catch (e) {
        console.error(e)
        return Response.json({ error: 'Falha ao reimprimir o checkin' }, { status: 500 })
    }
}