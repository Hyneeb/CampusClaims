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

type Conversation = {
    id: string;
    user1_id: string;
    user2_id: string;
};

function urlToPath(url: string) {
    const marker = '/object/public/images/';
    const idx = url.indexOf(marker);
    if (idx === -1) return url;
    const encodedPath = url.slice(idx + marker.length);
    return decodeURIComponent(encodedPath);
}

export default function ProfilePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProfileData = async () => {
            const supabase = createClient();
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) {
                router.push('/login');
                return;
            }

            setUserId(user.id);

            const { data: userData } = await supabase
                .from('users')
                .select('username')
                .eq('id', user.id)
                .single();
            setUserName(userData?.username ?? null);

            const { data: postData } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id);
            setPosts(postData || []);

            const { data: convoData } = await supabase
                .from('conversations')
                .select('*')
                .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
            setConversations(convoData || []);

            const otherUserIds = new Set<string>();
            convoData?.forEach((c) => {
                const otherId = c.user1_id === user.id ? c.user2_id : c.user1_id;
                otherUserIds.add(otherId);
            });

            if (otherUserIds.size > 0) {
                const { data: users } = await supabase
                    .from('users')
                    .select('id, username')
                    .in('id', Array.from(otherUserIds));
                const mapping: Record<string, string> = {};
                users?.forEach((u) => (mapping[u.id] = u.username));
                setUsernames(mapping);
            }

            setLoading(false);
        };

        fetchProfileData();
    }, [router]);

    const deletePost = async (id: string) => {
        const supabase = createClient();

        const { data: post, error: fetchErr } = await supabase
            .from('posts')
            .select('images')
            .eq('id', id)
            .single();

        if (fetchErr) {
            console.error('Error fetching post before delete:', fetchErr);
            return;
        }

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) return;

        if (post?.images?.length) {
            const paths = post.images.map(urlToPath);
            const {error: storageErr } = await supabase
                .storage
                .from('images')
                .remove(paths);
            if (storageErr) {
                console.warn("🔴 remove() error:", storageErr);
            }
        }

        setPosts((prev) => prev.filter((p) => p.id !== id));
    };

    if (loading) return <p className="p-6">Loading your profile...</p>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome, {userName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Conversations */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-lg font-bold mb-2">Your Conversations</h2>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {conversations.map((c) => (
                            <Link
                                key={c.id}
                                href={`/chat/${c.id}`}
                                className="block border border-blue-500 text-blue-600 hover:bg-blue-50 rounded p-3"
                            >
                                Conversation with {usernames[c.user1_id === userId ? c.user2_id : c.user1_id]}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Posts */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-lg font-bold mb-2">Your Posts</h2>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="relative group border border-gray-300 rounded p-4 hover:bg-gray-50"
                            >
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
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (confirm('Are you sure you want to delete this post?')) {
                                                await deletePost(post.id);
                                            }
                                        }}
                                        className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <Link href={`/posting/${post.id}`}>
                                    <div>
                                        <h3 className="font-semibold text-base mb-1">{post.title}</h3>
                                        <p className="text-sm text-gray-500">📍 {post.location}</p>
                                        <p className="text-sm text-gray-500">🗓 {post.event_date}</p>
                                        <p className="text-sm text-gray-500">🏫 {post.campus}</p>
                                        {post.images?.length > 0 && (
                                            <div className="mt-2">
                                                <img
                                                    src={post.images[0]}
                                                    alt="Thumbnail"
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
