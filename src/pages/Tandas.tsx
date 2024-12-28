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
        `);

      if (searchParams) {
        const userId = user?.id;
        const visibilityConditions = [];

        // Handle visibility filters
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

        if (visibilityConditions.length > 0) {
          query = query.or(visibilityConditions.join(','));
        }

        // Apply other filters
        if (searchParams.type) {
          query = query.eq('tanda_song.song.type', searchParams.type);
        }
        if (searchParams.style) {
          query = query.eq('tanda_song.song.style', searchParams.style);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data || [];

      // Filter tandas based on orchestra after fetching
      if (searchParams?.orchestra && filteredData) {
        filteredData = filteredData.filter(tanda => 
          tanda.tanda_song.some(ts => 
            ts.song.orchestra?.name.toLowerCase() === searchParams.orchestra.toLowerCase()
          )
        );
      }

      // Filter tandas based on singer after fetching
      if (searchParams?.singer && filteredData) {
        filteredData = filteredData.filter(tanda =>
          tanda.tanda_song.some(ts =>
            ts.song.song_singer.some(ss =>
              ss.singer.name.toLowerCase() === searchParams.singer.toLowerCase()
            )
          )
        );
      }

      // Filter instrumental tandas
      if (searchParams?.isInstrumental) {
        filteredData = filteredData.filter(tanda =>
          tanda.tanda_song.every(ts =>
            ts.song.song_singer.length === 0 || ts.song.is_instrumental === true
          )
        );
      }

      return filteredData;
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