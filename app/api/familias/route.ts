import { useUserRequest } from "@/hooks/useUserRequest"
import { prisma } from "@/lib/prisma"
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
                        }
                    }
                }
            }
        },
        where: {
            responsaveis: {
                some: {
                    cpf: usuario.cpf
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
}
