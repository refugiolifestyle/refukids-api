import { cn } from "@/utils/helpers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Refukids - Refúgio Lifestyle",
  description:
    "Somos uma rede de células pertencente à Igreja do Evangelho Quadrangular - Sede do Pará. Um movimento orgânico e relacional focado em propósito, liderança, jovens e vida com Jesus Cristo.",

  keywords: [
    "arefugio",
    "refugio",
    "refúgio",
    "refúgio lifestyle",
    "estilo de vida",
    "propósito",
    "liderança",
    "jesus",
    "cristo",
    "jovens",
    "belém",
    "igreja",
    "células",
    "discipulado",
    "discipulo",
    "refukids",
    "criancas"
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  },

  openGraph: {
    title: "Refukids - Refúgio Lifestyle",
    description:
      "Rede de células da Igreja do Evangelho Quadrangular em Belém do Pará. Vida com propósito, liderança, jovens e relacionamento com Jesus.",
    url: "https://refukids.arefugio.com.br",
    siteName: "Refukids - Refúgio Lifestyle",
    images: [
      {
        url: "https://refukids.arefugio.com.br/logo.svg",
        width: 1200,
        height: 630,
        alt: "Refukids - Refúgio Lifestyle",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Refukids - Refúgio Lifestyle",
    description:
      "Rede de células da Igreja do Evangelho Quadrangular em Belém do Pará. Vida com propósito, liderança e Jesus.",
    images: ["https://refukids.arefugio.com.br/logo.svg"],
  },

  icons: {
    icon: "https://refukids.arefugio.com.br/logo.svg",
  },
};


type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className="w-full h-full" lang="en">
      <body className={cn('antialiased w-full min-h-screen flex', inter.className)}>
        {children}
      </body>
    </html>
  );
}
