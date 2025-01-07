import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TandaSearchParams {
  orchestra?: string;
  singer?: string;
  type?: string;
  style?: string;
  yearFrom?: number;
  yearTo?: number;
  isInstrumental?: boolean;
  includeMine?: boolean;
  includePublic?: boolean;
  includeShared?: boolean;
  includeLiked?: boolean;
}

export const useTandasQuery = (searchParams: TandaSearchParams | null, userId: string | undefined) => {
  return useQuery({
    queryKey: ["tandas", searchParams, userId],
    queryFn: async () => {
      if (!userId) return [];

      let query = supabase
        .from("tanda")
        .select(`
          *,
          tanda_song (
            order_in_tanda,
            song (
              id,
              title,
              type,
              style,
              recording_year,
              is_instrumental,
              spotify_id,
              orchestra (name),
              song_singer (
                singer (name)
              )
            )
          )
        `);

      if (searchParams) {
        const visibilityConditions = [];

        if (searchParams.includeMine) {
          visibilityConditions.push(`user_id.eq.${userId}`);
        }
        if (searchParams.includePublic) {
          visibilityConditions.push(`visibility.eq.public`);
        }
        if (searchParams.includeShared) {
          const { data: sharedTandas } = await supabase
            .from('tanda_shared')
            .select('tanda_id')
            .eq('user_id', userId);
          
          if (sharedTandas?.length) {
            const sharedIds = sharedTandas.map(st => st.tanda_id);
            visibilityConditions.push(`id.in.(${sharedIds.join(',')})`);
          }
        }

        if (visibilityConditions.length > 0) {
          query = query.or(visibilityConditions.join(','));
        }

        let filteredData = (await query).data || [];

        // Filter by orchestra after fetching
        if (searchParams.orchestra) {
          filteredData = filteredData.filter(tanda => 
            tanda.tanda_song.some(ts => 
              ts.song.orchestra?.name.toLowerCase() === searchParams.orchestra?.toLowerCase()
            )
          );
        }

        // Filter by singer after fetching
        if (searchParams.singer) {
          filteredData = filteredData.filter(tanda =>
            tanda.tanda_song.some(ts =>
              ts.song.song_singer.some(ss =>
                ss.singer.name.toLowerCase() === searchParams.singer?.toLowerCase()
              )
            )
          );
        }

        // Filter instrumental tandas
        if (searchParams.isInstrumental) {
          filteredData = filteredData.filter(tanda =>
            tanda.tanda_song.every(ts =>
              ts.song.song_singer.length === 0 || ts.song.is_instrumental === true
            )
          );
        }

        // Filter by type
        if (searchParams.type) {
          filteredData = filteredData.filter(tanda =>
            tanda.tanda_song.some(ts => ts.song.type === searchParams.type)
          );
        }

        // Filter by style (only if type is tango)
        if (searchParams.style && searchParams.type === 'tango') {
          filteredData = filteredData.filter(tanda =>
            tanda.tanda_song.some(ts => ts.song.style === searchParams.style)
          );
        }

        // Filter by year range
        if (searchParams.yearFrom || searchParams.yearTo) {
          filteredData = filteredData.filter(tanda =>
            tanda.tanda_song.some(ts => {
              const year = ts.song.recording_year;
              if (!year) return false;
              
              const isAfterStart = !searchParams.yearFrom || year >= searchParams.yearFrom;
              const isBeforeEnd = !searchParams.yearTo || year <= searchParams.yearTo;
              
              return isAfterStart && isBeforeEnd;
            })
          );
        }

        // Filter by liked tandas if requested
        if (searchParams.includeLiked) {
          const { data: likedTandas } = await supabase
            .from('user_tanda_likes')
            .select('tanda_id')
            .eq('user_id', userId);

          if (likedTandas?.length) {
            const likedIds = likedTandas.map(lt => lt.tanda_id);
            filteredData = filteredData.filter(tanda => likedIds.includes(tanda.id));
          } else {
            return [];
          }
        }

        return filteredData;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};