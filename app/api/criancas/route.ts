import { useUserRequest } from "@/hooks/useUserRequest"
import { prisma } from "@/lib/prisma"
import { dataNascimentoZodValidacao, fotoZodValidacao, nomeZodValidacao, observacaoZodValidacao, sexoZodValidacao } from "@/utils/validacoes"
import { NextRequest } from "next/server"
import z from "zod"

export async function POST(req: NextRequest) {
    const usuario = useUserRequest(req)

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
        return Response.json({ error: payloadError.message })
    }

    let responsavelUsuario = await prisma.responsavel.findFirst({
        where: {
            cpf: usuario.cpf,
            responsavelLegal: true
        },
        select: { familiaId: true }
    })

    if (!responsavelUsuario) {
        return Response.json({ error: 'Família não encontrada para o Usuário' }, { status: 404 })
    }

    let crianca = await prisma.crianca.create({
        data: {
            nome: payload.nome,
            foto: payload.foto,
            dataNascimento: payload.dataNascimento,
            sexo: payload.sexo,
            observacao: payload.observacao || null,
            alergia: payload.alergia || null,
            condicaoMedicaMedicamento: payload.condicaoMedicaMedicamento || null,
            necessidadeEspecial: payload.necessidadeEspecial || null,
            familia: {
                connect: {
                    id: responsavelUsuario?.familiaId
                }
            }
        }
    })

    return Response.json(crianca)
} 