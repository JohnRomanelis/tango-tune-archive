import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SongType, SongStyle } from "@/types/song";

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
  alsoPlayedBy?: string;
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

const isValidSongType = (type: string): type is SongType => {
  return ['tango', 'milonga', 'vals'].includes(type);
};

const isValidSongStyle = (style: string): style is SongStyle => {
  return ['rhythmic', 'melodic', 'dramatic'].includes(style);
};

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
          const { data: orchestraData } = await supabase
            .from('orchestra')
            .select('id')
            .eq('name', searchParams.orchestra)
            .single();

          if (orchestraData) {
            query = query.eq('orchestra_id', orchestraData.id);
          } else {
            return [];
          }
        }

        if (searchParams.alsoPlayedBy) {
          const { data: orchestraData } = await supabase
            .from('orchestra')
            .select('id')
            .eq('name', searchParams.alsoPlayedBy)
            .single();

          if (orchestraData) {
            const { data: relatedSongs } = await supabase
              .from('song')
              .select('title')
              .eq('orchestra_id', orchestraData.id);

            if (relatedSongs?.length) {
              const titles = relatedSongs.map(s => s.title);
              query = query.in('title', titles);
            }
          }
        }

        if (searchParams.singer) {
          const { data: singerSongs } = await supabase
            .from('song_singer')
            .select('song_id, singer!inner(name)')
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
          if (isValidSongType(searchParams.type)) {
            query = query.eq('type', searchParams.type);
          }
        }

        if (searchParams.style) {
          if (isValidSongStyle(searchParams.style)) {
            query = query.eq('style', searchParams.style);
          }
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

      const transformedData = (data || []).map(song => ({
        ...song,
        orchestra: song.orchestra || null,
        song_singer: song.song_singer || []
      }));

      return transformedData as Song[];
    },
    enabled: searchParams !== null,
  });
};