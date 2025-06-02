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
            id: z.string({ required_error: "O Campo Responsável id é obrigatório" })
        })
        .safeParse(await params)

    if (errorParams) {
        const [erro] = errorParams.errors
        return httpErrors.badRequest(erro.message)
    }

    const tioSnap = await db
        .ref(`refukids/responsaveis/${dataParam.id}`)
        .get()

    if (!tioSnap.exists()) {
        return httpErrors.notFound("Responsável não encontrado")
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
            id: z.string({ required_error: "O Campo Responsável id é obrigatório" })
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

    const [, updateResponsavelError] = await useTuple(db
        .ref(`refukids/responsaveis/${dataParam.id}`)
        .update(payload))

    if (updateResponsavelError != null) {
        return httpErrors.internalServerError("Falha ao atualizar o responsável")
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
            id: z.string({ required_error: "O Campo Responsável id é obrigatório" })
        })
        .safeParse(await params)

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    const [, deleteFamiliaResponsavelError] = await useTuple(db
        .ref(`refukids/familias/${usuario.familia}/responsaveis/${data.id}`)
        .remove())

    if (deleteFamiliaResponsavelError != null) {
        return httpErrors.internalServerError("Falha ao remover o responsável da familia")
    }

    const [, deleteResponsavelError] = await useTuple(db
        .ref(`refukids/responsaveis/${data.id}`)
        .remove())

    if (deleteResponsavelError != null) {
        return httpErrors.internalServerError("Falha ao remover o responsável")
    }

    return NextResponse.json({ success: true })
}