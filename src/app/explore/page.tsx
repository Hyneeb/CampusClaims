'use client';
import {JSX, useEffect, useState} from "react";
import Filter from "@/components/Filter";
import { FaSearch } from "react-icons/fa";
import Posting from "@/app/posting/[id]/page";
import Link from "next/link";
import {createClient} from "@/utils/supabase/client";

export default function Explore(): JSX.Element {
    const [filter, setFilter] = useState<string>("lost");
    const [campus, setCampus] = useState<string>("");
    const [posts, setPosts] = useState<string[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const res = fetchPosts(filter, campus);
        res.then((data) => {
            if (data) {
                setPosts(data);
            }
        });
    }, [filter, campus])

    const handleFilterChange = (value: string) => {
        setFilter(value); // update parent state
    };


    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement> ) => {
        e.preventDefault();
        if (e.key != 'Enter'){
            return;
        }

        const res = fetchPosts(filter, campus, search);
        res.then((data) => {
            if (data) {
                setPosts(data);
            }
        });

    }

    return (
        <div className="min-h-screen p-8 flex flex-col items-center gap-8">
            {/* Banner */}

            {/* Search + Filter section – stays narrow */}
            <section className="w-full max-w-4xl flex flex-col gap-6">
                {/* Filter Row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 w-full">
                    {/* Campus Dropdown */}
                    <div className="flex flex-col w-full sm:w-1/3">
                        <div className="relative">
                            <select
                                value={campus}
                                onChange={(e) => setCampus(e.target.value)}
                                className="w-full appearance-none px-4 py-3 pr-10 rounded-full text-sm text-center shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            >
                                <option value="">Choose A Campus...g</option>
                                <option value="TMU">Toronto Metropolitan University (TMU)</option>
                                <option value="UTM">University of Toronto Mississauga (UTM)</option>
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▼</div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col w-full sm:flex-1 mt-4 sm:mt-0">
                        <label className="block text-sm font-semibold text-transparent sm:mb-2">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full px-5 pr-12 py-3 text-base border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyUp={handleSearchSubmit}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
                            >
                                <FaSearch className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="w-full flex justify-center">
                    <Filter onChange={handleFilterChange} />
                </div>
            </section>


            {/* Grid section – allowed to span the whole page */}
            <section className="w-full py-8">
                <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
                    {posts.map((id) => (
                        <Link key={id} href={"/posting/" + id + "/"}>
                        <Posting key={id} id={id} preview={true}/>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

async function fetchPosts(post_type: string, campus: string, item?: string): Promise<string[]> {
    const VALID_CAMPUSES = ["TMU", "UTM"] as const;
    const supabase = await createClient();


    let query = supabase
        .from('posts')
        .select('id') // just fetch IDs
        .eq('post_type', post_type);
    if (item){
        query = query.ilike('title', `%${item}%`);
    }

    if (VALID_CAMPUSES.includes(campus as typeof VALID_CAMPUSES[number])) {
        query = query.eq('campus', campus); // assuming `campus` is a column in your table
    }


    // without using search:

    const {data, error} = await query

    if (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }

    return data.map(post => post.id);
}
