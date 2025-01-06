import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLikedTandas = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["likedTandas", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('user_tanda_likes')
        .select('tanda_id')
        .eq('user_id', userId);
      return data?.map(like => like.tanda_id) || [];
    },
    enabled: !!userId,
  });
};