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
      console.log("Starting query execution with userId:", userId);
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

      if (searchParams) {
        console.log("Building query with search params:", searchParams);
        const visibilityConditions = [];

        if (searchParams.includeMine) {
          console.log("Including user's tandas");
          visibilityConditions.push(`user_id.eq.${userId}`);
        }
        if (searchParams.includePublic) {
          console.log("Including public tandas");
          visibilityConditions.push(`visibility.eq.public`);
        }
        if (searchParams.includeShared) {
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

        if (visibilityConditions.length > 0) {
          const orCondition = visibilityConditions.join(',');
          console.log("Applying visibility conditions:", orCondition);
          query = query.or(orCondition);
        } else {
          console.log("No visibility conditions specified, query will return no results");
          return [];
        }

        const { data, error } = await query;
        
        if (error) {
          console.error("Query error:", error);
          throw error;
        }
        
        console.log("Query successful, returned rows:", data?.length);
        return data || [];
      }

      console.log("No search params provided, executing base query");
      const { data, error } = await query;
      
      if (error) {
        console.error("Query error:", error);
        throw error;
      }
      
      console.log("Base query successful, returned rows:", data?.length);
      return data || [];
    },
    enabled: !!userId && searchTrigger > 0,
  });
};