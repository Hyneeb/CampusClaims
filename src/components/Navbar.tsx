'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import logo from '/public/logo-w.png';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        };
        checkUser();
    }, []);

    return (
        <>
            {/* Banner */}
            <div className="w-full bg-blue-800 text-white text-center font-bold shadow-md py-4 flex items-center justify-between px-4">
                {/* Left: Location with icon */}
                <div className="flex items-center gap-2 justify-start pl-4">
                    <Link href="/">
                        <Image src={logo} alt="Location symbol" width={40} height={40}/>
                    </Link>
                </div>
                <h1 className="text-2xl">CampusClaims</h1>
                {/* Menu */}
                <div className="flex items-center gap-2 justify-end pr-4 relative">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        <Bars3Icon className="h-6 w-6 text-white cursor-pointer" />
                    </button>
                </div>

                {/* Dropdown menu */}
                {menuOpen && (
                    <div className="absolute top-10 right-0 mt-2 w-48 bg-white text-blue-600 rounded shadow-md z-50">
                        <ul className="flex flex-col">
                        {!isLoggedIn ? (
                            <>
                            <li className="px-4 py-2 hover:bg-gray-100">
                                <Link href="/explore">Explore!</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100">
                                <Link href="/login">Login</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100">
                                <Link href="/signup">Sign Up</Link>
                            </li>
                            </>
                        ) : (
                            <>
                            <li className="px-4 py-2 hover:bg-gray-100">
                                <Link href="/explore">Explore!</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsLoggedIn(false)}>
                            Logout
                            </li>
                            </>
                        )}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

