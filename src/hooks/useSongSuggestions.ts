import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SongSuggestion, SuggestionStatus } from "@/types/song";

export const useSongSuggestions = (statuses: SuggestionStatus[]) => {
  return useQuery({
    queryKey: ["song-suggestions", statuses],
    queryFn: async () => {
      console.log("Fetching suggestions with statuses:", statuses);
      const { data, error } = await supabase
        .from("suggested_song")
        .select(`
          *,
          orchestra:orchestra_id (
            id,
            name
          ),
          suggested_song_singer!inner (
            singer!inner (
              id,
              name
            )
          )
        `)
        .in("status", statuses);

      if (error) {
        console.error("Error fetching suggestions:", error);
        throw error;
      }
      
      console.log("Fetched suggestions:", data);
      return data as SongSuggestion[];
    },
    enabled: statuses.length > 0,
  });
};