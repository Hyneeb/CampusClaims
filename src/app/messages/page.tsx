'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Conversation {
    id: string;
    title?: string;
    user1_id: string;
    user2_id: string;
}

interface Message {
    id: number;
    content: string;
    sender_id: string;
    conversation_id: string;
    created_at?: string;
}

export default function MessagingPage() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [newPartnerId, setNewPartnerId] = useState('');

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
                .or(`(user1_id.eq.${currentUserId},user2_id.eq.${currentUserId})`);

            if (error) console.error('Error fetching conversations:', error);
            else {
                console.log("Fetched conversations:", data);
                setConversations(data as Conversation[]);
            }
        };

        fetchConversations();
    }, [currentUserId]);

    useEffect(() => {
        if (!selectedConversation) return;

        const fetchMessages = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', selectedConversation.id)
                .order('created_at', { ascending: true });

            if (error) console.error('Error fetching messages:', error);
            else setMessages(data as Message[]);
        };

        fetchMessages();
    }, [selectedConversation]);

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim() || !selectedConversation || !currentUserId) return;

        const supabase = createClient();
        const { error } = await supabase.from('messages').insert({
            conversation_id: selectedConversation.id,
            sender_id: currentUserId,
            content: message,
        });

        if (error) {
            console.error('Send message error:', error);
        } else {
            setMessage('');
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    content: message,
                    sender_id: currentUserId,
                    conversation_id: selectedConversation.id,
                },
            ]);
        }
    };

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
                        className={`p-3 rounded-xl cursor-pointer hover:bg-yellow-100 mb-2 ${selectedConversation?.id === conv.id ? 'bg-yellow-200' : ''}`}
                    >
                        <p className="font-medium text-yellow-900">
                            {conv.title || `Chat with ${conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id}`}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex-1 flex flex-col bg-yellow-50 p-4">
                {selectedConversation ? (
                    <>
                        <div className="mb-4 border-b pb-2">
                            <h3 className="text-xl font-bold text-yellow-800">
                                {selectedConversation.title || 'Chat'}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-2 rounded-lg max-w-xs break-words ${msg.sender_id === currentUserId ? 'bg-yellow-300 self-end text-right' : 'bg-white self-start text-left'}`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={sendMessage} className="flex gap-2">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 p-2 border rounded-md"
                            />
                            <button
                                type="submit"
                                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center text-gray-500 mt-20">Select a conversation to start chatting.</div>
                )}
            </div>
        </div>
    );
}
