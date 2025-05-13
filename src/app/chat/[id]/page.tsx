'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { HiArrowLeft } from 'react-icons/hi';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

type Message = {
    id: number;
    content: string;
    sender_id: string;
    conversation_id: string;
    created_at?: string;
};

export default function Chat(props: { id?: string }) {
    const params = useParams();
    const convoId = props.id ?? (params?.id as string);
    const router = useRouter();

    const readyButton = "rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white opacity-80 cursor-pointer"
    const unreadyButton = "rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white opacity-30 cursor-not-allowed"

    const [userId, setUserId] = useState<string | null>(null);
    const [companionId, setCompanionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [draft, setDraft] = useState('');
    const [optimisticIds, setOptimisticIds] = useState<number[]>([]); // For duplicate prevention

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (!draft || !userId || !convoId) return;

        const supabase = await createClient();
        const content = draft.trim();
        setDraft('');

        const { data, error } = await supabase
            .from('messages')
            .insert([{ content, sender_id: userId, conversation_id: convoId }])
            .select()
            .single();

        if (error) {
            console.error("Error inserting message:", error);
            return;
        }

        if (data) {
            setOptimisticIds((prev) => [...prev, data.id]);
            setMessages((prev) => [...prev, data]); // Optimistically update
        }
    };

    useEffect(() => {
        const supabase = createClient();
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const { data: convo } = await supabase
                .from('conversations')
                .select('*')
                .eq('id', convoId)
                .single();
            if (!convo) return;

            const other = convo.user1_id === user.id ? convo.user2_id : convo.user1_id;
            setCompanionId(other);

            const { data: users } = await supabase
                .from('users')
                .select('id, username')
                .in('id', [user.id, other]);
            if (users) {
                setUsernames(users.reduce<Record<string, string>>(
                    (a, u) => ({ ...a, [u.id]: u.username }),
                    {}
                ));
            }

            const { data: msgs } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', convoId)
                .order('created_at');
            if (msgs) setMessages(msgs as Message[]);
        };
        load();
    }, [convoId]);

    useEffect(() => {
        if (!convoId) return;
        const supabase = createClient();

        const channel = supabase
            .channel(`conversation-${convoId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${convoId}`,
                },
                (payload: RealtimePostgresInsertPayload<Message>) => {
                    if (optimisticIds.includes(payload.new.id)) return;
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [convoId, optimisticIds]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    if (!convoId) return <div>Error: No ID provided</div>;
    if (!companionId) return <div>Loading…</div>;

    return (
        <div className="flex-1 bg-gradient-to-br from-sky-50 to-white flex justify-center items-center px-4 py-6">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-md flex flex-col h-[90vh] border border-gray-100">
            <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 rounded-t-xl">
                    <button
                        onClick={() => router.back()}
                        className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
                    >
                        <HiArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium uppercase">
                        {usernames[companionId]?.charAt(0)}
                    </div>
                    <h2 className="truncate text-base font-semibold text-gray-800">
                        {usernames[companionId] ?? companionId}
                    </h2>
                </header>

                <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`max-w-xs px-4 py-2 rounded-2xl text-sm break-words shadow-sm ${
                                m.sender_id === userId
                                    ? 'ml-auto bg-blue-600 text-white'
                                    : 'mr-auto bg-gray-100 text-gray-900'
                            }`}
                        >
                            {m.content}
                            <span className="block mt-1 text-[10px] text-gray-400">
                                {m.created_at &&
                                    new Date(m.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                            </span>
                        </div>
                    ))}
                </main>

                <footer className="px-4 py-3 rounded-b-xl border-t border-gray-100">
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <input
                            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring"
                            placeholder="Message…"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key !== 'Enter') return;
                                handleSend();
                            }}
                        />
                        <button
                            type="submit"
                            className={draft === '' ? unreadyButton : readyButton}
                        >
                            Send
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
}
