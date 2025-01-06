import { useState } from "react";
import TandaSearch from "@/components/TandaSearch";
import TandasGrid from "@/components/tanda/TandasGrid";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useTandasQuery } from "@/hooks/useTandasQuery";
import { useSession } from "@supabase/auth-helpers-react";
import { SearchParams } from "@/types/tanda";
import { Loader2 } from "lucide-react";

interface TandaSearchSectionProps {
  onAddTanda: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
}

const TandaSearchSection = ({ onAddTanda, onTandaClick }: TandaSearchSectionProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const session = useSession();
  
  const { data: tandas, isLoading } = useTandasQuery(searchParams, session?.user?.id);

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
      
      {isLoading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
        </div>
      ) : (
        <TandasGrid
          tandas={tandas || []}
          onAddClick={onAddTanda}
          onTandaClick={onTandaClick}
          onSongClick={handleSongClick}
          showAddButton
        />
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