'use client';

import { usePathname } from "next/navigation";
import Search from "./Search";


export default function Header() {
    const pathname = usePathname();


    const showSearch = pathname === "/"
    if (pathname === "/profile") return null;


    return (
        <header className="top-bar">
            <img src="/images/logo.png" alt="AR squared logo" className="logo" />
            {showSearch && <Search />}

        </header>
    );
}