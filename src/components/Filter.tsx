'use client';

import {JSX, useState} from 'react';


type FilterProps = {
    onChange: (value: string) => void;
};

export default function Filter(props:FilterProps):JSX.Element {
    const [filter, setFilter] = useState<string>('lost');
    const selectedStyle = "bg-blue-600 text-white shadow-md transform hover:scale-105 transition duration-200 ease-in-out";
    const unselectedStyle = "bg-gray-200 text-gray-600 shadow-md transform hover:scale-105 transition duration-200 ease-in-out";
    return (
        <div className="flex gap-2">
            <button
                className={(filter=== 'lost' ? selectedStyle : unselectedStyle) + " px-4 py-2 rounded-full text-sm font-medium"}
            onClick={() => {setFilter('lost'); props.onChange('lost')}}>
                Lost Items
            </button>
            <button
                className={(filter=== 'found' ? selectedStyle : unselectedStyle) + " px-4 py-2 rounded-full text-sm font-medium"}
                onClick={() => {setFilter('found'); props.onChange('found');}}>
                Found Items
            </button>
        </div>
    );

}

