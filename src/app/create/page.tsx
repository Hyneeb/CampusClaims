'use client';
import { useState } from 'react';
import Image from 'next/image';
import Filter from '@/components/Filter';
import {useRouter} from "next/navigation";

export default function CreatePostPage() {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [campus, setCampus] = useState('TMU');
    const [category, setCategory] = useState('');
    const [customItem, setCustomItem] = useState('');
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');
    const [filter, setFilter] = useState("lost");
    const [date, setDate] = useState('');
    const router = useRouter();

    const handleFilterChange = (value: string) => {
        setFilter(value); // update parent state
    };

    const campusLocations = {
        TMU: [
            'Atrium on Bay',
            'Architecture Building — Paul H. Cocker Gallery',
            'Campus Store',
            '114 Bond Street',
            '111 Bond Street',
            'Bell Trinity Square',
            'Carlton Cinema',
            'The Chang School of Continuing Education (Heaslip House)',
            'Creative Innovation Studio',
            'Civil Engineering Storage',
            '101 Gerrard Street East',
            'English Language Institute and International College (College Park)',
            'Centre for Urban Innovation',
            '147 Dalhousie Street',
            'Daphne Cockwell Health Sciences Complex',
            'Yonge-Dundas Square',
            'George Vari Engineering and Computing Centre',
            'Eric Palin Hall',
            'School of Graphic Communications Management (Heidelberg Centre)',
            'International Living / Learning Centre',
            'School of Image Arts',
            'The Image Centre',
            'Jorgenson Hall',
            'Kerr Hall East',
            'Kerr Hall North',
            'Kerr Hall South',
            'Kerr Hall West',
            'Library Building',
            'Mattamy Athletic Centre',
            'Merchandise Building',
            'Civil Engineering Building (Monetary Times)',
            'MaRS Building',
            'Oakham House',
            'O’Keefe House',
            'Pitman Hall',
            'Parking Garage',
            'Podium',
            '112 Bond Street',
            'Recreation and Athletics Centre',
            'Rogers Communications Centre',
            'South Bond Building',
            'Student Campus Centre',
            'Sally Horsfall Eaton Centre for Studies in Community Health',
            'School of Interior Design',
            'Sheldon & Tracy Levy Student Learning Centre',
            'St. Michael’s Hospital',
            'Toronto Eaton Centre',
            'Ted Rogers School of Management',
            'Victoria Building',
            'Yonge-Dundas Intersection',
            '415 Yonge Street'
        ],
        UTM: [
            'Communications, Culture & Technology Building',
            'Deerfield Hall',
            'William G. Davis Building',
            'Hazel McCallion Academic Learning Centre & Library',
            'Terrence Donnelly Health Sciences Complex',
            'Instructional Centre',
            'Kaneff Centre/Innovation Complex',
            'Maanjiwe Nendamowinan',
            'New Science Building',
            'Academic Annex',
            'Alumni House & Parking Office',
            'Central Utilities Plant',
            'Early Learning Child Care Centre',
            'Erindale Studio Theatre',
            'Forensic Anthropology Field School',
            'Grounds Building',
            'Lislehurst',
            'Paleomagnetism Lab',
            'Recreation, Athletics & Wellness Centre',
            'Research Greenhouse',
            'Student Centre',
            'Erindale Hall',
            'Leacock Lane Residence',
            'MaGrath Valley Residence',
            'McLuhan Court Residence',
            'Oscar Peterson Hall',
            'Putnam Place Residence',
            'Roy Ivor Hall',
            'Schreiberwood Residence'
        ]
    };


    const categories = [
        'Phone', 'Wallet', 'Keys', 'Laptop', 'Backpack', 'Water Bottle',
        'Jewelry', 'Clothing', 'Other'
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const totalFiles = images.length + selectedFiles.length;

        if (totalFiles > 3) {
            const allowed = selectedFiles.slice(0, 3 - images.length);
            setImages(prev => [...prev, ...allowed]);
            setPreviews(prev => [...prev, ...allowed.map(file => URL.createObjectURL(file))]);
        } else {
            setImages(prev => [...prev, ...selectedFiles]);
            setPreviews(prev => [...prev, ...selectedFiles.map(file => URL.createObjectURL(file))]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        const newPreviews = [...previews];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('post_type', filter);
        fd.append('campus', campus);
        fd.append('title', (category || customItem));
        fd.append('location', location);
        fd.append('description', desc);
        images.forEach((image) => {
            fd.append('images', image);
        });
        fd.append('event_date', date);

        const data = await fetch(`/api/create_post`, {
            method: 'POST',
            body: fd
        });
        const res = await data.json();
        if (res.success) {
            alert('Post created successfully!');
            router.push(`/recommendation/${res.data[0].id}`); // Redirect to recommendation page

        } else {
            alert('Error creating post: ' + res.error);

        }


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
                <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
                    Create a new Post
                </h1>

                <div className="flex justify-center mb-4">
                    <Filter onChange={handleFilterChange}/>

                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Campus Selection */}
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
                                <option key={item} value={item}>{item}</option>
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

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="">Select location...</option>
                            {campusLocations[campus as 'TMU' | 'UTM'].map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Last Seen Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Seen Date</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (max 3)</label>
                        <label
                            htmlFor="image-upload"
                            className={`inline-block cursor-pointer border border-blue-800 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition ${images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            disabled={images.length >= 3}
                        />
                        {images.length >= 3 && (
                            <p className="text-xs text-red-500 mt-1">Maximum of 3 images allowed.</p>
                        )}
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {previews.map((src, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={src}
                                        alt={`Preview ${index + 1}`}
                                        width={100}
                                        height={100}
                                        unoptimized
                                        className="object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-white text-red-600 border border-red-300 rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
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
                            onChange={(e) => {setDesc(e.target.value)}}
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
