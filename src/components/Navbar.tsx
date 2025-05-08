'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

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
        <header className="bg-blue-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-wide">
                    CampusClaims
                </Link>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="sm:hidden focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <nav className="hidden sm:flex gap-6 text-sm">
                    <Link href="/explore" className="hover:underline">Explore</Link>
                    <Link href="/create" className="hover:underline">Post</Link>
                    {isLoggedIn ? (
                        <>
                            <Link href="/account" className="hover:underline">Account</Link>
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="hover:underline">Logout</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:underline">Login</Link>
                            <Link href="/signup" className="hover:underline">Signup</Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="sm:hidden px-4 pb-3 bg-blue-700">
                    <Link href="/explore" className="block py-1">Explore</Link>
                    <Link href="/create" className="block py-1">Post</Link>
                    {isLoggedIn ? (
                        <>
                            <Link href="/account" className="block py-1">Account</Link>
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="block py-1 text-left">Logout</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block py-1">Login</Link>
                            <Link href="/signup" className="block py-1">Signup</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}

