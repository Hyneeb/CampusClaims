import Link from "next/link";
import SchoolSelector from "@/components/SchoolSelector";
import Map from "@/components/Map";

export default function Home() {
  return (
    <>
      {/* Main Section */}
      <div className="flex flex-col justify-center w-full bg-white p-4 gap-4">
        {/* Selector */}
        <div className="bg-gray-300 rounded-2xl shadow-md py-4 border-gray-500"><SchoolSelector/></div>
        {/* Map */}
        <div className="w-full max-w-5xl rounded-xl overflow-hidden shadow-md self-center">
          <Map
            campus="TMU"
            lostItems={[
              { id: '1', lat: 43.656, lng: -79.380 },
              { id: '2', lat: 43.657, lng: -79.382 },
            ]}
            foundItems={[
              { id: 'a', lat: 43.658, lng: -79.378 },
            ]}/>
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white p-8">
        <Link
            href="/posting/c3898659-48d5-4fcb-bc63-783aff8b6e18"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Go to Sample Post
        </Link>

          <Link
              href="/explore"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
              Explore!
          </Link>

          <Link
              href="/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
              Make a Post
          </Link>

      </div>
    </>
  );
}