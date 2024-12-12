import { useState } from "react";
import TandaSearch from "@/components/TandaSearch";
import TandasGrid from "@/components/tanda/TandasGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SpotifyPlayer from "@/components/SpotifyPlayer";

interface TandaSearchSectionProps {
  onAddTanda: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
}

const TandaSearchSection = ({ onAddTanda, onTandaClick }: TandaSearchSectionProps) => {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const { data: tandas } = useQuery({
    queryKey: ["tandas", searchParams],
    queryFn: async () => {
      if (!searchParams) return [];  // Return empty array if no search params

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
    enabled: !!searchParams, // Only run query when search params exist
  });

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  const handleSongClick = (spotify_id: string | null) => {
    if (spotify_id) {
      setSelectedTrackId(spotify_id);
    }
  };

  return (
    <div className="space-y-6">
      <TandaSearch onSearch={handleSearch} />
      {searchParams ? (
        <TandasGrid
          tandas={tandas || []}
          onAddClick={onAddTanda}
          onTandaClick={onTandaClick}
          onSongClick={handleSongClick}
          showAddButton
        />
      ) : (
        <div className="text-center text-tango-light py-8">
          Use the search form above to find tandas
        </div>
      )}
      {selectedTrackId && (
        <SpotifyPlayer
          trackId={selectedTrackId}
          onClose={() => setSelectedTrackId(null)}
        />
      )}
    </div>
  );
};

export default TandaSearchSection;