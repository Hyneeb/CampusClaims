import { JSX } from "react";
import Filter from "@/components/Filter";

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
                <div className="flex w-full gap-2">
                    <input
                        type="text"
                        placeholder="Search for a lost item"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
