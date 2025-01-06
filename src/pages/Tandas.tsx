import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import TandasHeader from "@/components/tanda/TandasHeader";
import TandasGrid from "@/components/tanda/TandasGrid";
import SpotifyPlayer from "@/components/SpotifyPlayer";

const Tandas = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuthRedirect();
  const queryClient = useQueryClient();

  const { data: tandas, isLoading: tandasLoading, refetch } = useQuery({
    queryKey: ["tandas", searchParams, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

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
          ),
          user_tanda_likes!inner (
            user_id
          )
        `);

      if (searchParams) {
        const userId = user.id;
        const visibilityConditions = [];

        if (searchParams.includeMine && userId) {
          visibilityConditions.push(`user_id.eq.${userId}`);
        }
        if (searchParams.includePublic) {
          visibilityConditions.push(`visibility.eq.public`);
        }
        if (searchParams.includeShared && userId) {
          const { data: sharedTandas } = await supabase
            .from('tanda_shared')
            .select('tanda_id')
            .eq('user_id', userId);
          
          if (sharedTandas?.length) {
            const sharedIds = sharedTandas.map(st => st.tanda_id);
            visibilityConditions.push(`id.in.(${sharedIds.join(',')})`);
          }
        }
        if (searchParams.includeLiked && userId) {
          const { data: likedTandas } = await supabase
            .from('user_tanda_likes')
            .select('tanda_id')
            .eq('user_id', userId);

          if (likedTandas?.length) {
            const likedIds = likedTandas.map(lt => lt.tanda_id);
            visibilityConditions.push(`id.in.(${likedIds.join(',')})`);
          }
        }

        if (visibilityConditions.length > 0) {
          query = query.or(visibilityConditions.join(','));
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter tandas based on orchestra after fetching
      if (searchParams?.orchestra && data) {
        data = data.filter(tanda => 
          tanda.tanda_song.some(ts => 
            ts.song.orchestra?.name.toLowerCase() === searchParams.orchestra.toLowerCase()
          )
        );
      }

      // Filter tandas based on singer after fetching
      if (searchParams?.singer && data) {
        data = data.filter(tanda =>
          tanda.tanda_song.some(ts =>
            ts.song.song_singer.some(ss =>
              ss.singer.name.toLowerCase() === searchParams.singer.toLowerCase()
            )
          )
        );
      }

      // Filter instrumental tandas
      if (searchParams?.isInstrumental) {
        data = data.filter(tanda =>
          tanda.tanda_song.every(ts =>
            ts.song.song_singer.length === 0 || ts.song.is_instrumental === true
          )
        );
      }

      // Filter tandas based on type
      if (searchParams?.type) {
        data = data.filter(tanda =>
          tanda.tanda_song.some(ts => ts.song.type === searchParams.type)
        );
      }

      // Filter tandas based on style (only if type is tango)
      if (searchParams?.style && searchParams.type === 'tango') {
        data = data.filter(tanda =>
          tanda.tanda_song.some(ts => ts.song.style === searchParams.style)
        );
      }

      // Filter tandas based on year range
      if (searchParams?.yearFrom || searchParams?.yearTo) {
        data = data.filter(tanda =>
          tanda.tanda_song.some(ts => {
            const year = ts.song.recording_year;
            if (!year) return false;
            
            const isAfterStart = !searchParams.yearFrom || year >= searchParams.yearFrom;
            const isBeforeEnd = !searchParams.yearTo || year <= searchParams.yearTo;
            
            return isAfterStart && isBeforeEnd;
          })
        );
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: likedTandas } = useQuery({
    queryKey: ["likedTandas", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from('user_tanda_likes')
        .select('tanda_id')
        .eq('user_id', user.id);
      return data?.map(like => like.tanda_id) || [];
    },
    enabled: !!user?.id,
  });

  const likeMutation = useMutation({
    mutationFn: async ({ tandaId, isLiked }: { tandaId: number; isLiked: boolean }) => {
      if (!user?.id) throw new Error("User not authenticated");

      if (isLiked) {
        const { error } = await supabase
          .from('user_tanda_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('tanda_id', tandaId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_tanda_likes')
          .insert({ user_id: user.id, tanda_id: tandaId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likedTandas"] });
      queryClient.invalidateQueries({ queryKey: ["tandas"] });
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update tanda like status",
        variant: "destructive",
      });
    },
  });

  const handleLikeClick = (tandaId: number, isLiked: boolean) => {
    likeMutation.mutate({ tandaId, isLiked });
  };

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <TandasHeader onSearch={setSearchParams} />
      
      {tandasLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
          <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
        </div>
      ) : (
        <TandasGrid
          tandas={tandas || []}
          currentUserId={user?.id}
          onTandaDeleted={refetch}
          onSongClick={handleSongClick}
          onLikeClick={handleLikeClick}
          likedTandaIds={likedTandas}
        />
      )}

      {selectedTrackId && (
        <SpotifyPlayer
          trackId={selectedTrackId}
          onClose={() => setSelectedTrackId(null)}
        />
      )}
    </main>
  );
};

export default Tandas;
