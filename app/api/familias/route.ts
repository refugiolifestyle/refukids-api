import { useUserRequest } from "@/hooks/useUserRequest"
import { prisma } from "@/lib/prisma"
import { getPrismaErrorMessage } from "@/utils/helpers"
import { parentescoZodValidacao } from "@/utils/validacoes"
import { NextRequest } from "next/server"
import z from "zod"

export async function GET(req: NextRequest) {
    const usuario = useUserRequest(req)

    let familia = await prisma.familia.findFirst({
        include: {
            criancas: {
                include: {
                    checkins: {
                        select: {
                            id: true,
                            cadastradoEm: true
                        },
                        take: 5,
                        orderBy: {
                            cadastradoEm: 'desc'
                        }
                    }
                },
                orderBy: {
                    cadastradoEm: 'desc'
                }
            },
            responsaveis: {
                include: {
                    notificacoesRecebidas: {
                        select: {
                            id: true,
                            notificacao: {
                                include: {
                                    notificadoPor: {
                                        select: {
                                            nome: true,
                                            foto: true
                                        }
                                    }
                                }
                            }
                        },
                        where: {
                            lida: false,
                            notificadoParaResponsavel: {
                                cpf: usuario.cpf
                            }
                        },
                        orderBy: {
                            cadastradoEm: 'desc'
                        }
                    }
                },
                orderBy: {
                    cadastradoEm: 'desc'
                }
            }
        },
        where: {
            responsaveis: {
                some: {
                    cpf: usuario.cpf,
                    responsavelLegal: true
                }
            }
        }
    })

    if (!familia) {
        return new Response(null, { status: 204 })
    }

    return Response.json(familia)
}

export async function POST(req: NextRequest) {
    const usuario = useUserRequest(req)

    const { data, error } = z
        .object({
            nome: z.string({ error: "O campo Nome é obrigatório" }).trim(),
            parentesco: parentescoZodValidacao
        })
        .safeParse(await req.json())

    if (error) {
        return Response.json({ error: error.message })
    }

    try {
        const familia = await prisma.familia.create({
            data: {
                nome: data.nome,
                responsaveis: {
                    create: {
                        foto: usuario.picture,
                        nome: usuario.name,
                        cpf: usuario.cpf,
                        sexo: usuario.gender,
                        dataNascimento: usuario.birthdate,
                        telefone: usuario.phone_number,
                        endereco: usuario.full_address,
                        celula: usuario.celula,
                        responsavelLegal: true,
                        parentesco: data.parentesco,
                    }
                }
            },
            include: {
                criancas: true,
                responsaveis: true
            }
        })

        return Response.json(familia)
    } catch (error: any) {
        if ("clientVersion" in error) {
            const message = getPrismaErrorMessage(error.code)
            return Response.json({ error: message }, { status: 400 })
        }

        return Response.json({ error: 'Falha ao cadastrar a família' }, { status: 400 })
    }
}