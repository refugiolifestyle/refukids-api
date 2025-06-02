import { auth, db } from "@/configs/firebase";
import { useTuple } from "@/hooks/useTuple";
import { useUserRequest } from "@/hooks/useUserRequest";
import { Familia, Usuario } from "@/types/schema";
import { capitalizeWords, onlyNumbers } from "@/utils/helpers";
import * as httpErrors from '@/utils/httpErrors';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { UserRecord } from "firebase-admin/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const { data, error } = z
        .object({
            cpf: z.string().trim().transform(onlyNumbers).refine(cpfValidator.isValid, { message: "CPF inválido" }),
            email: z.string().trim().email(),
            nome: z.string().trim().min(10, "O Nome precisa ser completo").transform(capitalizeWords),
            foto: z.string().trim().url("A foto precisa ser uma URL Válida").optional(),
            senha: z.string().min(6),
            notificacoesToken: z.string().optional(),
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

    const familiaSobrenome = data.nome.split(" ").pop()
    const familia = db
        .ref("refukids/familias")
        .push()

    const [, familiaSetError] = await useTuple(familia.set({ id: familia.key, nome: familiaSobrenome, cadastradoEm: new Date().toISOString() }))
    if (familiaSetError != null) {
        return httpErrors.internalServerError("Falha ao cadastrar a família")
    }

    let responsavel = db.ref(`refukids/responsaveis`).push()

    const [, responsavelSetError] = await useTuple(responsavel
        .set({
            cadastradoEm: new Date().toISOString(),
            id: responsavel.key,
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
        }))

    if (responsavelSetError != null) {
        return httpErrors.internalServerError("Falha ao cadastrar o responsável")
    }

    const [, setFamiliaError] = await useTuple(db
        .ref(`refukids/familias/${familia.key}/responsaveis`)
        .push()
        .set(responsavel.key))

    if (setFamiliaError != null) {
        httpErrors.internalServerError("Falha ao anexar o responsável a família")
    }

    const [fbUsuario, setFbUsuarioError] = await useTuple<UserRecord, { code: string }>(auth
        .createUser({
            email: data.email,
            disabled: false,
            displayName: data.nome,
            password: data.senha,
            photoURL: data.foto
        }))

    if (setFbUsuarioError != null) {
        if (setFbUsuarioError.code == "auth/email-already-exists") {
            throw httpErrors.conflict("Email já cadastrado no sistema")
        }

        throw httpErrors.internalServerError("Falha ao cadastrar o usuário no sistema")
    }

    const [, setUsuarioError] = await useTuple(db
        .ref(`refukids/usuarios/${data.cpf}`)
        .set({
            cpf: data.cpf,
            email: data.email,
            nome: data.nome,
            foto: data.foto,
            familia: familia.key,
            notificacoesToken: data.notificacoesToken,
            uid: fbUsuario.uid,
            cadastroFinalizado: true,
            cadastradoEm: new Date().toISOString()
        } as Usuario))

    if (setUsuarioError != null) {
        return httpErrors.internalServerError("Falha ao cadastrar o usuário no banco de dados")
    }

    return NextResponse.json({ success: true })
}

export async function PUT(req: Request) {
    const [usuario, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data, error } = z
        .object({
            nome: z.string().trim().transform(capitalizeWords),
            foto: z.string().trim().url("A foto precisa ser uma URL Válida").optional(),
            nomeFamilia: z.string().trim().transform(capitalizeWords).optional(),
        })
        .safeParse(await req.json())

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    if (data.nomeFamilia) {
        const [, familiaSetError] = await useTuple(db
            .ref(`refukids/familia`)
            .child(usuario.familia as string)
            .update({ nome: data.nomeFamilia } as Familia))

        if (familiaSetError != null) {
            return httpErrors.internalServerError("Falha ao atualizar o nome da família")
        }
    }

    const [, usuariosUpdateError] = await useTuple(db
        .ref(`refukids/usuarios`)
        .child(usuario.cpf)
        .update({ nome: data.nome, foto: data.foto }))

    if (usuariosUpdateError != null) {
        return httpErrors.internalServerError("Falha ao atualizar o usuário no banco de dados")
    }

    const [, usuarioFbUpdateError] = await useTuple<UserRecord, { code: string }>(auth
        .updateUser(usuario.uid!, { displayName: data.nome, photoURL: data.foto }))

    if (usuarioFbUpdateError != null) {
        if (usuarioFbUpdateError.code == "auth/user-not-found") {
            return httpErrors.notFound("Usuário não encontrado no sistema")
        }

        return httpErrors.internalServerError("Falha ao atualizar o usuário no sistema")
    }

    return NextResponse.json({ success: true })
}