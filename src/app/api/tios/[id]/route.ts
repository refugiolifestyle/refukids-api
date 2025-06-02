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
            id: z.string({ required_error: "O Campo Tio id é obrigatório" })
        })
        .safeParse(await params)

    if (errorParams) {
        const [erro] = errorParams.errors
        return httpErrors.badRequest(erro.message)
    }

    const tioSnap = await db
        .ref(`refukids/tios/${dataParam.id}`)
        .get()

    if (!tioSnap.exists()) {
        return httpErrors.notFound("Tio não encontrado")
    }

    return NextResponse.json({ success: true, tio: tioSnap.val() })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const [, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data: dataParam, error: errorParams } = z
        .object({
            id: z.string({ required_error: "O Campo Tio id é obrigatório" })
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
            sexo: z.enum(["Masculino", "Feminino"]).optional(),
            telefone: z.string().trim().transform(onlyNumbers).optional(),
            parentesco: z.string().trim().optional(),
            endereco: z.string().trim().optional(),
            numero: z.string().trim().optional(),
            complemento: z.string().trim().optional(),
            bairro: z.string().trim().optional(),
            cidade: z.string().trim().optional(),
            cep: z.string().trim().transform(onlyNumbers).optional(),
        })
        .safeParse(await req.json())

    if (payloadValidationError) {
        const [erro] = payloadValidationError.errors
        return httpErrors.badRequest(erro.message)
    }

    const [, updateTioError] = await useTuple(db
        .ref(`refukids/tios/${dataParam.id}`)
        .update(payload))

    if (updateTioError != null) {
        return httpErrors.internalServerError("Falha ao atualizar o tio")
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
            id: z.string({ required_error: "O Campo Tio id é obrigatório" })
        })
        .safeParse(await params)

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    const [, deleteFamiliaTioError] = await useTuple(db
        .ref(`refukids/familias/${usuario.familia}/tios/${data.id}`)
        .remove())

    if (deleteFamiliaTioError != null) {
        return httpErrors.internalServerError("Falha ao remover o tio da familia")
    }

    const [, deleteTioError] = await useTuple(db
        .ref(`refukids/tios/${data.id}`)
        .remove())

    if (deleteTioError != null) {
        return httpErrors.internalServerError("Falha ao remover o tio")
    }

    return NextResponse.json({ success: true })
}