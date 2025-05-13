import {createClient} from "@/utils/supabase/client";

export default async function convoMaker(id1:string, id2:string){

    const supabase = await createClient();

    const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert([
            { user1_id: id1, user2_id: id2 }
        ])
        .select()
        .single();

    if (convError) {
        console.error('Error creating conversation:', convError);
    }

    return newConv;


}