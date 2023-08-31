"use client"
import React from 'react';

import Link from "next/link";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";

import {SignedIn, SignOutButton, useAuth} from "@clerk/nextjs";

import {sidebarLinks} from "@/constants";

const LeftSideBar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const {userId} = useAuth()

    return (
        <aside className="custom-scrollbar leftsidebar">
                <div className="flex flex-col w-full gap-6 px-6">
                    {
                        sidebarLinks.map((link) => {
                            const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route
                            if (link.route === "/profile") link.route = `/profile/${userId}`

                            return (
                                <Link
                                    href={link.route}
                                    className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
                                    key={link.label}
                                >
                                    <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
                                    <p className="text-light-1 max-lg:hidden">{link.label}</p>
                                </Link>
                            )
                        })
                    }
                </div>
            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                        <div className='flex cursor-pointer gap-4 p-4'>
                            <Image
                                src='/assets/logout.svg'
                                alt='logout'
                                width={24}
                                height={24}
                            />
                            <p className="text-light-2 max-lg:hidden">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </aside>
    );
};

export default LeftSideBar;