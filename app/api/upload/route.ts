import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file: File | null = formData.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `refukids-${Date.now()}-${file.name}`;
        const uploadDir = path.join(process.cwd(), "uploads");

        await writeFile(path.join(uploadDir, fileName), buffer);

        return NextResponse.json({
            url: `/uploads/${fileName}`,
        });
    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
    }
}