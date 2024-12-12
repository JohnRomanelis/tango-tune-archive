import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import TandasHeader from "@/components/tanda/TandasHeader";
import TandasGrid from "@/components/tanda/TandasGrid";
import SpotifyPlayer from "@/components/SpotifyPlayer";

const Tandas = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const user = useAuthRedirect();

  const { data: tandas, isLoading, refetch } = useQuery({
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
          )
        `)
        .eq('user_id', user.id); // Filter tandas by user_id

      if (searchParams) {
        // Apply other filters if they exist
        if (searchParams.orchestra) {
          query = query.ilike('tanda_song.song.orchestra.name', `%${searchParams.orchestra}%`);
        }
        if (searchParams.type) {
          query = query.eq('tanda_song.song.type', searchParams.type);
        }
        if (searchParams.style) {
          query = query.eq('tanda_song.song.style', searchParams.style);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <TandasHeader onSearch={setSearchParams} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
          <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
        </div>
      ) : (
        <TandasGrid
          tandas={tandas || []}
          currentUserId={user.id}
          onTandaDeleted={refetch}
          onSongClick={handleSongClick}
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