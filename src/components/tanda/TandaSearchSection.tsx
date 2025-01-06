import { useState } from "react";
import TandaSearch from "@/components/TandaSearch";
import TandasGrid from "@/components/tanda/TandasGrid";
import { useTandasQuery } from "@/hooks/useTandasQuery";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useAuth } from "@supabase/auth-helpers-react";
import { SearchParams } from "@/types/tanda";

interface TandaSearchSectionProps {
  onAddTanda: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
}

const TandaSearchSection = ({ onAddTanda, onTandaClick }: TandaSearchSectionProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const user = useAuth();

  const { data: tandas } = useTandasQuery(searchParams, user?.id);

  const handleSearch = (params: SearchParams) => {
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