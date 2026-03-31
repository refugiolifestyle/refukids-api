import { prisma } from "@/lib/prisma"
import { getPrismaErrorMessage } from "@/utils/helpers"
import { dataNascimentoZodValidacao, fotoZodValidacao, nomeZodValidacao, observacaoZodValidacao, sexoZodValidacao } from "@/utils/validacoes"
import { NextRequest } from "next/server"
import z from "zod"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const crianca = await prisma.crianca.findFirst({
        include: {
            checkins: {
                select: {
                    id: true,
                    cadastradoEm: true
                },
                orderBy: {
                    cadastradoEm: 'desc'
                }
            }
        },
        where: { id }
    })
    if (!crianca) {
        return Response.json({ error: "Criança não encontrada" }, { status: 404 })
    }

    return Response.json(crianca)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const { data: payload, error: payloadError } = z
        .object({
            nome: nomeZodValidacao,
            foto: fotoZodValidacao,
            dataNascimento: dataNascimentoZodValidacao,
            sexo: sexoZodValidacao,
            observacao: observacaoZodValidacao,
            alergia: observacaoZodValidacao,
            condicaoMedicaMedicamento: observacaoZodValidacao,
            necessidadeEspecial: observacaoZodValidacao
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError?.message }, { status: 400 })
    }

    try {
        const crianca = await prisma.crianca
            .update({
                data: payload,
                where: { id }
            })

        return Response.json({ data: crianca })
    } catch (error: any) {
        if ("clientVersion" in error) {
            const message = getPrismaErrorMessage(error.code)
            return Response.json({ error: message }, { status: 400 })
        }

        return Response.json({ error: 'Falha ao atualizar a criança' }, { status: 400 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    try {
        await prisma.crianca
            .delete({ where: { id } })

        return Response.json({ data: {} })
    } catch (error: any) {
        if ("clientVersion" in error) {
            const message = getPrismaErrorMessage(error.code)
            return Response.json({ error: message }, { status: 400 })
        }

        return Response.json({ error: 'Falha ao deletar a criança' }, { status: 400 })
    }
}