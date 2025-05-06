import { JSX } from "react";
import Filter from "@/components/Filter";
import { FaSearch } from "react-icons/fa";

export default function Explore(): JSX.Element {
    return (
        <div className="min-h-screen p-8 flex flex-col items-center gap-8">
            {/* Banner */}
            <div id="banner" className="w-full text-center text-2xl font-bold border-b pb-4">
                CampusClaims
            </div>

            {/* Search + Filter Section */}
            <div id="finder" className="flex flex-col items-center gap-4 w-full max-w-md">

                <Filter />

                {/* Search bar and button */}
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-5 pr-12 py-3 text-base border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
                    >
                        <FaSearch className="text-sm" />
                    </button>
                </div>

            </div>
        </div>
    );
}
