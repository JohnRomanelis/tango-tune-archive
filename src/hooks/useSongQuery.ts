import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchParams {
  title?: string;
  orchestra?: string;
  singer?: string;
  yearFrom?: number;
  yearTo?: number;
  isInstrumental?: boolean;
  type?: string;
  style?: string;
  likedOnly?: boolean;
}

export interface Song {
  id: number;
  title: string;
  type: "tango" | "milonga" | "vals";
  style: "rhythmic" | "melodic" | "dramatic";
  recording_year: number | null;
  is_instrumental: boolean | null;
  spotify_id: string | null;
  orchestra: { id: number; name: string } | null;
  song_singer: Array<{ singer: { id: number; name: string } }>;
}

export const useSongQuery = (searchParams: SearchParams | null) => {
  return useQuery({
    queryKey: ["songs", searchParams],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && searchParams?.likedOnly) return [];

      let query = supabase
        .from("song")
        .select(`
          id,
          title,
          type,
          style,
          recording_year,
          is_instrumental,
          spotify_id,
          orchestra:orchestra_id (
            id,
            name
          ),
          song_singer (
            singer (
              id,
              name
            )
          )
        `);

      if (searchParams) {
        // If singer is selected, join with song_singer and singer tables
        if (searchParams.singer) {
          query = query
            .eq('is_instrumental', false) // Exclude instrumental songs
            .in('id', 
              supabase
                .from('song_singer')
                .select('song_id')
                .eq('singer.name', searchParams.singer)
                .inner_join('singer on singer.id = song_singer.singer_id')
            );
        }

        if (searchParams.title) {
          query = query.ilike('title', `%${searchParams.title}%`);
        }

        if (searchParams.orchestra) {
          query = query.eq('orchestra.name', searchParams.orchestra);
        }

        if (searchParams.yearFrom) {
          query = query.gte('recording_year', searchParams.yearFrom);
        }

        if (searchParams.yearTo) {
          query = query.lte('recording_year', searchParams.yearTo);
        }

        if (searchParams.type) {
          query = query.eq('type', searchParams.type);
        }

        if (searchParams.style) {
          query = query.eq('style', searchParams.style);
        }

        if (searchParams.likedOnly && user) {
          query = query.in('id', 
            supabase
              .from('user_song_likes')
              .select('song_id')
              .eq('user_id', user.id)
          );
        }
      }

      const { data: songsData, error } = await query;
      
      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      // Transform the data to match the expected Song type
      const transformedSongs = (songsData || []).map(song => ({
        ...song,
        orchestra: song.orchestra || null,
        song_singer: song.song_singer || []
      }));

      return transformedSongs as Song[];
    },
    enabled: searchParams !== null,
  });
};