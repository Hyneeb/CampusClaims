'use client';

import { useEffect, useState } from 'react';
import TmuMap from '@/components/RenderTmuBuildings';
import UtmMap from '@/components/RenderUtmBuildings';
import { createClient } from '@/utils/supabase/client';
import SchoolSelector from '@/components/SchoolSelector';
import { PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type Post = {
  id: string;
  title: string;
  location: string;
  post_type: 'lost' | 'found';
  campus: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [campusIndex, setCampusIndex] = useState(0);
  const campusNames = ['TMU', 'UTM'];

  const fetchPosts = async (campus: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, location, post_type, campus')
      .eq('campus', campus);

    
    if (!error && data) {
      setPosts(data);
    } else {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {                        // clear out stale data right away
    fetchPosts(campusNames[campusIndex]);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campusIndex]);

  

  const SelectedMap =
    campusNames[campusIndex] !== 'UTM'
      ? <TmuMap posts={posts} />
      : <UtmMap posts={posts} />;

  return (
    <>
      {/* Main Section */}
      <div className="flex flex-col justify-center w-full bg-white p-4 gap-8">
        {/* Selector */}
        <SchoolSelector onChange={setCampusIndex} />

        {/* Map */}
        <div className="w-full max-w-5xl rounded-xl overflow-hidden shadow-md self-center">
          {SelectedMap}
        </div>

        {/* Post Button */}
        <Link href="/create" className="self-center">
          <div className="rounded-4xl w-20 h-20 bg-blue-600 flex justify-center items-center">
            <PlusIcon className="h-10 w-10 text-white" />
          </div>
        </Link>
      </div>

      {/* Demo Section */}
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
      </div>
    </>
  );
}
