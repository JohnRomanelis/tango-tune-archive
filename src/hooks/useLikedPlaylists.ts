import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLikedPlaylists = () => {
  return useQuery({
    queryKey: ["liked-playlists"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from("user_playlist_likes")
        .select("playlist_id")
        .eq("user_id", user.id);
      
      return (data || []).map(like => like.playlist_id);
    },
  });
};