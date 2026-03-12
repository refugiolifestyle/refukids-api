import { useUserRequest } from "@/hooks/useUserRequest";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const _ = useUserRequest(req)

    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const checkin = await prisma.checkin.findFirst({
        select: {
            id: true,
            cadastradoEm: true,
            eventos: {
                select: {
                    id: true,
                    tipo: true,
                    anotacao: true,
                    cadastradoEm: true,
                    checkinPor: {
                        select: {
                            id: true,
                            foto: true,
                            nome: true
                        }
                    },
                    acolhidoPor: {
                        select: {
                            id: true,
                            foto: true,
                            nome: true
                        }
                    },
                    checkoutPor: {
                        select: {
                            id: true,
                            foto: true,
                            nome: true
                        }
                    },
                    checkoutPara: {
                        select: {
                            id: true,
                            foto: true,
                            nome: true
                        }
                    },
                    anotadoPor: {
                        select: {
                            id: true,
                            foto: true,
                            nome: true
                        }
                    }
                },
                orderBy: {
                    cadastradoEm: 'asc'
                },
                where: {
                    responsaveisNotificados: true
                }
            },
            turma: {
                select: {
                    descricao: true
                }
            }
        },
        where: { id }
    })
    if (!checkin) {
        return Response.json({ error: 'Checkin não encontrado' }, { status: 404 })
    }

    return Response.json(checkin)
}