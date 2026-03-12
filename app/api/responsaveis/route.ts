import { useUserRequest } from "@/hooks/useUserRequest"
import { prisma } from "@/lib/prisma"
import { celulaZodValidacao, cpfZodValidacao, dataNascimentoZodValidacao, enderecoZodValidacao, fotoZodValidacao, nomeZodValidacao, parentescoZodValidacao, sexoZodValidacao, telefoneZodValidacao } from "@/utils/validacoes"
import { NextRequest } from "next/server"
import z from "zod"

export async function POST(req: NextRequest) {
    const usuario = useUserRequest(req)

    const { data: payload, error: payloadError } = z
        .object({
            cpf: cpfZodValidacao,
            nome: nomeZodValidacao,
            foto: fotoZodValidacao,
            sexo: sexoZodValidacao,
            telefone: telefoneZodValidacao,
            dataNascimento: dataNascimentoZodValidacao,
            parentesco: parentescoZodValidacao,
            endereco: enderecoZodValidacao,
            celula: celulaZodValidacao,
            responsavelLegal: z.boolean().default(true),
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError?.message }, { status: 400 })
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

    let responsavel = await prisma.responsavel.create({
        data: {
            cpf: payload.cpf,
            nome: payload.nome,
            foto: payload.foto,
            sexo: payload.sexo,
            telefone: payload.telefone,
            parentesco: payload.parentesco,
            dataNascimento: payload.dataNascimento,
            endereco: payload.endereco,
            celula: payload.celula,
            responsavelLegal: payload.responsavelLegal,
            familia: {
                connect: {
                    id: responsavelUsuario?.familiaId
                }
            }
        }
    })

    return Response.json({ data: responsavel })
} 