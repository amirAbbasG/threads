import {ReactNode} from "react"

import {Inter} from 'next/font/google'

import {ClerkProvider} from "@clerk/nextjs";

import {BottomBar, LeftSideBar, RightSideBar, TopBar} from "@components/shared";
import '../globals.css'

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: "Threads",
    description: "A next js 13 threads application"
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={inter.className}>
                <TopBar/>
                <main className="flex">
                    <LeftSideBar/>
                    <section className="main-container">
                        <div className="w-full max-w-4xl">
                            {children}
                        </div>
                    </section>
                    <RightSideBar/>
                </main>
                <BottomBar/>
            </body>
            </html>
        </ClerkProvider>
    )
}
