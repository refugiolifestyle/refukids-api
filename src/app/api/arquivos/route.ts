import { storage } from "@/configs/firebase";
import { useUserRequest } from "@/hooks/useUserRequest";
import * as httpErrors from '@/utils/httpErrors';
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const [usuario, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const { data, error } = z
        .object({
            arquivo: z.string({ required_error: "O Campo arquivo é obrigatório" }).min(2),
            formato: z.string({ required_error: "O Campo formato é obrigatório" }).min(2)
        })
        .safeParse(await req.json())

    if (error) {
        const [erro] = error.errors
        return httpErrors.badRequest(erro.message)
    }

    const bucket = storage.bucket();

    const pathname = `usuarios/${usuario.cpf}/${Date.now()}_${data.arquivo}`
    const file = bucket.file(pathname);

    const [upload] = await file.getSignedUrl({
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType: data.formato,
    });

    return NextResponse.json({
        success: true,
        pathname,
        upload
    })
}
