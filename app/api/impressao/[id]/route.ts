import { useUserRequest } from "@/hooks/useUserRequest";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const _ = useUserRequest(req)

    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const impressao = await prisma.impressao.findFirst({
        select: {
            impressora: {
                select: {
                    ip: true
                }
            },
            checkin: {
                select: {
                    id: true,
                    turma: {
                        select: {
                            descricao: true
                        }
                    },
                    crianca: {
                        select: {
                            nome: true
                        }
                    }
                }
            }
        },
        where: {
            id
        }
    })

    return Response.json({ data: impressao })
}