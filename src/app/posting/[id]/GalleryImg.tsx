'use client';
import Image from "next/image";
import {useState} from "react";


export default function GalleryImg(props: {images: string[]}){
    const [imgIndex, setImgIndex] = useState<number>(0);
    const len = props.images.length;
    const image = props.images[imgIndex];
    return (
        <div>
            <button onClick={() => setImgIndex((imgIndex - 1 + len) % len)}>{"\u2190"}</button>
            <Image
                key={imgIndex}
                src={image}
                alt={`Image ${imgIndex}`}
                width={400}
                height={300}
            />
        <button onClick={() => setImgIndex((imgIndex + 1) % len)}>{"\u2192"}</button>

    </div>);
}