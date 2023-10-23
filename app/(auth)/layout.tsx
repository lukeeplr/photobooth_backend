import React from "react";

import { Inter } from "next/font/google";
import '../globals.css';

import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'Threads',
    description: 'Threads feito com Next.js 13' 
}

export default function RootLayout({ 
    children 
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider localization={ptBR}>
            <html lang="pt-br">
                <body className={`${inter.className} bg-dark-1 w-full flex justify-center items-center min-h-screen`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}