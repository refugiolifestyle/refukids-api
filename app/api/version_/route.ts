import { appversion } from "@/package.json";
import { NextResponse } from "next/server";

export async function GET() {


    return NextResponse.json({
        data: {
            version: appversion,
            url: {
                android: "https://play.google.com/store/apps/details?id=br.com.arefugio.refukids",
                ios: "https://apps.apple.com/app/br.com.arefugio.refukids"
            }
        }
    })
}