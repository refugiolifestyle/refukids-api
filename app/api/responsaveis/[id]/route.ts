import { prisma } from "@/lib/prisma";
import { celulaZodValidacao, dataNascimentoZodValidacao, enderecoZodValidacao, fotoZodValidacao, nomeZodValidacao, parentescoZodValidacao, sexoZodValidacao, telefoneZodValidacao } from "@/utils/validacoes";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const responsavel = await prisma.responsavel.findFirst({
        where: { id }
    })

    if (!responsavel) {
        return Response.json({ error: 'Responsável/Tio não encontrado' }, { status: 404 })
    }

    return Response.json(responsavel)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    const { data: payload, error: payloadError } = z
        .object({
            nome: nomeZodValidacao,
            foto: fotoZodValidacao,
            sexo: sexoZodValidacao,
            telefone: telefoneZodValidacao,
            dataNascimento: dataNascimentoZodValidacao,
            parentesco: parentescoZodValidacao,
            endereco: enderecoZodValidacao,
            celula: celulaZodValidacao
        })
        .safeParse(await req.json())

    if (payloadError) {
        return Response.json({ error: payloadError?.message }, { status: 400 })
    }

    const responsavel = await prisma.responsavel
        .update({
            data: payload,
            where: { id }
        })

    return Response.json(responsavel)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return Response.json({ error: 'Campo id é obrigatório' }, { status: 400 })
    }

    await prisma.responsavel
        .delete({ where: { id } })

    return Response.json({})
}

