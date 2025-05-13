'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Chat from "@/app/chat/[id]/page";

interface Conversation {
    id: string;
    title?: string;
    user1_id: string;
    user2_id: string;
}

export default function MessagingPage() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [newPartnerId, setNewPartnerId] = useState('');
    const [usernames, setUsernames] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                console.error("Not logged in");
                return;
            }
            console.log("Current user ID:", user.id);
            setCurrentUserId(user.id);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!currentUserId) return;

        const fetchConversations = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('conversations')
                .select('*')

            if (error) console.error('Error fetching conversations:', error);
            else {
                console.log("Fetched conversations:", data);
                setConversations(data as Conversation[]);

                const userIds = new Set<string>();
                data?.forEach((conv: Conversation) => {
                    if (conv.user1_id !== currentUserId) userIds.add(conv.user1_id);
                    if (conv.user2_id !== currentUserId) userIds.add(conv.user2_id);
                });

                // Fetch usernames for these IDs
                const { data: users, error: userError } = await supabase
                    .from('users')
                    .select('id, username')
                    .in('id', Array.from(userIds));

                if (userError) {
                    console.error('Error fetching usernames:', userError);
                } else if (users) {
                    setUsernames(users.reduce<Record<string, string>>(
                        (acc, user) => ({ ...acc, [user.id]: user.username }),
                        {}
                    ));
                }


            }
        };

        fetchConversations();
    }, [currentUserId]);



    const createConversation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUserId || !newPartnerId || newPartnerId === currentUserId) {
            alert("Invalid partner ID");
            return;
        }

        const supabase = createClient();
        const { error } = await supabase.from('conversations').insert({
            user1_id: currentUserId,
            user2_id: newPartnerId,
        });

        if (error) {
            console.error('Error creating conversation:', error);
            alert("Failed to create conversation");
        } else {
            alert("Conversation created!");
            setNewPartnerId('');
            const { data } = await supabase
                .from('conversations')
                .select('*')
                .or(`(user1_id.eq.${currentUserId},user2_id.eq.${currentUserId})`);
            setConversations(data as Conversation[]);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">Conversations</h2>

                <form onSubmit={createConversation} className="mb-6 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Start New Conversation</label>
                    <input
                        type="text"
                        placeholder="Enter other user's ID"
                        value={newPartnerId}
                        onChange={(e) => setNewPartnerId(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700"
                    >
                        Create
                    </button>
                </form>

                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-3 rounded-xl cursor-pointer accent-gray-400 ${selectedConversation?.id === conv.id ? 'bg' : ''}`}
                    >
                        <p className="font-medium text-yellow-900">
                            chat with {usernames[conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id] || "Unknown user"}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex-1 flex flex-col p-4">
                <Chat id={"11111111-2222-3333-4444-555555555555"}/>
            </div>
        </div>
    );
}
