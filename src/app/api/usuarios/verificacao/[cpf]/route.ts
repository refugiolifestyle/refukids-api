import { db } from "@/configs/firebase";
import { Usuario } from "@/types/schema";
import { onlyNumbers } from "@/utils/helpers";
import * as httpErrors from '@/utils/httpErrors';
import { cpf } from "cpf-cnpj-validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: Promise<{ cpf: string }> }) {
    const { data, error } = z
        .object({
            cpf: z.string({ required_error: "O Campo CPF é obrigatório" }).trim().transform(onlyNumbers).refine(cpf.isValid, { message: "O Campo CPF está inválido" }),
        })
        .safeParse(await params)

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    const usuarioSnap = await db
        .ref(`refukids/usuarios`)
        .orderByChild('cpf')
        .equalTo(data.cpf)
        .limitToFirst(1)
        .get()

    if (!usuarioSnap.exists()) {
        throw httpErrors.notFound('Usuário não encontrado no banco de dados')
    }

    const [usuario] = Object.values(usuarioSnap.val()) as Usuario[]

    return NextResponse.json({
        success: true,
        email: usuario.email,
        cadastroFinalizado: usuario.cadastroFinalizado
    })
}