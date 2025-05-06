'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import Image from 'next/image';
import Filter from '@/components/Filter';

export default function CreatePostPage() {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [campus, setCampus] = useState('TMU');
    const [category, setCategory] = useState('');
    const [customItem, setCustomItem] = useState('');
    const [location, setLocation] = useState('');

    const campusLocations = {
        TMU: ['Kerr Hall', 'SLC', 'Library', 'Engineering Building'],
        UTM: ['Davis Building', 'CCT', 'Library'],
    };

    const categories = [
        'Phone',
        'Wallet',
        'Keys',
        'Laptop',
        'Backpack',
        'Water Bottle',
        'Jewelry',
        'Clothing',
        'Other',
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).slice(0, 3);
        setImages(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
                <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
                    Create a new Post
                </h1>

                {/* Filter buttons */}
                <div className="flex justify-center mb-4">
                    <Filter />
                </div>

                <form className="space-y-4">
                    {/* Campus */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Campus</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={campus}
                            onChange={(e) => setCampus(e.target.value)}
                        >
                            <option value="TMU">Toronto Metropolitan University (TMU)</option>
                            <option value="UTM">University of Toronto Mississauga (UTM)</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Item Category</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select an item...</option>
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        {category === 'Other' && (
                            <>
                                <input
                                    type="text"
                                    value={customItem}
                                    onChange={(e) => setCustomItem(e.target.value)}
                                    className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Please specify item..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Custom items may not appear in automated matching results.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Location dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">Select location...</option>
                            {campusLocations[campus as 'TMU' | 'UTM'].map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Last Seen Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Seen Date</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (max 3)</label>
                        <label
                            htmlFor="image-upload"
                            className="inline-block cursor-pointer border border-blue-800 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition"
                        >
                            Choose Files
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {previews.map((src, index) => (
                                <Image
                                    key={index}
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    width={100}
                                    height={100}
                                    unoptimized
                                    className="object-cover rounded-md border"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={4}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Provide any identifying features or details..."
                        />
                    </div>

                    {/* Submit */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition"
                        >
                            Submit Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
