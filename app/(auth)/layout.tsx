import React, {FC} from 'react';

import {ClerkProvider} from "@clerk/nextjs";
import {Inter} from "next/font/google";

import {ChildrenProps} from "@common-types/props";

import "../globals.css"

export const metadata = {
    title: "Threads",
    description: "A next js 13 threads application"
}

const inter = Inter({subsets: ['latin']})

const RootLayout: FC<ChildrenProps> = ({children}) => {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <main className="w-full min-h-screen flex justify-center items-center">
                        {children}
                    </main>
                </body>
            </html>
        </ClerkProvider>
    )
};

export default RootLayout;