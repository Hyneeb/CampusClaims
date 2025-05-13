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

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('username')
                .eq('id', user.id)
                .single();
            if (userError) {
                console.error('Error fetching user data:', userError);
            } else {
                setUserName(userData.username ?? null);
            }

            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id);

            if (postError) console.error('Error fetching posts:', postError);
            else setPosts(postData || []);

            const { data: convoData, error: convoError } = await supabase
                .from('conversations')
                .select('*')
                .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

            if (convoError) console.error('Error fetching conversations:', convoError);
            else setConversations(convoData || []);

            // Collect unique user IDs to look up usernames
            const otherUserIds = new Set<string>();
            convoData?.forEach((c) => {
                const otherId = c.user1_id === user.id ? c.user2_id : c.user1_id;
                otherUserIds.add(otherId);
            });

            if (otherUserIds.size > 0) {
                const { data: users, error: usernamesError } = await supabase
                    .from('users')
                    .select('id, username')
                    .in('id', Array.from(otherUserIds));

                if (usernamesError) {
                    console.error('Error fetching usernames:', usernamesError);
                } else {
                    const mapping: Record<string, string> = {};
                    users?.forEach((u) => (mapping[u.id] = u.username));
                    setUsernames(mapping);
                }
            }

            setLoading(false);
        };

        fetchProfileData();
    }, [router]);

    if (loading) return <p className="p-6">Loading your profile...</p>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome, {userName}</h1>

            <h2 className="text-xl font-semibold mb-4">Your Conversations</h2>
            <div className="grid gap-3 mb-10">
                {conversations.map((c) => {
                    const otherUserId = c.user1_id === userId ? c.user2_id : c.user1_id;
                    return (
                        <Link
                            key={c.id}
                            href={`/chat/${c.id}`}
                            className="block border border-blue-500 rounded p-4 text-blue-600 hover:bg-blue-50"
                        >
                            Conversation with {usernames[otherUserId] ?? otherUserId}
                        </Link>
                    );
                })}
            </div>

            <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
            {posts.length === 0 ? (
                <p className="text-center">You haven&#39;t created any posts yet.</p>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="relative group border p-4 rounded shadow hover:bg-gray-50 transition"
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
                                            const supabase = createClient();
                                            const { error } = await supabase.from('posts').delete().eq('id', post.id);
                                            if (!error) setPosts((prev) => prev.filter((p) => p.id !== post.id));
                                        }
                                    }}
                                    className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                            <Link href={`/posting/${post.id}`}>
                                <div>
                                    <h2 className="text-xl font-semibold">{post.title}</h2>
                                    <p className="text-gray-600 mb-2">{post.description}</p>
                                    <p className="text-sm text-gray-500">📍 {post.location}</p>
                                    <p className="text-sm text-gray-500">🏫 {post.campus}</p>
                                    <p className="text-sm text-gray-500">🗓️ {post.event_date}</p>
                                    {post.images?.length > 0 && (
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
