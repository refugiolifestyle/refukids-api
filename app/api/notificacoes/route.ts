import { useUserRequest } from "@/hooks/useUserRequest";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const usuario = useUserRequest(req)

    const notificacoes = await prisma.notificacao.findMany({
        select: {
            titulo: true,
            descricao: true,
            cadastradoEm: true,
            notificadoPor: {
                select: {
                    nome: true,
                    foto: true
                }
            }
        },
        where: {
            usuariosNotificados: {
                every: usuario.realm_access?.roles.includes('servo')
                    ? { notificadoParaServo: { cpf: usuario.cpf } }
                    : { notificadoParaResponsavel: { cpf: usuario.cpf } }
            }
        }
    })

    return Response.json(notificacoes)
}

export async function POST(req: NextRequest) {
    const usuario = useUserRequest(req)

    const token = req.nextUrl.searchParams.get('token')
    if (!token) {
        return Response.json({ error: 'Campo Token é obrigatório' }, { status: 400 })
    }

    if (usuario.realm_access?.roles.includes('servo')) {
        await prisma.servo.updateMany({
            data: { notificacoesToken: token },
            where: { cpf: usuario.cpf }
        })
    }
    else {
        await prisma.responsavel.updateMany({
            data: { notificacoesToken: token },
            where: { cpf: usuario.cpf }
        })
    }

    return Response.json({ data: {} })
}

export async function PUT(req: NextRequest) {
    const usuario = useUserRequest(req)

    await prisma.usuarioNotificacao.updateMany({
        data: {
            lida: true
        },
        where: usuario.realm_access?.roles.includes('servo')
            ? { notificadoParaServo: { cpf: usuario.cpf } }
            : { notificadoParaResponsavel: { cpf: usuario.cpf } }
    })

    return Response.json({ data: {} })
}