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
        if (searchParams.title) {
          query = query.ilike('title', `%${searchParams.title}%`);
        }

        if (searchParams.orchestra) {
          const { data: orchestras } = await supabase
            .from('orchestra')
            .select('id')
            .eq('name', searchParams.orchestra)
            .single();

          if (orchestras) {
            query = query.eq('orchestra_id', orchestras.id);
          } else {
            return [];
          }
        }

        if (searchParams.singer) {
          const { data: singerSongs } = await supabase
            .from('song_singer')
            .select('song_id')
            .eq('singer.name', searchParams.singer);

          if (singerSongs?.length) {
            query = query.in('id', singerSongs.map(s => s.song_id));
          } else {
            return [];
          }
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

        if (searchParams.isInstrumental !== undefined) {
          query = query.eq('is_instrumental', searchParams.isInstrumental);
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

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      // Transform the data to ensure it matches the Song interface
      const transformedSongs = (data || []).map(song => {
        const transformedSong: Song = {
          id: song.id,
          title: song.title,
          type: song.type,
          style: song.style,
          recording_year: song.recording_year,
          is_instrumental: song.is_instrumental,
          spotify_id: song.spotify_id,
          orchestra: song.orchestra ? {
            id: song.orchestra.id,
            name: song.orchestra.name
          } : null,
          song_singer: song.song_singer?.map(ss => ({
            singer: {
              id: ss.singer.id,
              name: ss.singer.name
            }
          })) || []
        };
        return transformedSong;
      });

      return transformedSongs;
    },
    enabled: searchParams !== null,
  });
};