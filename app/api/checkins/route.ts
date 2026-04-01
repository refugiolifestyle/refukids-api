import { useUserRequest } from "@/hooks/useUserRequest";
import { prisma } from "@/lib/prisma";
import { getPrismaErrorMessage } from "@/utils/helpers";
import { idZodValidacao } from "@/utils/validacoes";
import moment from "moment";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
    const usuario = useUserRequest(req)

    const { data: payload, error: payloadError } = z
        .object({
            criancaId: idZodValidacao,
            impressoraId: idZodValidacao
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError.message })
    }

    let responsavel = await prisma.responsavel.findFirst({
        where: {
            cpf: usuario.cpf
        }
    })

    if (!responsavel) {
        return Response.json({ error: 'Usuário sem permissão de fazer checkin' }, { status: 400 })
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

    let crianca = await prisma.crianca.findFirst({
        select: {
            id: true,
            dataNascimento: true
        },
        where: {
            id: payload.criancaId
        }
    })

    if (!crianca) {
        return Response.json({ error: 'Criança não encontrada' }, { status: 404 })
    }

    let dataNascimento = moment(crianca?.dataNascimento, "YYYY-MM-DD")
    let idade = moment().diff(dataNascimento, "years")

    let turma = await prisma.turma.findFirst({
        select: {
            id: true
        },
        where: {
            AND: [
                { idadeMinima: { lte: idade } },
                { idadeMaxima: { gte: idade } }
            ]
        }
    })

    if (!turma) {
        return Response.json({ error: 'Turma não encontrada para a idade da criança' }, { status: 404 })
    }

    try {
        let checkin = await prisma.checkin.create({
            select: {
                id: true,
                impressoes: {
                    select: {
                        id: true
                    }
                }
            },
            data: {
                culto: moment().format('YYYY-MM-DD'),
                criancaId: crianca.id,
                turmaId: turma.id,
                eventos: {
                    create: {
                        tipo: 'Checkin',
                        checkinPorId: responsavel.id,
                        responsaveisNotificados: true
                    }
                },
                impressoes: {
                    create: {
                        impressoraId: impressora.id
                    },
                }
            }
        })

        // Gera impressão do ticket
        // let [impressao] = checkin.impressoes
        // await notificarUsuario(
        //     usuario.cpf,
        //     [impressora.operador!],
        //     { titulo: 'Impressão de Checkin', corpo: impressao.id }
        // )

        return Response.json({ data: checkin })
    }
    catch (error: any) {
        if ("clientVersion" in error) {
            const message = getPrismaErrorMessage(error.code)
            return Response.json({ error: message }, { status: 400 })
        }

        return Response.json({ error: 'Falha ao fazer o checkin' }, { status: 500 })
    }
}