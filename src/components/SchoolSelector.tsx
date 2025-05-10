'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function SchoolSelector() {
    const schools = ['TMU', 'UTM'];
    const [index, setIndex] = useState(0);

    const prevSchool = () => setIndex((prev) => (prev - 1 + schools.length) % schools.length);
    const nextSchool = () => setIndex((prev) => (prev + 1) % schools.length);

    return (
        <div className='flex items-center justify-center gap-14 text-2xl font-bold text-blue-600'>
            <button
            onClick={prevSchool}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <h1>{schools[index]}</h1>

            <button
            onClick={nextSchool}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
}