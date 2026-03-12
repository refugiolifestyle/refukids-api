import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const notificacao = await prisma.notificacao.findFirst({
        where: { id }
    })

    if (!notificacao) {
        return Response.json({ error: 'Notifiação não encontrada' }, { status: 404 })
    }

    return Response.json({ data: notificacao })
}

export async function PUT(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const notificacao = await prisma.usuarioNotificacao.update({
        where: { id },
        data: { lida: true }
    })

    return Response.json({ data: notificacao })
}