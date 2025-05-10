'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Post = {
    id: string;
    title: string;
    description: string;
    location: string;
    event_date: string;
    campus: string;
    images: string[];
};

export default function ProfilePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        const fetchUserPosts = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) {
                router.push('/login');
                return;
            }


            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('username')
                .eq('id', user.id)
                .single();
            if (userError) {
                console.error('Error fetching user data:', userError);
                return [];
            }
            setUserName(userData.username ?? null);


            const { data, error: postError } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id);

            if (postError) {
                console.error('Error fetching posts:', postError);
            } else {
                setPosts(data || []);
            }

            setLoading(false);
        };

        void fetchUserPosts();
    }, [router]);

    if (loading) return <p className="p-6">Loading your posts...</p>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome, {userName}</h1>
            {posts.length === 0 ? (
                <p className="text-center">You haven&#39;t created any posts yet.</p>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="relative group border p-4 rounded shadow hover:bg-gray-50 transition"
                        >
                            {/* Hover buttons */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/edit/${post.id}`);
                                    }}
                                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // You can replace this with a real delete handler
                                        if (confirm('Are you sure you want to delete this post?')) {
                                            console.log('Delete post', post.id);
                                            // Call delete function here
                                        }
                                    }}
                                    className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Post content */}
                            <Link href={`/posting/${post.id}`}>
                                <div>
                                    <h2 className="text-xl font-semibold">{post.title}</h2>
                                    <p className="text-gray-600 mb-2">{post.description}</p>
                                    <p className="text-sm text-gray-500">📍 {post.location}</p>
                                    <p className="text-sm text-gray-500">🏫 {post.campus}</p>
                                    <p className="text-sm text-gray-500">🗓️ {post.event_date}</p>
                                    {post.images && post.images.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {post.images.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={`Post image ${idx + 1}`}
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}