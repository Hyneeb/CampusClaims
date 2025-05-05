import {JSX} from "react";
import logo from '/public/logo.png';
import Image from 'next/image';
import ChatButton from "@/app/posting/[id]/ChatButton";
import GalleryImg from "@/app/posting/[id]/GalleryImg";

function Posting(props: {id: string, preview?: boolean}): JSX.Element {
    const { id, preview = false } = props;

    // Fetch the post data from the server


    const post = fetchPost(id);

  return (
    <div>
        {/* title */}
        <div>
            {/* location */}
            <Image key = {1} src={logo} alt="CampusClaims logo" width={120} height={120} />
            <h1>{post.location}</h1>
            <h2>{post.title}</h2>
        </div>

        {/*body */}
        <div>

            {/* images */}

            <GalleryImg images={post.images} />

            {/* rest of post */}
            <div>
                <h4>last seen at {post.date.toDateString()}</h4>
                {!preview && (<p>{post.description}</p>)}
                <ChatButton />
            </div>

        </div>
    </div>
  );
}

function fetchPost(id: string):{id:string, title: string, location: string, date: Date, images: string[], description: string} {
    return {
        id: id,
        title: "Sample Title",
        location: "Sample Location",
        date: new Date(),
        images: ["https://upload.wikimedia.org/wikipedia/en/9/95/Pok%C3%A9mon_Lucario_art.png",
            "https://upload.wikimedia.org/wikipedia/en/4/43/Pok%C3%A9mon_Mewtwo_art.png"],
        description: "Sample description of the post."
    };
}

export default Posting;