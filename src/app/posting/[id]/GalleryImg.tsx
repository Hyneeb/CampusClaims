'use client';
import Image from "next/image";
import {useState} from "react";


export default function GalleryImg(props: {images: string[], preview: boolean}) {
    const [imgIndex, setImgIndex] = useState<number>(0);
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
            <button className={btnStyle}
                    onClick={() => setImgIndex((imgIndex - 1 + len) % len)}>{"\u2190"}</button>
            <div className="flex flex-col items-center">
                <Image
                    key={imgIndex}
                    src={image}
                    alt={`Image ${imgIndex}`}
                    width={!props.preview ? 300: 80}
                    height={!props.preview? 250: 80}
                    className="rounded-md object-contain max-w-full h-auto"
                />
                <p className="text-sm text-gray-500 mt-2">
                    {imgIndex + 1} / {len}
                </p>
            </div>
        <button className={btnStyle}
                onClick={() => setImgIndex((imgIndex + 1) % len)}>{"\u2192"}</button>

    </div>);
}