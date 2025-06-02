import { db } from "@/configs/firebase";
import { useTuple } from "@/hooks/useTuple";
import { useUserRequest } from "@/hooks/useUserRequest";
import { Crianca } from "@/types/schema";
import { capitalizeWords, onlyNumbers } from "@/utils/helpers";
import * as httpErrors from '@/utils/httpErrors';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const [usuario, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data, error } = z
        .object({
            nome: z.string().trim().transform(capitalizeWords),
            foto: z.string().trim().url(),
            dataNascimento: z.string().date(),
            sexo: z.enum(["Masculino", "Feminino"]),
            observacao: z.string().trim().optional(),
        })
        .safeParse(await req.json())

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    let crianca = db
        .ref(`refukids/criancas`)
        .push()

    const [, criancaSetError] = await useTuple(crianca
        .set({
            cadastradoEm: new Date().toISOString(),
            familia: usuario.familia,
            id: crianca.key,
            dataNascimento: data.dataNascimento,
            foto: data.foto,
            nome: data.nome,
            sexo: data.sexo,
            observacao: data.observacao || null
        } as Crianca))

    if (criancaSetError != null) {
        return httpErrors.internalServerError("Falha ao cadastrar a crianca")
    }

    const [, setCriancaFamiliaError] = await useTuple(db
        .ref(`refukids/familias/${usuario.familia}/criancas/${crianca.key}`)
        .set(crianca.key))

    if (setCriancaFamiliaError != null) {
        return httpErrors.internalServerError("Falha ao anexar a crianca na família")
    }

    return NextResponse.json({ success: true })
} 