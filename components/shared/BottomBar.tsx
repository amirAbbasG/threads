"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {sidebarLinks} from "@/constants";

const BottomBar = () => {
    const pathname = usePathname()

    return (
        <nav className="bottombar">
            <div className="bottombar_container">
                {
                    sidebarLinks.map((link) => {
                        const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route

                        return (
                            <Link
                                href={link.route}
                                className={`bottombar_link ${isActive && "bg-primary-500"}`}
                                key={link.label}
                            >
                                <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
                                <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label.split(/\s+/)[0]}</p>
                            </Link>
                        )
                    })
                }
            </div>
        </nav>
    );
};

export default BottomBar;