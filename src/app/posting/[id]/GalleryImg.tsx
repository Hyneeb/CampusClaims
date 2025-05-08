'use client';
import Image from "next/image";
import {useState} from "react";
import pic from '@/../public/vercel.svg';


export default function GalleryImg(props: {images: string[] | null, preview: boolean}) {
    const [imgIndex, setImgIndex] = useState<number>(0);
    if (!props.images || props.images.length === 0) {
        return (
            <div className="flex flex-col items-center">
                <Image
                    key={imgIndex}
                    src={pic}
                    alt={`Image ${imgIndex}`}
                    width={!props.preview ? 300: 120}
                    height={!props.preview? 250: 100}
                    className="rounded-md object-contain max-w-full h-auto"
                />
            </div>
        )
    }
    const len = props.images.length;
    const image = props.images[imgIndex];

    const btnStyle = `
      w-10 h-10
      text-white text-xl
      bg-blue-600
      rounded-full
      hover:bg-blue-700
      focus:ring-2 focus:ring-blue-400
      transition duration-200 ease-in-out
      flex items-center justify-center
      shadow-sm
    `;


    return (
        <div className="flex items-center gap-4">
            {!props.preview && (<button className={btnStyle}
                    onClick={() => setImgIndex((imgIndex - 1 + len) % len)}>{"\u2190"}</button>)
            }
            <div className="flex flex-col items-center">
                <Image
                    key={imgIndex}
                    src={image}
                    alt={`Image ${imgIndex}`}
                    width={!props.preview ? 300: 120}
                    height={!props.preview? 250: 100}
                    className="rounded-md object-contain max-w-full h-auto"
                />
                {!props.preview && (<p className="text-sm text-gray-500 mt-2">
                    {imgIndex + 1} / {len}
                </p>)}
            </div>
            {!props.preview && (<button className={btnStyle}
                onClick={() => setImgIndex((imgIndex + 1) % len)}>{"\u2192"}</button>
            )}

    </div>);
}