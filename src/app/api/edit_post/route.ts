    import {createClient} from "@/utils/supabase/server";
    import { NextResponse } from 'next/server';

    export async function POST(req: Request) {
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json(
                { success: false, error: "Failed to create Supabase client" },
                { status: 500 }
            );
        }

        if (req.method !== "POST") {
            return NextResponse.json(
                { success: false, error: "Method not allowed" },
                { status: 405 }
            );
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }
        console.log("Inserting post for user:", user.id);


        const formData = await req.formData();

        const postId = formData.get("id") as string;

        if (!postId) {
            return NextResponse.json(
                { success: false, error: "Missing post ID" },
                { status: 400 }
            );
        }

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const post_type = formData.get('post_type') as string;
        const event_date = formData.get('event_date') as string;
        const campus = formData.get('campus') as string;
        const images = formData.getAll('images') as File[];
        const imageUrls: string[] = [];
        console.log("Form data:", { title, description, location, post_type, event_date, campus });
        console.log("Files received:", images.map(img => img.name));
        // format  the images
        for (const file of images) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${file.name.split('.')[0]}_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(`post_images/${fileName}`, file);

            if (uploadError) {
                console.error("Upload failed:", uploadError); // 👈 add this
                return NextResponse.json(
                    { success: false, error: uploadError.message },
                    { status: 500 }
                );
            }


            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(`post_images/${fileName}`);
            if (publicUrlData) {
                imageUrls.push(publicUrlData.publicUrl);
            }
        }




        const { data, error } = await supabase
            .from("posts")
            .update({
                title,
                description,
                location,
                post_type,
                event_date,
                images: imageUrls,
                campus
            })
            .eq('id', postId)
            .select();

        if (error){
            return NextResponse.json(
                { success: false, error: "uh oh" },
                { status: 400 }
            );
        }
        if (!data) {
            return NextResponse.json(
                { success: false, error: "uh oh" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: true, data: data },
            { status: 200 }
        );

    }