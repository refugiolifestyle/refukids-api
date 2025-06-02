import { db } from "@/configs/firebase";
import { useTuple } from "@/hooks/useTuple";
import { useUserRequest } from "@/hooks/useUserRequest";
import { Tio } from "@/types/schema";
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
            cpf: z.string().trim().transform(onlyNumbers).refine(cpfValidator.isValid, { message: "CPF inválido" }),
            nome: z.string().trim().transform(capitalizeWords),
            foto: z.string().trim().url(),
            sexo: z.enum(["Masculino", "Feminino"]),
            telefone: z.string().trim().transform(onlyNumbers),
            parentesco: z.enum(["Masculino", "Feminino"]),
            endereco: z.string().trim(),
            numero: z.string().trim(),
            complemento: z.string().trim(),
            bairro: z.string().trim(),
            cidade: z.string().trim(),
            cep: z.string().trim().transform(onlyNumbers),
        })
        .safeParse(await req.json())

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    let tio = db
        .ref(`refukids/tios`)
        .push()

    const [, tioSetError] = await useTuple(tio
        .set({
            cadastradoEm: new Date().toISOString(),
            familia: usuario.familia,
            id: tio.key,
            cpf: data.cpf,
            nome: data.nome,
            foto: data.foto,
            sexo: data.sexo,
            telefone: data.telefone,
            parentesco: data.parentesco,
            endereco: data.endereco,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            cep: data.cep
        } as Tio))

    if (tioSetError != null) {
        return httpErrors.internalServerError("Falha ao cadastrar o tio")
    }

    const [, setTioFamiliaError] = await useTuple(db
        .ref(`refukids/familias/${usuario.familia}/tios/${tio.key}`)
        .set(tio.key))

    if (setTioFamiliaError != null) {
        return httpErrors.internalServerError("Falha ao anexar o tio a família")
    }

    return NextResponse.json({ success: true })
} 