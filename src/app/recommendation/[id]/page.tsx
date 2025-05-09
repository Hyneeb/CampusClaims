'use client';
import {createClient} from "@/utils/supabase/client";
import {useEffect, useState, JSX} from "react";
import {useParams} from "next/navigation";
import Link from "next/link";
import Posting from "@/app/posting/[id]/page";


export default function RecommendationPage(): JSX.Element {
    const params = useParams();
    const id = params?.id as string;
    if (!id) {
        throw new Error("ID is required");
    }
    const [posts, setPosts] = useState<string[]>([]);
    console.log("✅ Got initial post ID:", id);


    useEffect(() => {

        const res = fetchPosts(id);
        res.then((data) => {
            if (data) {
                setPosts(data);
            }
        });
    }, [id]);


    return (
        <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12">
            <div className="mx-auto max-w-7xl px-6">
                {/* 👉 centered heading */}
                <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                    Recommended&nbsp;Matches
                </h1>

                <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((postId) => (
                        /* 👉 link is only as big as the card */
                        <Link
                            key={postId}
                            href={`/posting/${postId}`}
                            className="relative block group"
                        >
                            <Posting id={postId} preview />

                            {/* subtle hover ring, perfectly hugs the card */}
                            <span className="absolute inset-0 rounded-2xl ring-blue-500/20 ring-offset-2 transition-opacity opacity-0 group-hover:opacity-100" />
                        </Link>
                    ))}
                </section>
            </div>
        </main>
    );
}


async function fetchPosts(id: string): Promise<string[]> {
    const supabase = await createClient();

    // Step 1: Get the original post's info
    const { data: post, error: postError } = await supabase
        .from('posts')
        .select('post_type, title, campus')
        .eq('id', id)
        .single();

    if (postError || !post) {
        console.error("Failed to fetch original post:", postError || "Not found");
        return [];
    }

    const { post_type, title, campus } = post;

    // Step 2: Find recommendations (opposite type but same title + campus)
    const { data, error } = await supabase
        .from('posts')
        .select('id')
        .neq('post_type', post_type)
        .eq('campus', campus)
        .eq('title', title)
        .limit(3);  // Optional, limit recommendations

    if (error || !data) {
        console.error("Failed to fetch recommendations:", error || "None found");
        return [];
    }

    return data.map((post) => post.id);
}
