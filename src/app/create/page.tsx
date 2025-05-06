'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import Image from 'next/image';

export default function CreatePostPage() {
    const [postType, setPostType] = useState<'lost' | 'found'>('lost');
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [campus, setCampus] = useState('TMU');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).slice(0, 3);
        setImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviews(previews);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
                <h1 className="text-2xl font-semibold mb-4 text-center text-blue-800">
                    Create a {postType === 'lost' ? 'Lost' : 'Found'} Post
                </h1>

                {/* Post type toggle */}
                <div className="flex justify-center mb-4">
                    <button
                        className={`px-4 py-2 rounded-l-md border ${
                            postType === 'lost' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                        onClick={() => setPostType('lost')}
                    >
                        Lost
                    </button>
                    <button
                        className={`px-4 py-2 rounded-r-md border ${
                            postType === 'found' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                        onClick={() => setPostType('found')}
                    >
                        Found
                    </button>
                </div>

                <form className="space-y-4">
                    {/* Campus selection */}
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

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="e.g. Lost backpack near library"
                        />
                    </div>

                    {/* Image upload */}
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

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="e.g. Kerr Hall West"
                        />
                    </div>

                    {/* Last seen date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Seen Date</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
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

                    {/* Submit button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition"
                        >
                            Submit Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
