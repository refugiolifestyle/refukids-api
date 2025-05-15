import { db } from "@/configs/firebase";
import { useUserRequest } from "@/hooks/useUserRequest";
import { Familia } from "@/types/schema";
import * as httpErrors from '@/utils/httpErrors';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const [usuario, usuarioErro] = await useUserRequest(req)
    if (usuarioErro != null) {
        return httpErrors.unauthorized(usuarioErro.message)
    }

    const familiaSnap = await db
        .ref(`refukids/familias`)
        .child(usuario.familia as string)
        .get()

    if (!familiaSnap.exists()) {
        throw httpErrors.notFound('Família não encontrada no banco de dados')
    }

    return NextResponse.json({
        success: true,
        familia: familiaSnap.val() as Familia
    })
}
