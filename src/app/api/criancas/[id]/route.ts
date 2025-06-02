import { db } from "@/configs/firebase";
import { useTuple } from "@/hooks/useTuple";
import { useUserRequest } from "@/hooks/useUserRequest";
import { capitalizeWords, onlyNumbers } from "@/utils/helpers";
import * as httpErrors from '@/utils/httpErrors';
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const [, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data: dataParam, error: errorParams } = z
        .object({
            id: z.string({ required_error: "O Campo Criança id é obrigatório" })
        })
        .safeParse(await params)

    if (errorParams) {
        const [erro] = errorParams.errors
        return httpErrors.badRequest(erro.message)
    }

    const criancaSnap = await db
        .ref(`refukids/criancas/${dataParam.id}`)
        .get()

    if (!criancaSnap.exists()) {
        return httpErrors.notFound("Criança não encontrada")
    }

    return NextResponse.json({ success: true, tio: criancaSnap.val() })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const [, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data: dataParam, error: errorParams } = z
        .object({
            id: z.string({ required_error: "O Campo Criança id é obrigatório" })
        })
        .safeParse(await params)

    if (errorParams) {
        const [erro] = errorParams.errors
        return httpErrors.badRequest(erro.message)
    }

    const { data: payload, error: payloadValidationError } = z
        .object({
            nome: z.string().trim().transform(capitalizeWords).optional(),
            foto: z.string().trim().url().optional(),
            dataNascimento: z.string().date().optional(),
            sexo: z.enum(["Masculino", "Feminino"]).optional(),
            observacao: z.string().trim().optional()
        })
        .safeParse(await req.json())

    if (payloadValidationError) {
        const [erro] = payloadValidationError.errors
        return httpErrors.badRequest(erro.message)
    }

    const [, updateCriancaError] = await useTuple(db
        .ref(`refukids/criancas/${dataParam.id}`)
        .update(payload))

    if (updateCriancaError != null) {
        return httpErrors.internalServerError("Falha ao atualizar a criança")
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const [usuario, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data, error } = z
        .object({
            id: z.string({ required_error: "O Campo Criança id é obrigatório" })
        })
        .safeParse(await params)

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    const [, deleteFamiliaCriancaError] = await useTuple(db
        .ref(`refukids/familias/${usuario.familia}/criancas/${data.id}`)
        .remove())

    if (deleteFamiliaCriancaError != null) {
        return httpErrors.internalServerError("Falha ao remover a criança da familia")
    }

    const [, deleteCriancaError] = await useTuple(db
        .ref(`refukids/criancas/${data.id}`)
        .remove())

    if (deleteCriancaError != null) {
        return httpErrors.internalServerError("Falha ao remover a criança")
    }

    return NextResponse.json({ success: true })
}