'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

type MapProps = {
    onChange: (value: number) => void;
};

export default function SchoolSelector(props:MapProps) {
    const schools = ['TMU', 'UTM',];
    const [index, setIndex] = useState(0);

    const prevSchool = () => {
        const newIndex = (index - 1 + schools.length) % schools.length;
        setIndex(newIndex);
        props.onChange(newIndex);
    };

    const nextSchool = () => {
        const newIndex = (index + 1) % schools.length;
        setIndex(newIndex);
        props.onChange(newIndex);
    };


    return (
        <div className='flex items-center justify-center gap-14 text-2xl font-bold text-blue-600'>
            <button
            onClick={prevSchool}
            className="bg-blue-600 hover:bg-blue-800 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <h1>{schools[index]}</h1>

            <button
            onClick={nextSchool}
            className="bg-blue-600 hover:bg-blue-800 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
}