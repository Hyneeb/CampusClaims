'use client';
import {JSX, useState} from "react";
import Filter from "@/components/Filter";
import { FaSearch } from "react-icons/fa";
import Posting from "@/app/posting/[id]/page";
import Link from "next/link";

export default function Explore(): JSX.Element {
    const posts = fetchPosts();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState<string>("lost");

    const handleFilterChange = (value: string) => {
        setFilter(value); // update parent state
    };

    return (
        <div className="min-h-screen p-8 flex flex-col items-center gap-8">
            {/* Banner */}
            <div id="banner" className="w-full text-center text-2xl font-bold border-b pb-4">
                CampusClaims
            </div>

            {/* Search + Filter section – stays narrow */}
            <section className="w-full max-w-md flex flex-col items-center gap-4">
                <Filter onChange={handleFilterChange} />

                {/* Search bar */}
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-5 pr-12 py-3 text-base border border-gray-300 rounded-full
                       shadow-md focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-blue-600
                       rounded-full hover:bg-blue-700 transition"
                    >
                        <FaSearch className="text-sm" />
                    </button>
                </div>
            </section>

            {/* Grid section – allowed to span the whole page */}
            <section className="w-full py-8">
                <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
                    {posts.map((id) => (
                        <Link key={id} href={"/posting/" + id + "/"}>
                        <Posting key={id} id={id} preview />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

function fetchPosts():string[] {
    return [1, 2, 3, 4, 5, 6, 7].map((i) => `${i}`);
}
