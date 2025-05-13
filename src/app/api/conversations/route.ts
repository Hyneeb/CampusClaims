import {createClient} from "@/utils/supabase/server";
import { NextResponse } from 'next/server';

export async function POST(req: Request){
    const supabase = await createClient();
    if (!supabase) {
        return NextResponse.json(
            { success: false, error: "Failed to create Supabase client" },
            { status: 500 }
        );
    }

    if (req.method !== "POST") {
        return NextResponse.json(
            {success: false, error: "Method not allowed"},
            {status: 405}
        );
    }

    const { conversation_id, content, sender_id } = await req.json();

    if (!conversation_id || !content || !sender_id) {
        return NextResponse.json(
            {success: false, error: "Missing required fields"},
            {status: 400}
        );
    }
    console.log("Inserting message for conversation:", conversation_id, "from user:", sender_id);
    const { data, error } = await supabase
        .from('messages')
        .insert([
            {
                content,
                sender_id,
                conversation_id
            }
        ]);

    if (error) {
        console.error("Error inserting message:", error);
        return NextResponse.json(
            {success: false, error: error.message},
            {status: 500}
        );
    }

    return NextResponse.json(
        {success: true, data},
        {status: 200}
    );





}