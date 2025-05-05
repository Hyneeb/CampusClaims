'use client';

import Image from 'next/image';
import logo from '/public/logo.png';

export default function AuthWrapper({
                                        children,
                                        title,
                                    }: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <div className="flex justify-center mb-4">
                    <Image src={logo} alt="CampusClaims Logo" width={150} height={150} />
                </div>
                <h2 className="text-2xl font-bold text-[#2563eb] mb-6">{title}</h2>
                {children}
            </div>
        </div>
    );
}
