'use client';

import {JSX, useState} from 'react';

export default function Filter():JSX.Element {
    const [filter, setFilter] = useState<string>('lost');
    const selectedStyle = "bg-blue-600 text-white";
    const unselectedStyle = "bg-gray-200 text-gray-600";
    return (
        <div className="flex gap-2">
            <button
                className={(filter=== 'lost' ? selectedStyle : unselectedStyle) + " px-4 py-2 rounded-full text-sm font-medium"}
            onClick={() => {setFilter('lost')}}>
                Lost Items
            </button>
            <button
                className={(filter=== 'found' ? selectedStyle : unselectedStyle) + " px-4 py-2 rounded-full text-sm font-medium"}
                onClick={() => {setFilter('found')}}>
                Found Items
            </button>
        </div>
    );

}

