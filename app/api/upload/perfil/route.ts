import { minioClient } from "@/lib/minio";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file: File | null = formData.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json(
                { error: "Nenhum arquivo enviado." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const bucket = "refukids";

        const ext = file.name.split(".").pop();
        const fileName = `perfil/${randomUUID()}.${ext}`;

        await minioClient.putObject(bucket, fileName, buffer, buffer.length, {
            "Content-Type": file.type,
        });

        return NextResponse.json({
            data: {
                url: `${process.env.MINIO_PUBLIC_URL}/${bucket}/${fileName}`,
            }
        });
    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
    }
}