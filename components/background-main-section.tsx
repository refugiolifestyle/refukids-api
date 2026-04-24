"use client"

import { useEffect } from "react";

export default function BackgroundMainSection({ url, additionalStyle }: { url: string, additionalStyle?: Partial<CSSStyleDeclaration> }) {
    useEffect(() => {
        const element = document.getElementById('main-section')
        let style = element?.style

        if (style) {
            style.backgroundImage = `url(${url})`

            if (additionalStyle) {
                style = Object.assign(style, additionalStyle)
            }
        }
    }, [])

    return null
}