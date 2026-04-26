"use client"

import { Menu as MenuIcon, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Menu() {
    const path = usePathname()
    const [open, setOpen] = useState(false)

    const menus = [
        { href: '/', titulo: 'Início' },
        { href: 'https://arefugio.com.br', titulo: 'A Refúgio' }
    ]

    const isActive = (href: string) =>
        (href.length === 1 && href === path) ||
        (href.length > 1 && path.startsWith(href))

    // fechar com ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    // bloquear scroll do body quando menu aberto
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto"
    }, [open])

    return (
        <>
            {/* DESKTOP */}
            <nav className="hidden md:flex flex-row gap-4 text-white font-normal text-lg">
                {menus.map(menu => (
                    <Link
                        key={menu.titulo}
                        href={menu.href}
                        className="hover:text-gray-400"
                    >
                        {menu.titulo}
                        {isActive(menu.href) && (
                            <div className="h-1 w-12 bg-gradient-to-r from-[#ad1a1c] to-[#830b0c]" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* MOBILE BUTTON */}
            <button
                className="md:hidden text-white"
                onClick={() => setOpen(true)}
                aria-label="Abrir menu"
            >
                <MenuIcon size={28} />
            </button>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* DRAWER */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-[#1a1a1a] z-50 transform transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <img width={144} height={48} src="/logo.svg" alt="Logo da Refúgio" />

                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Fechar menu"
                    >
                        <X className="text-white" />
                    </button>
                </div>

                {/* MENU */}
                <div className="flex flex-col p-4 gap-4">
                    {menus.map(menu => (
                        <Link
                            key={menu.titulo}
                            href={menu.href}
                            onClick={() => setOpen(false)}
                            className="text-white text-lg"
                        >
                            {menu.titulo}

                            {isActive(menu.href) && (
                                <div className="h-1 w-12 bg-gradient-to-r from-[#ad1a1c] to-[#830b0c]" />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}