import { useUserRequest } from "@/hooks/useUserRequest";
import { prisma } from "@/lib/prisma";
import { nomeZodValidacao } from "@/utils/validacoes";
import { NextRequest } from "next/server";
import z from "zod";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const _ = useUserRequest(req)

    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const { data: payload, error: payloadError } = z
        .object({
            descricao: nomeZodValidacao
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError?.message }, { status: 400 })
    }

    const impressora = await prisma.impressora
        .update({
            data: payload,
            where: { id }
        })

    return Response.json({ data: impressora })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const usuario = useUserRequest(req)

    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const { data: payload, error: payloadError } = z
        .object({
            ip: z.ipv4('Campo IP da impressora inválido')
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError?.message }, { status: 400 })
    }

    try {
        const impressora = await prisma.impressora
            .update({
                data: {
                    ip: payload.ip,
                    operador: {
                        connect: {
                            cpf: usuario.cpf
                        }
                    }
                },
                where: { id }
            })

        return Response.json({ data: impressora })
    } catch (e) {
        console.error(e)
        return Response.json({ error: 'Falha ao registrar o operador' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    await prisma.impressora
        .delete({ where: { id } })

    return Response.json({})
}
