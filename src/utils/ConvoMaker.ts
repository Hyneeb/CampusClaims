import {createClient} from "@/utils/supabase/client";

export default async function convoMaker(id1:string, id2:string){

    const supabase = await createClient();

    const { data: existingConvo} = await supabase
        .from('conversations')
        .select()
        .or(`and(user1_id.eq.${id1},user2_id.eq.${id2}),and(user1_id.eq.${id2},user2_id.eq.${id1})`);

    if (existingConvo && existingConvo.length > 0) {
        console.log('Existing conversation found:', existingConvo);
        return existingConvo[0];
    }

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