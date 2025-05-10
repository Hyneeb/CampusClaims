'use client';

import {JSX, useEffect, useState} from "react";
import Image from 'next/image';
import ChatButton from "@/app/posting/[id]/ChatButton";
import GalleryImg from "@/app/posting/[id]/GalleryImg";
import logo from '/public/logo.png';
import { createClient } from "@/utils/supabase/client";
import {useParams, useRouter} from "next/navigation";


export type Post = {
    id: string;
    user: { username: string };
    post_type: 'lost' | 'found';
    title: string;
    description: string | null;
    location: string | null;
    event_date: string | null; // ISO string format like "2025-05-19"
    images: string[] | null;
    created_at: string | null; // ISO timestamp
};

function Posting({ id: propId, preview = false }: { id?: string; preview?: boolean }): JSX.Element {
    const params = useParams();
    const id = propId ?? (params?.id as string);
    console.log("✅ Got post ID:", id);
    const [post, setPost] = useState<Post | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();

    useEffect(() => {
        const res = fetchPost(id, router);
        res.then((data) => {
            if (data) {
                setPost(data);
            }
        });
    }, [id, router])


    if (preview && post) {
        return (
            <div className="w-full h-[460px] bg-white rounded-2xl shadow-lg hover:shadow-xl
           transition-transform transition-shadow duration-200 ease-in-out
           hover:scale-[1.04] cursor-pointer
           overflow-hidden flex flex-col justify-between p-4 space-y-3">
                {/* Header */}
                <div className="flex justify-center items-center">
                    <h1 className="text-sm font-semibold text-blue-600">{post.title}</h1>
                </div>

                {/* Image Gallery */}
                <div className="w-full flex justify-center">
                    <GalleryImg images={post.images} preview={preview}/>
                </div>

                {/* Footer */}
                <div className="w-full flex justify-center">
                    <div className="space-y-2">
                        <p className="text-xs text-gray-600 line-clamp-4">
                            {post.description}
                        </p>
                        <p className="text-xs text-gray-600">
                            Last seen on <span className="font-semibold">{post.event_date}</span>
                        </p>

                        <h2>Posted by {post.user.username} </h2>
                    </div>
                </div>
            </div>
        );
    }

    // 🔹 Full page layout
    if (post) {
        return (
            <div className="bg-white border border-gray-200 p-6 rounded-xl max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="border rounded-lg border-gray-200 px-4 py-3 bg-gray-50">
                    <div className="grid grid-cols-3 items-center">
                        <div className="flex items-center gap-2 justify-start">
                            <Image src={logo} alt="Location symbol" width={40} height={40}/>
                            <p className="text-sm text-gray-700 font-medium">{post.location}</p>
                        </div>

                        <div className="text-center">
                            <h1 className="text-lg font-semibold text-blue-600">{post.title}</h1>
                        </div>

                        <div className="flex justify-end items-center">
                        <span
                            className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            Posted by {post.user.username}
                        </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Image */}
                    <GalleryImg images={post.images} preview={preview}/>

                    {/* Details */}
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 font-medium">
                            Last seen on <span className="font-semibold">{post.event_date}</span>
                        </p>
                        {!preview && (
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{post.description}</p>
                        )}
                        <ChatButton/>
                    </div>
                </div>
            </div>
        );
    }

    return (<div>Uh oh, seems there was a problem</div>);
}

// function fetchPost(id: string): {
//     id: string;
//     userId: string;
//     found: boolean;
//     title: string;
//     location: string;
//     date: Date;
//     images: string[];
//     description: string
// } {
//     return {
//         id: id,
//         userId: "Jakey",
//         found: parseInt(id) % 2 === 0,
//         title: "Lost my Lucario at location",
//         location: "Sample Location",
//         date: new Date(),
//         images: [ "https://static.wikia.nocookie.net/p__/images/f/f0/Maylene_Lucario.png/revision/latest?cb=20180919005303&path-prefix=protagonist",
//             "https://upload.wikimedia.org/wikipedia/en/9/95/Pok%C3%A9mon_Lucario_art.png",
//             "https://upload.wikimedia.org/wikipedia/en/4/43/Pok%C3%A9mon_Mewtwo_art.png",
//         ],
//         description: `[Verse 1]
// What do you have in store?
// One life away, we can't explore
// But I don't want to get in the way no more
// 'Cause this the type of feeling you can't ignore...
//
// [Chorus]
// I just love the way you've got me feeling
// In love with the feeling
// It's like, ooh
// Take away the pain
// Baby, I'm healing`,
//     };
// }

export async function fetchPost(id: string, router: ReturnType<typeof useRouter>): Promise<Post | null> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const g = router;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('posts')
        .select(`
      id,
      post_type,
      title,
      description,
      location,
      event_date,
      images,
      created_at,
      user:user_id!inner (
        username
      )
    `)
        .eq('id', id)
        .single();
    console.log("📦 fetchPost result:", { data, error });
    if (error) {
        console.error("Error fetching post:", {
            message: error?.message,
            code: error?.code,
            details: error?.details,
        });
        console.log(error);
        return null;
    }
    if (!data) {
        console.error("Post not found");
        return null;
    }

    return {
        ...data,
        user: Array.isArray(data.user) ? data.user[0] : data.user,
        title: `${data.post_type.toUpperCase()} ${data.title}`
    } as Post;




}

export default Posting;
