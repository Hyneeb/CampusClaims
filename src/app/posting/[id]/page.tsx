import {JSX} from "react";
import logo from '/public/logo.png';
import Image from 'next/image';
import ChatButton from "@/app/posting/[id]/ChatButton";
import GalleryImg from "@/app/posting/[id]/GalleryImg";
import user from '/public/user.png';

function Posting(props: {id: string, preview?: boolean}): JSX.Element {
    const { id, preview = false } = props;

    // Fetch the post data from the server


    const post = fetchPost(id);

  return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-8">
        {/* title */}

          <div className="border-2 rounded-2xl border-gray-200 pb-4 mb-6 bg-gray-100">
              <div className="grid grid-cols-3 items-center">
                  {/* Left: Location with icon */}
                  <div className="flex items-center gap-2 justify-start pl-4">
                      <Image src={logo} alt="Location symbol" width={40} height={40} />
                      <p className="text-sm text-gray-700 font-medium">{post.location}</p>
                  </div>

                  {/* Center: Title */}
                  <div className="text-center">
                      <h1 className="text-lg font-semibold text-blue-600">{post.title}</h1>
                  </div>

                  {/* Right: Empty placeholder to center title */}
                  <div className="flex justify-end items-center pb-4">
                      <div className="relative group inline-block">
                          <Image
                              src={user}
                              alt="User symbol"
                              width={40}
                              height={40}
                              className="rounded-full cursor-pointer"
                          />
                          <div className="absolute right-0 top-full mt-1 w-max
                    bg-white text-xs text-gray-500
                    px-2 py-1 rounded shadow-md opacity-0
                    group-hover:opacity-100 transition z-10">
                              Icon by kmg design
                          </div>
                      </div>
                  </div>
              </div>
          </div>


        {/*body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 rounded-2xl bg-white shadow-md">
              {/* Left: Image Gallery */}
              <GalleryImg images={post.images} />

              {/* Right: Details */}
              <div className="space-y-4">
                  <p className="text-sm text-gray-600 font-medium">
                      Last seen on <span className="font-semibold">{post.date.toDateString()}</span>
                  </p>
                  {!preview && (
                      <p className="text-gray-800 leading-relaxed">
                          {post.description}
                      </p>
                  )}
                  <ChatButton />
              </div>
          </div>
    </div>
  );
}

function fetchPost(id: string):{id:string, title: string, location: string, date: Date, images: string[], description: string} {
    return {
        id: id,
        title: "Lost ___ at location",
        location: "Sample Location",
        date: new Date(),
        images: ["https://upload.wikimedia.org/wikipedia/en/9/95/Pok%C3%A9mon_Lucario_art.png",
            "https://upload.wikimedia.org/wikipedia/en/4/43/Pok%C3%A9mon_Mewtwo_art.png"],
        description: "[Verse 1]\n" +
            "What do you have in store?\n" +
            "One life away, we can't explore\n" +
            "But I don't want to get in the way no more\n" +
            "'Cause this the type of feeling you can't ignore, ayy\n" +
            "I'm ready to break down the door, settle the score\n" +
            "I can't let you go away\n" +
            "I miss the smile on your face\n" +
            "You know that I lo-lo-lo-love the chase\n" +
            "\n" +
            "[Pre-Chorus]\n" +
            "You told me once that I was crazy\n" +
            "I said \"Baby girl, I know, but I can't let you go away\"\n" +
            "So don't you get me started now\n" +
            "I want a yes, I don't want maybes\n" +
            "'Cause they leave me where you found me\n" +
            "So don't leave\n" +
            "\n" +
            "[Chorus]\n" +
            "Ooh, I just love the way you've got me feeling\n" +
            "In love with the feeling\n" +
            "It's like, ooh\n" +
            "Take away the pain\n" +
            "Baby, I'm healing, baby, I'm healing\n" +
            "I don't need anything more\n" +
            "Be the wave, I'll be the shore\n" +
            "Crashing all over me\n" +
            "I want you (Fire)\n"
    };
}

export default Posting;