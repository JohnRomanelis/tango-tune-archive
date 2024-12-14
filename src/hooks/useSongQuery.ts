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

      // First, if a singer is selected, get the song IDs for that singer
      let songIds: number[] | null = null;
      if (searchParams?.singer) {
        const { data: singerSongs } = await supabase
          .from('song_singer')
          .select('song_id, singer!inner(name)')
          .eq('singer.name', searchParams.singer);

        if (!singerSongs?.length) return [];
        songIds = singerSongs.map(s => s.song_id);
      }

      // Build the main query
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

      // Apply filters
      if (searchParams) {
        if (songIds !== null) {
          query = query.in('id', songIds);
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
          const { data: likedSongs } = await supabase
            .from('user_song_likes')
            .select('song_id')
            .eq('user_id', user.id);
          
          if (!likedSongs?.length) return [];
          query = query.in('id', likedSongs.map(like => like.song_id));
        }
      }

      const { data: songsData, error } = await query;
      
      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      // Transform the data to match the Song type
      const transformedSongs = (songsData || []).map(song => ({
        ...song,
        orchestra: song.orchestra || null,
        song_singer: song.song_singer || []
      })) as Song[];

      return transformedSongs;
    },
    enabled: searchParams !== null,
  });
};