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

export const useTandasQuery = (
  searchParams: TandaSearchParams | null, 
  userId: string | undefined,
  searchTrigger: number
) => {
  return useQuery({
    queryKey: ["tandas", searchParams, userId, searchTrigger],
    queryFn: async () => {
      console.log("Starting tanda query with params:", { searchParams, userId });
      
      if (!userId) {
        console.log("No user ID provided, returning empty array");
        return [];
      }

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

      // Build visibility conditions based on search params
      const visibilityConditions = [];

      if (searchParams?.includeMine) {
        console.log("Including user's tandas");
        visibilityConditions.push(`user_id.eq.${userId}`);
      }

      if (searchParams?.includePublic) {
        console.log("Including public tandas");
        visibilityConditions.push("visibility.eq.public");
      }

      if (searchParams?.includeShared) {
        console.log("Including shared tandas");
        const { data: sharedTandas } = await supabase
          .from('tanda_shared')
          .select('tanda_id')
          .eq('user_id', userId);
        
        if (sharedTandas?.length) {
          const sharedIds = sharedTandas.map(st => st.tanda_id);
          visibilityConditions.push(`id.in.(${sharedIds.join(',')})`);
        }
      }

      // Apply visibility conditions
      if (visibilityConditions.length > 0) {
        query = query.or(visibilityConditions.join(','));
      } else {
        console.log("No visibility conditions specified, returning empty array");
        return [];
      }

      // Apply additional filters if provided
      if (searchParams?.orchestra) {
        query = query.contains('tanda_song.song.orchestra.name', searchParams.orchestra);
      }

      if (searchParams?.singer && !searchParams.isInstrumental) {
        query = query.contains('tanda_song.song.song_singer.singer.name', searchParams.singer);
      }

      if (searchParams?.type) {
        query = query.eq('tanda_song.song.type', searchParams.type);
      }

      if (searchParams?.style && searchParams.type === 'tango') {
        query = query.eq('tanda_song.song.style', searchParams.style);
      }

      if (searchParams?.yearFrom) {
        query = query.gte('tanda_song.song.recording_year', searchParams.yearFrom);
      }

      if (searchParams?.yearTo) {
        query = query.lte('tanda_song.song.recording_year', searchParams.yearTo);
      }

      if (searchParams?.isInstrumental !== undefined) {
        query = query.eq('tanda_song.song.is_instrumental', searchParams.isInstrumental);
      }

      console.log("Executing query with conditions:", query);
      const { data, error } = await query;

      if (error) {
        console.error("Query error:", error);
        throw error;
      }

      if (searchParams?.includeLiked) {
        const { data: likedTandas } = await supabase
          .from('user_tanda_likes')
          .select('tanda_id')
          .eq('user_id', userId);

        const likedTandaIds = new Set(likedTandas?.map(lt => lt.tanda_id) || []);
        return (data || []).filter(tanda => likedTandaIds.has(tanda.id));
      }

      console.log("Query successful, returned rows:", data?.length);
      return data || [];
    },
    enabled: !!userId && searchTrigger > 0,
  });
};