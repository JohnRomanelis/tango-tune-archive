import { useState } from "react";
import TandaSearch from "@/components/TandaSearch";
import TandasGrid from "@/components/tanda/TandasGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useTandasQuery } from "@/hooks/useTandasQuery";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface TandaSearchSectionProps {
  onAddTanda: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
}

const TandaSearchSection = ({ onAddTanda, onTandaClick }: TandaSearchSectionProps) => {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const { user } = useAuthRedirect();
  const { data: tandas, isLoading } = useTandasQuery(searchParams, user?.id);

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
      <TandasGrid
        tandas={tandas || []}
        onAddClick={onAddTanda}
        onTandaClick={onTandaClick}
        onSongClick={handleSongClick}
        showAddButton
      />
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