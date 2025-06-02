import { db } from "@/configs/firebase";
import { useTuple } from "@/hooks/useTuple";
import { useUserRequest } from "@/hooks/useUserRequest";
import { Responsavel, Tio, Usuario } from "@/types/schema";
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
            parentesco: z.string().trim(),
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
    
    const [, familiaSetError] = await useTuple(db
        .ref(`refukids/usuarios/${data.cpf}`)
        .set({
            cadastradoEm: new Date().toISOString(),
            cadastroFinalizado: false,
            cpf: data.cpf,
            nome: data.nome,
            familia: usuario.familia,
            foto: data.foto
        } as Usuario))

    if (familiaSetError != null) {
        return httpErrors.internalServerError("Falha ao cadastrar o usuário do responsável")
    }

    let responsavel = db
        .ref(`refukids/responsaveis`)
        .push()
    
    const [, responsavelSetError] = await useTuple(responsavel
        .set({
            cadastradoEm: new Date().toISOString(),
            id: responsavel.key,
            familia: usuario.familia,
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
        } as Responsavel))

    if (responsavelSetError != null) {
        return httpErrors.internalServerError("Falha ao cadastrar o responsável")
    }

    const [, setResponsavelFamiliaError] = await useTuple(db
        .ref(`refukids/familias/${usuario.familia}/responsaveis/${responsavel.key}`)
        .set(responsavel.key))

    if (setResponsavelFamiliaError != null) {
        return httpErrors.internalServerError("Falha ao anexar o responsável a família")
    }

    return NextResponse.json({ success: true })
} 