'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Chat from "@/app/chat/[id]/page";
import convoMaker from "@/utils/ConvoMaker";

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
    }, [currentUserId, conversations]);

    const createConversation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId || !newPartnerId) return;
        const supabase = await createClient();
        const {data, error} = await supabase
            .from('users')
            .select('id')
            .eq('username', newPartnerId).
            single();
        if (error) {
            console.error('Error fetching user:', error);
            return;
        }
        if (!data) {
            console.error('User not found');
            return;
        }
        const partnerId = data.id;

        const newConv = await convoMaker(currentUserId, partnerId);
        if (!newConv) {
            console.error('Error creating conversation');
            return;
        }

        setConversations((prev) => [...prev, newConv]);

    }


    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-80 bg-white shadow-md p-4 border-r border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversations</h2>

                {/* New Conversation Form */}
                <form onSubmit={createConversation} className="mb-6 flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Start New Conversation</label>
                    <input
                        type="text"
                        placeholder="Enter user ID"
                        value={newPartnerId}
                        onChange={(e) => setNewPartnerId(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Create
                    </button>
                </form>

                {/* Conversation List */}
                <div className="space-y-2">
                    {conversations.map((conv) => {
                        const isActive = selectedConversation?.id === conv.id;
                        const otherUserId = conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;
                        const displayName = usernames[otherUserId] || "Unknown user";

                        return (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-3 rounded-lg cursor-pointer transition ${
                                    isActive
                                        ? 'bg-blue-100 text-blue-800 font-semibold'
                                        : 'hover:bg-gray-100 text-gray-800'
                                }`}
                            >
                                <p className="truncate">Chat with {displayName}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col p-6">
                {selectedConversation ? (
                    <Chat id={selectedConversation.id} />
                ) : (
                    <div className="text-gray-500 text-lg">Select a conversation to start chatting</div>
                )}
            </div>
        </div>
    );

}
