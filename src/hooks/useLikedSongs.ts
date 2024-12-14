import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLikedSongs = () => {
  return useQuery({
    queryKey: ["liked-songs"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from("user_song_likes")
        .select("song_id")
        .eq("user_id", user.id);
      
      return (data || []).map(like => like.song_id);
    },
  });
};