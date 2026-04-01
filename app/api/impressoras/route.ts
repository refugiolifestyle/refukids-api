import { useUserRequest } from "@/hooks/useUserRequest"
import { prisma } from "@/lib/prisma"
import { getPrismaErrorMessage } from "@/utils/helpers"
import { fotoZodValidacao, nomeZodValidacao } from "@/utils/validacoes"
import { NextRequest } from "next/server"
import z from "zod"

export async function GET(req: NextRequest) {
    const _ = useUserRequest(req)

    let impressoras = await prisma.impressora.findMany()
    return Response.json({ data: impressoras })
}

export async function POST(req: NextRequest) {
    const { data: payload, error: payloadError } = z
        .object({
            foto: fotoZodValidacao,
            descricao: nomeZodValidacao,
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError?.message }, { status: 400 })
    }

    try {
        let impressora = await prisma.impressora.create({
            data: {
                foto: payload.foto,
                descricao: payload.descricao
            }
        })

        return Response.json({ data: impressora })
    }
    catch (error: any) {
        if ("clientVersion" in error) {
            const message = getPrismaErrorMessage(error.code)
            return Response.json({ error: message }, { status: 400 })
        }

        return Response.json({ error: 'Falha ao cadastrar a impressora' }, { status: 500 })
    }
} 