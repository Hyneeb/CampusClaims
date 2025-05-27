// utils/fetchMapPosts.ts
import { createClient } from '@/utils/supabase/client';

export type Post = {
  id: string;
  title: string;
  location: string;
  post_type: 'lost' | 'found';
  campus: string;
};

export async function fetchMapPosts(campus: string): Promise<Post[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, location, post_type, campus')
    .eq('campus', campus);

  if (error) {
    console.error('Error fetching map posts:', error);
    return [];
  }

  return data;
}
