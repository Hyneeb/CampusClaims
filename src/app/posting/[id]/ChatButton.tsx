'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import convoMaker from '@/utils/ConvoMaker';

export default function ChatButton({ recipientId }: { recipientId: string }) {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);
        };
        fetchUser();
    }, []);

    const handleChat = async () => {
        if (!currentUserId || !recipientId || currentUserId === recipientId) return;

        const convo = await convoMaker(currentUserId, recipientId);
        if (convo && convo.id) {
            router.push(`/chat/${convo.id}`);
        } else {
            alert("Failed to create or retrieve conversation.");
        }
    };

    return (
        <button
            type="button"
            onClick={handleChat}
            className="
                text-white
                text-base
                px-4 py-2
                bg-blue-600
                rounded-md
                hover:bg-blue-700
                focus:ring-2 focus:ring-blue-400
                transition
                duration-200
                ease-in-out
                shadow-sm
            "
        >
            Message Now!
        </button>
    );
}
