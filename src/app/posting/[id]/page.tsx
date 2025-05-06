'use client';

import { JSX } from "react";
import Image from 'next/image';
import ChatButton from "@/app/posting/[id]/ChatButton";
import GalleryImg from "@/app/posting/[id]/GalleryImg";
import logo from '/public/logo.png';

function Posting(props: { id: string; preview?: boolean }): JSX.Element {
    const { id, preview = false } = props;
    const post = fetchPost(id);

    if (preview) {
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
                    <GalleryImg images={post.images} preview={preview} />
                </div>

                {/* Footer */}
                <div className="w-full flex justify-center">
                    <div className="space-y-2">
                        <p className="text-xs text-gray-600">
                            Last seen on <span className="font-semibold">{post.date.toDateString()}</span>
                        </p>
                        <h2>Posted by {post.userId} </h2>
                    </div>
                </div>
            </div>
        );
    }

    // 🔹 Full page layout
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-8">
            {/* Header */}
            <div className="border-2 rounded-2xl border-gray-200 pb-4 mb-6 bg-gray-100">
                <div className="grid grid-cols-3 items-center">
                    <div className="flex items-center gap-2 justify-start pl-4">
                        <Image src={logo} alt="Location symbol" width={40} height={40} />
                        <p className="text-sm text-gray-700 font-medium">{post.location}</p>
                    </div>

                    <div className="text-center">
                        <h1 className="text-lg font-semibold text-blue-600">{post.title}</h1>
                    </div>

                    <div className="flex justify-end items-center pr-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                        Posted&nbsp;by&nbsp;{post.userId}
                      </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 rounded-2xl bg-white shadow-md">
                {/* Image */}
                <GalleryImg images={post.images} preview={preview} />

                {/* Details */}
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 font-medium">
                        Last seen on <span className="font-semibold">{post.date.toDateString()}</span>
                    </p>
                    {!preview && (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                            {post.description}
                        </p>
                    )}
                    <ChatButton />
                </div>
            </div>
        </div>
    );
}


function fetchPost(id: string): {
    id: string;
    userId: string;
    found: boolean;
    title: string;
    location: string;
    date: Date;
    images: string[];
    description: string
} {
    return {
        id: id,
        userId: "Jakey",
        found: parseInt(id) % 2 === 0, // fake condition rn even => found object, odd => lost object
        title: "Lost my Lucario at location",
        location: "Sample Location",
        date: new Date(),
        images: [
            "https://upload.wikimedia.org/wikipedia/en/9/95/Pok%C3%A9mon_Lucario_art.png",
            "https://upload.wikimedia.org/wikipedia/en/4/43/Pok%C3%A9mon_Mewtwo_art.png",
        ],
        description: `[Verse 1]
What do you have in store?
One life away, we can't explore
But I don't want to get in the way no more
'Cause this the type of feeling you can't ignore...

[Chorus]
I just love the way you've got me feeling
In love with the feeling
It's like, ooh
Take away the pain
Baby, I'm healing`,
    };
}

export default Posting;
